"use strict"

import { join } from "path"
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
import { createProtocol } from "vue-cli-plugin-electron-builder/lib"
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer"
import {
  validatePassPhrase,
  readDBLogins,
  saveNewLogin,
  deleteLogin,
  updateLogin,
  decryptPassword,
} from "@/utils/backend"

const isDevelopment = process.env.NODE_ENV !== "production"

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
])

let mainWindow = null
let tray = null

async function createWindow() {
  const iconPath = join(__static, "icon_512x512.png")
  mainWindow = new BrowserWindow({
    minWidth: 960,
    minHeight: 770,
    title: "Login Manager",
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    center: true,
    darkTheme: true,
    icon: nativeImage.createFromPath(iconPath),
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: join(__dirname, "preload.js"),
      devTools: isDevelopment,
      defaultEncoding: "UTF-8",
    },
  })

  tray = new Tray(nativeImage.createFromPath(iconPath))
  tray.setTitle(mainWindow.getTitle())
  tray.setToolTip(mainWindow.getTitle())
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
  )

  tray.on("click", () => {
    BrowserWindow.getAllWindows()[0].isVisible()
      ? BrowserWindow.getAllWindows()[0].hide()
      : BrowserWindow.getAllWindows()[0].show()
  })

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
    )
  })

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
    )
  })

  mainWindow.on("closed", function () {
    mainWindow = null
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) {
      mainWindow.webContents.openDevTools()
    }
  } else {
    createProtocol("app")
    mainWindow.setMenu(null)
    mainWindow.loadURL("app://./index.html")
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString())
    }
  }

  if (!isDevelopment) {
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: true,
    })
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
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
  mainWindow.hide()
})

ipcMain.on("minimize-application", () => {
  mainWindow.minimize()
})

ipcMain.on("maximize-application", () => {
  mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize()
})

ipcMain.handle("validate-passphrase", (event, { passPhrase }) => {
  const validationResult = validatePassPhrase(passPhrase)
  if (validatePassPhrase) {
    process.env.decryptionKey = passPhrase
  }
  return validationResult
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
