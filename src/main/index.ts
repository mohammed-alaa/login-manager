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
	dialog,
} from "electron"
import {
	isMac,
	isWindows,
	reportError,
	isDevelopment,
	canShowCustomAppHeader,
} from "@utils"
import { initLogger, deInitLogger } from "./logger"
import { initServer, deInitServer } from "./server"
import { initDatabase, deInitDatabase } from "@database"
import type { Settings, AppInformationType } from "@types"
import {
	retrieveSettings,
	transformSettingsArrayToObject,
} from "@repositories/settings"
import packageJson from "../../package.json"

let tray: Tray | null = null
let mainWindow: BrowserWindow | null = null
let settings: Settings | null = null

const isInDevelopment = isDevelopment()
const icon = nativeImage.createFromPath(
	join(__dirname, "../../resources/icons/icon_512x512.png")
)

Menu.setApplicationMenu(null)
protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: { secure: true, standard: true } },
])

const setAutoLaunch = () => {
	app.setLoginItemSettings({
		name: packageJson.productName,
		openAtLogin: Boolean(settings?.startOnLogin),
		openAsHidden: Boolean(settings?.startMinimized),
	})
}

const setTrayMenu = () => {
	if (mainWindow?.isVisible()) {
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
	} else {
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
	}
}

const createTray = () => {
	tray = new Tray(icon)
	tray.setTitle(packageJson.productName)
	tray.setToolTip(packageJson.productName)
	tray.setIgnoreDoubleClickEvents(true)
	tray.on("click", () => {
		BrowserWindow.getAllWindows()[0].isVisible()
			? BrowserWindow.getAllWindows()[0].hide()
			: BrowserWindow.getAllWindows()[0].show()
	})
}

const createMainWindow = async () => {
	mainWindow = new BrowserWindow({
		minWidth: 700,
		minHeight: 600,
		title: packageJson.productName,
		autoHideMenuBar: true,
		frame: isWindows(),
		titleBarStyle: isWindows() ? "hidden" : "default",
		center: true,
		darkTheme: true,
		titleBarOverlay: isWindows()
			? {
					color: "#0000",
					symbolColor: "#fff",
					height: 48,
			  }
			: false,
		show: isInDevelopment
			? true
			: !(settings?.startOnLogin && settings?.startMinimized),
		paintWhenInitiallyHidden: isInDevelopment
			? true
			: !(settings?.startOnLogin && settings?.startMinimized),
		icon: icon,
		webPreferences: {
			preload: resolve(__dirname, "../preload/index.js"),
			devTools: isInDevelopment,
			defaultEncoding: "UTF-8",
		},
	})

	const isNotInstalled: boolean = !settings?.hashedPrimaryPassword

	if (isInDevelopment && process.env.ELECTRON_RENDERER_URL) {
		if (!process.env.IS_TEST) {
			mainWindow.webContents.openDevTools()
		}

		let rendererUrl = `${process.env.ELECTRON_RENDERER_URL}/#/`
		if (isNotInstalled) {
			rendererUrl += "install"
		}

		await mainWindow.loadURL(rendererUrl)
	} else {
		mainWindow.loadFile(resolve(__dirname, "../renderer/index.html"), {
			hash: isNotInstalled ? "install" : "",
		})
	}

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url)
		return { action: "deny" }
	})

	mainWindow.on("show", () => setTrayMenu())
	mainWindow.on("hide", () => setTrayMenu())
}

process.on("uncaughtException", (error) => {
	reportError("An uncaught exception occurred:", {
		error: error,
	})
})

// Emitted before the application starts closing its windows.
app.on("before-quit", () => {
	deInitServer()
	deInitDatabase()
	deInitLogger()
	tray?.destroy()
	tray = null
})

// Emitted when all windows have been closed.
app.on("window-all-closed", () => {
	if (!isMac()) {
		app.quit()
	}
})

// This event is specific to macOS.
// It’s emitted when the user clicks the dock icon and no other windows were open,
// or when the user switches back to your app after having switched away.
// This event can be emitted multiple times during the application lifecycle, whenever the user activates the app.
app.on("activate", () => {
	if (mainWindow === null) {
		createMainWindow()
	}
})

// This event is emitted when Electron has finished initializing.
// At this point, you can create browser windows and perform other most of the app initialization tasks.
// This event is emitted once per application lifecycle, shortly after the app starts up.
app.on("ready", async () => {
	initLogger()

	try {
		await initDatabase()
	} catch (error: any) {
		reportError("Error while initializing database", { error: error })
		dialog.showErrorBox("Initialization Error", error.message)
	}

	initServer()

	try {
		settings = transformSettingsArrayToObject(
			await retrieveSettings()
		) as Settings
	} catch (error) {
		reportError("Error while retrieving settings", { error: error })
	}

	if (!isInDevelopment) {
		setAutoLaunch()
	}

	createTray()
	createMainWindow()
	setTrayMenu()
})

if (isInDevelopment) {
	if (isWindows()) {
		process.on("message", (data) => {
			if (data === "graceful-exit") {
				app.quit()
			}
		})
	} else {
		process.on("SIGTERM", () => app.quit())
		process.on("SIGINT", () => app.quit())
		process.on("SIGHUP", () => app.quit())
	}
}

// IPCMain Events
ipcMain.handle("app-init", (): AppInformationType => {
	return {
		customAppHeader: canShowCustomAppHeader(),
		appName: packageJson.productName,
		version: packageJson.version,
		homepage: packageJson.homepage,
		description: packageJson.description,
		repository: packageJson.repository.url,
		bugs: packageJson.bugs,
		author: packageJson.author,
	}
})
