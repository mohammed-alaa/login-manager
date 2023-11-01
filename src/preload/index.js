const { ipcRenderer, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("ipcRenderer", {
	invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
	send: (channel) => ipcRenderer.send(channel),
})
