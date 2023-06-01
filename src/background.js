"use strict";

import { join } from "path";
import {
	app,
	protocol,
	BrowserWindow,
	ipcMain,
	shell,
	Tray,
	Menu,
	nativeImage,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import AutoLaunch from "auto-launch";
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
} from "@/utils/backend";

const isDevelopment = process.env.NODE_ENV !== "production";

protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: { secure: true, standard: true } },
]);

let mainWindow = null;
let tray = null;

async function createWindow() {
	const iconPath = join(__static, "icon_512x512.png");
	mainWindow = new BrowserWindow({
		minWidth: 900,
		minHeight: 700,
		title: "Login Manager",
		autoHideMenuBar: true,
		titleBarStyle: "hidden",
		center: true,
		darkTheme: true,
		show: !(
			process.appSettings.startOnLogin &&
			process.appSettings.startMinimized
		),
		paintWhenInitiallyHidden: !(
			process.appSettings.startOnLogin &&
			process.appSettings.startMinimized
		),
		icon: nativeImage.createFromPath(iconPath),
		webPreferences: {
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
			preload: join(__dirname, "preload.js"),
			devTools: isDevelopment,
			defaultEncoding: "UTF-8",
		},
	});

	tray = new Tray(nativeImage.createFromPath(iconPath));
	tray.setTitle(mainWindow.getTitle());
	tray.setToolTip(mainWindow.getTitle());
	tray.setContextMenu(
		Menu.buildFromTemplate([
			{
				label: "Hide App",
				role: "hide",
				click: () => mainWindow.hide(),
			},
			{
				label: "Quit",
				role: "quit",
				click: () => mainWindow.close(),
			},
		])
	);

	tray.on("click", () => {
		BrowserWindow.getAllWindows()[0].isVisible()
			? BrowserWindow.getAllWindows()[0].hide()
			: BrowserWindow.getAllWindows()[0].show();
	});

	mainWindow.on("show", () => {
		tray.setContextMenu(
			Menu.buildFromTemplate([
				{
					label: "Hide App",
					role: "hide",
					click: () => mainWindow.hide(),
				},
				{
					label: "Quit",
					role: "quit",
					click: () => mainWindow.close(),
				},
			])
		);
	});

	mainWindow.on("hide", () => {
		tray.setContextMenu(
			Menu.buildFromTemplate([
				{
					label: "Show App",
					role: "unhide",
					click: () => mainWindow.show(),
				},
				{
					label: "Quit",
					role: "quit",
					click: () => mainWindow.close(),
				},
			])
		);
	});

	mainWindow.on("closed", function () {
		mainWindow = null;
	});

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) {
			mainWindow.webContents.openDevTools();
		}
	} else {
		createProtocol("app");
		mainWindow.setMenu(null);
		mainWindow.loadURL("app://./index.html");
	}

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: "deny" };
	});
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) createMainWindow();
});

app.on("ready", async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		try {
			await installExtension(VUEJS3_DEVTOOLS);
		} catch (e) {
			console.error("Vue Devtools failed to install:", e.toString());
		}
	}

	createMainWindow();
});

const createMainWindow = () => {
	validateInstallation(getAppDataPath());
	console.log("settings", process.appSettings);
	// if (!isDevelopment) {
	// app.setLoginItemSettings({
	// 	openAtLogin: process.appSettings.startOnLogin,
	// 	openAsHidden:
	// 		process.appSettings.startOnLogin &&
	// 		process.appSettings.startMinimized,
	// 	enabled: process.appSettings.startOnLogin,
	// 	name: "Login Manager",
	// });
	// }

	const autoLaunch = new AutoLaunch({
		name: "Login Manager",
		path: app.getPath("exe"),
		isHidden:
			process.appSettings.startOnLogin &&
			process.appSettings.startMinimized,
	});

	autoLaunch.isEnabled().then((isEnabled) => {
		if (!isEnabled) autoLaunch.enable();
	});

	createWindow();

	// if (
	// 	process.appSettings.startOnLogin &&
	// 	process.appSettings.startMinimized
	// ) {
	// 	mainWindow.hide();
	// } else {
	// 	mainWindow.show();
	// }
};

if (isDevelopment) {
	if (process.platform === "win32") {
		process.on("message", (data) => {
			if (data === "graceful-exit") {
				app.quit();
			}
		});
	} else {
		process.on("SIGTERM", () => {
			app.quit();
		});
	}
}

const getAppDataPath = () => {
	return join(app.getPath("appData"), app.getName());
};

// IPCMain Events
ipcMain.on("exit-application", () => {
	mainWindow.hide();
});

ipcMain.on("minimize-application", () => {
	mainWindow.minimize();
});

ipcMain.on("maximize-application", () => {
	mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
});

ipcMain.handle("validate-installation", () => {
	return process.appSettings.loaded;
});

ipcMain.handle("retrieve-settings", () => {
	return {
		startMinimized: !!process.appSettings.startMinimized,
		startOnLogin: !!process.appSettings.startOnLogin,
	};
});

ipcMain.handle("update-settings", (event, { newAppSettings }) => {
	updateSettings(getAppDataPath(), newAppSettings);
	return null;
});

ipcMain.handle("validate-passphrase", (event, { passPhrase }) => {
	const validationResult = validatePassPhrase(passPhrase);
	if (validatePassPhrase) {
		process.env.decryptionKey = passPhrase;
	}
	return validationResult;
});

ipcMain.handle("create-passphrase", (event, { passPhrase }) => {
	createPassPhrase(getAppDataPath(), passPhrase);
	return null;
});

ipcMain.handle("read-logins", () => {
	readDBLogins(getAppDataPath());
	return process.data.logins;
});

ipcMain.handle("read-login", (event, { loginId }) => {
	const loginIndex = process.data.logins.findIndex(
		(login) => login.id === loginId
	);
	if (loginIndex === -1) return "";
	return decryptPassword(
		process.env.decryptionKey,
		process.data.logins[loginIndex].password
	);
});

ipcMain.handle("create-login", (event, { newLoginInformation }) => {
	saveNewLogin(getAppDataPath(), newLoginInformation);
	return null;
});

ipcMain.handle("delete-login", (event, { loginId }) => {
	deleteLogin(getAppDataPath(), loginId);
	return null;
});

ipcMain.handle("edit-login", (event, { loginId, newLoginInformation }) => {
	updateLogin(getAppDataPath(), loginId, newLoginInformation);
	return null;
});
