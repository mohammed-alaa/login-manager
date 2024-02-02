import { ipcRenderer, contextBridge } from "electron"

contextBridge.exposeInMainWorld("ipcRenderer", {
	invoke: (channel: string, ...args: any) =>
		ipcRenderer.invoke(channel, ...args),
	send: (channel: string) => ipcRenderer.send(channel),
})
