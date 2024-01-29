import type { IpcRenderer } from "electron"
import type { AxiosResponse } from "axios"

export * from "@globalTypes"

type DOMRect = {
	bottom: number
	height: number
	left: number
	right: number
	top: number
	width: number
	x: number
	y: number
}

export type WindowType = Window &
	typeof globalThis & {
		ipcRenderer: IpcRenderer
		navigator: Navigator & {
			windowControlsOverlay: {
				getTitlebarAreaRect: () => DOMRect
			}
		}
	}

export type AxiosDataResponse<T> = AxiosResponse<T> & {
	data: T
}

export type AxsiosErrorResponse = {
	data: object
	status: number
	isCancelled: boolean
}
