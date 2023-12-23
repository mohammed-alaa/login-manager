import type { IpcRenderer } from "electron"
import type { AxiosResponse } from "axios"

export * from "@globalTypes"

export type WindowType = Window &
	typeof globalThis & {
		ipcRenderer: IpcRenderer
	}

export type AxiosDataResponse<T> = AxiosResponse<T> & {
	data: T
}

export type AxsiosErrorResponse = {
	data: object
	status: number
	isCancelled: boolean
}
