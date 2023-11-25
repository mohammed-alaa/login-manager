import type { ComputedRef, WritableComputedRef } from "vue"
import type { LoginList, ipcRenderer, AppInformationType } from "@globalTypes"

export * from "@globalTypes"

export type StateType = {
	isLoading: boolean
	logins: {
		data: LoginList[]
		loading: boolean
		error: boolean
		pagination: {
			page: number
			count: number
			sort: "asc" | "desc"
			hasMore: boolean
		}
	}
	activeLoginId: null | number
	searchText: string
	appInformation: AppInformationType
	[key: string]: any
}

export type GetterType = {
	[key: string]: ComputedRef<any> | WritableComputedRef<any>
}

export type StoreType = {
	state: StateType
	getters: GetterType
	[key: string]: any
}

export type WindowType = Window &
	typeof globalThis & {
		ipcRenderer: ipcRenderer
	}
