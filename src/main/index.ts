import { join, resolve } from "path"
import {
	app,
	protocol,
	BrowserWindow,
	ipcMain,
	shell,
	Tray,
	Menu,
	nativeImage,
} from "electron"
import {
	validatePassPhrase,
	readDBLogins,
	saveNewLogin,
	deleteLogin,
	updateLogin,
	decryptPassword,
	validateInstallation,
	createPassPhrase,
	updateSettings,
	isDevelopment,
	reportError,
} from "@utils"
import { initServer, deInitServer } from "./server"
import { initDatabase, deInitDatabase } from "@database"
import { initLogger, deInitLogger } from "./logger"

let tray: Tray | null = null
let isInDevelopment: boolean = false
let mainWindow: BrowserWindow | null = null

const initialize = () => {
	const appPath = getAppDataPath()
	isInDevelopment = isDevelopment()
	initDatabase(appPath)
	initServer()
	initLogger()
}

const deInit = () => {
	deInitDatabase()
	deInitServer()
	deInitLogger()
}

protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: { secure: true, standard: true } },
])

async function createWindow() {
	initialize()
	const icon = nativeImage.createFromPath(
		join(__dirname, "../../resources/icons/icon_512x512.png")
	)

	mainWindow = new BrowserWindow({
		minWidth: 900,
		minHeight: 700,
		title: "Login Manager",
		autoHideMenuBar: true,
		titleBarStyle: "hidden",
		center: true,
		darkTheme: true,
		show: isInDevelopment
			? true
			: !(
					process.appSettings.startOnLogin &&
					process.appSettings.startMinimized
			  ),
		paintWhenInitiallyHidden: isInDevelopment
			? true
			: !(
					process.appSettings.startOnLogin &&
					process.appSettings.startMinimized
			  ),
		icon: icon,
		webPreferences: {
			preload: resolve(__dirname, "../preload/index.js"),
			devTools: isInDevelopment,
			defaultEncoding: "UTF-8",
		},
	})

	tray = new Tray(icon)
	tray.setTitle(mainWindow.getTitle())
	tray.setToolTip(mainWindow.getTitle())
	tray.setContextMenu(
		Menu.buildFromTemplate([
			{
				label: "Hide App",
				role: "hide",
				click: () => mainWindow?.hide(),
			},
			{
				label: "Quit",
				role: "quit",
				click: () => mainWindow?.close(),
			},
		])
	)

	tray.on("click", () => {
		BrowserWindow.getAllWindows()[0].isVisible()
			? BrowserWindow.getAllWindows()[0].hide()
			: BrowserWindow.getAllWindows()[0].show()
	})

	mainWindow.on("show", () => {
		tray?.setContextMenu(
			Menu.buildFromTemplate([
				{
					label: "Hide App",
					role: "hide",
					click: () => mainWindow?.hide(),
				},
				{
					label: "Quit",
					role: "quit",
					click: () => mainWindow?.close(),
				},
			])
		)
	})

	mainWindow.on("hide", () => {
		tray?.setContextMenu(
			Menu.buildFromTemplate([
				{
					label: "Show App",
					role: "unhide",
					click: () => mainWindow?.show(),
				},
				{
					label: "Quit",
					role: "quit",
					click: () => mainWindow?.close(),
				},
			])
		)
	})

	mainWindow.on("closed", function () {
		deInit()
		tray?.destroy()
		mainWindow = null
		tray = null
	})

	if (isInDevelopment && process.env.ELECTRON_RENDERER_URL) {
		if (!process.env.IS_TEST) {
			mainWindow.webContents.openDevTools()
		}
		await mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
	} else {
		mainWindow.loadFile(resolve(__dirname, "../renderer/index.html"))
	}

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url)
		return { action: "deny" }
	})
}

process.on("uncaughtException", (error) => {
	reportError("An uncaught exception occurred:", {
		error: error,
	})
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (mainWindow === null) createMainWindow()
})

app.on("ready", () => {
	createMainWindow()
})

const createMainWindow = () => {
	validateInstallation(getAppDataPath())
	if (!isInDevelopment) {
		setAutoLaunch()
	}

	createWindow()
}

const setAutoLaunch = () => {
	app.setLoginItemSettings({
		name: "Login Manager",
		openAtLogin: process.appSettings.startOnLogin,
		openAsHidden: process.appSettings.startMinimized,
		executablePath: app.getPath("exe"),
	})
}

if (isInDevelopment) {
	if (process.platform === "win32") {
		process.on("message", (data) => {
			if (data === "graceful-exit") {
				app.quit()
			}
		})
	} else {
		process.on("SIGTERM", () => {
			app.quit()
		})
	}
}

const getAppDataPath = () => {
	return join(app.getPath("appData"), app.getName())
}

// IPCMain Events
ipcMain.on("exit-application", () => {
	mainWindow?.hide()
})

ipcMain.on("minimize-application", () => {
	mainWindow?.minimize()
})

ipcMain.on("maximize-application", () => {
	mainWindow?.isMaximized() ? mainWindow?.restore() : mainWindow?.maximize()
})

ipcMain.handle("validate-installation", () => {
	return process.appSettings.loaded
})

ipcMain.handle("retrieve-settings", () => {
	return {
		startMinimized: !!process.appSettings.startMinimized,
		startOnLogin: !!process.appSettings.startOnLogin,
	}
})

ipcMain.handle("update-settings", (event, { newAppSettings }) => {
	updateSettings(getAppDataPath(), newAppSettings)
	setAutoLaunch()
	return null
})

ipcMain.handle("validate-passphrase", (event, { passPhrase }) => {
	const validationResult = validatePassPhrase(passPhrase)
	if (validatePassPhrase) {
		process.env.decryptionKey = passPhrase
	}
	return validationResult
})

ipcMain.handle("create-passphrase", (event, { passPhrase }) => {
	createPassPhrase(getAppDataPath(), passPhrase)
	return null
})

ipcMain.handle("read-logins", () => {
	readDBLogins(getAppDataPath())
	return process.data.logins
})

ipcMain.handle("read-login", (event, { loginId }) => {
	const loginIndex = process.data.logins.findIndex(
		(login) => login.id === loginId
	)
	if (loginIndex === -1) return ""
	return decryptPassword(
		process.env.decryptionKey,
		process.data.logins[loginIndex].password
	)
})

ipcMain.handle("create-login", (event, { newLoginInformation }) => {
	saveNewLogin(getAppDataPath(), newLoginInformation)
	return null
})

ipcMain.handle("delete-login", (event, { loginId }) => {
	deleteLogin(getAppDataPath(), loginId)
	return null
})

ipcMain.handle("edit-login", (event, { loginId, newLoginInformation }) => {
	updateLogin(getAppDataPath(), loginId, newLoginInformation)
	return null
})
