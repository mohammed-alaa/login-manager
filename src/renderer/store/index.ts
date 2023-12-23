import { reactive, computed } from "vue"
import type { AxiosError } from "axios"
import axios from "@/plugins/axios"
import type {
	WindowType,
	Settings,
	LoginItem,
	LoginList,
	LoginForm,
	InstallForm,
	CreateEditFormData,
	AppInformationType,
	AxsiosErrorResponse,
	RetrieveLoginListType,
	ChangePrimaryPasswordForm,
} from "@types"

const state = reactive({
	isLoading: false,
	logins: {
		data: [] as LoginList,
		loading: false,
		error: false,
		pagination: {
			page: 0,
			count: 0,
			sort: "desc",
			hasMore: false,
		},
	},
	activeLoginId: null as null | number,
	searchText: "",
	appInformation: {
		customAppHeader: false,
		appName: "",
		version: "",
		homepage: "",
		description: "",
		repository: "",
		author: {
			name: "",
			email: "",
			url: "",
		},
		bugs: {
			email: "",
			url: "",
		},
	} as AppInformationType,
})

const getters = {
	getIsLoading: computed(() => state.isLoading),
	getLogins: computed(() => state.logins),
	getActiveLoginId: computed({
		get: () => state.activeLoginId,
		set: (value: null | number) => (state.activeLoginId = value),
	}),
	getSearchText: computed(() => state.searchText),
	getAppInformation: computed(() => state.appInformation),
}

const store = reactive({
	state,
	getters: {
		...getters,
		isActiveLoginValid: computed(
			() => getters.getActiveLoginId.value !== null
		),
		getLoginList: computed(() => getters.getLogins.value.data),
		isLoginListError: computed(() => getters.getLogins.value.error),
		isLoginListLoading: computed(() => getters.getLogins.value.loading),
		loginsNumber: computed(() => getters.getLogins.value.pagination.count),
		getLoginListPage: computed(
			() => getters.getLogins.value.pagination.page
		),
		getLoginListSort: computed(
			() => getters.getLogins.value.pagination.sort
		),
		isLoginListHasMore: computed(
			() => getters.getLogins.value.pagination.hasMore
		),
	},
	init: function () {
		this.checkForAppHeader()
	},
	constructUrl: function (url: string, params: any = {}): string {
		const urlParams = new URLSearchParams(params).toString()
		return `${url}?${urlParams}`
	},
	parseAxiosError: function (error: AxiosError): AxsiosErrorResponse {
		return {
			data: error.response?.data ?? {},
			status: error.response?.status ?? 500,
			isCancelled: error.message.startsWith("timeout"),
		}
	},
	sendAxiosRequest: function <T>(
		url: string,
		method: "get" | "post" | "put" | "delete",
		data: any = {}
	): Promise<T> {
		return new Promise((resolve, reject) => {
			axios({
				url,
				method,
				data,
			})
				.then((response) => resolve(response.data))
				.catch((error: AxiosError) =>
					reject(this.parseAxiosError(error))
				)
		})
	},
	retrieveAppSettings: function (): Promise<Settings> {
		return new Promise((resolve, reject) => {
			this.sendAxiosRequest<{ settings: Settings }>("/settings", "get")
				.then(({ settings }) => resolve(settings))
				.catch((error) => reject(error.data))
		})
	},
	updateAppSettings: function (settings: Settings): Promise<Settings> {
		return new Promise((resolve, reject) => {
			this.sendAxiosRequest<{ settings: Settings }>(
				"/settings/application",
				"put",
				settings
			)
				.then((data) => resolve(data.settings))
				.catch((error) => reject(error.data))
		})
	},
	retrieveLogins: function (): Promise<LoginList> {
		if (this.getters.isLoginListLoading) {
			return Promise.reject()
		}

		this.state.logins.loading = true
		this.state.logins.error = false

		return new Promise((resolve, reject) => {
			this.sendAxiosRequest<RetrieveLoginListType>(
				this.constructUrl("/logins", {
					search: this.getters.getSearchText,
					page: this.getters.getLoginListPage,
					sort: this.getters.getLoginListSort,
				}),
				"get"
			)
				.then((data) => {
					this.state.logins.pagination.page++
					this.state.logins.pagination.hasMore = data.hasMore
					this.state.logins.pagination.count = data.count
					this.state.logins.data = [
						...this.state.logins.data,
						...data.logins,
					]
					resolve(data.logins)
				})
				.catch((error) => {
					this.state.logins.error = true
					reject(error.data)
				})
				.finally(() => {
					this.state.logins.loading = false
				})
		})
	},
	retrieveLogin: function (loginId: number) {
		return new Promise((resolve, reject) => {
			this.sendAxiosRequest<{ login: LoginItem }>(
				this.constructUrl("/login", {
					loginId,
				}),
				"get"
			)
				.then((data) => resolve(data.login))
				.catch((error) => reject(error.data))
		})
	},
	install: function (data: InstallForm): Promise<void> {
		return new Promise((resolve, reject) => {
			this.sendAxiosRequest<{ login: LoginItem }>(
				"/install",
				"post",
				data
			)
				.then(() => resolve())
				.catch((error) => reject(error.data))
		})
	},
	login: function (data: LoginForm): Promise<void> {
		return new Promise((resolve, reject) => {
			this.sendAxiosRequest<Record<string, never>>("/login", "post", data)
				.then(() => resolve())
				.catch((error) => reject(error.data))
		})
	},
	resetLoginsPaginationData: function () {
		this.state.logins.pagination.page = 0
		this.state.logins.data = []
	},
	searchLogins: function (searchText: string): Promise<LoginList> {
		this.state.searchText = searchText.trim()
		this.resetLoginsPaginationData()
		return this.retrieveLogins()
	},
	updateLoginsSortOrder: function (): Promise<LoginList> {
		this.state.logins.pagination.sort =
			this.state.logins.pagination.sort === "asc" ? "desc" : "asc"
		this.resetLoginsPaginationData()
		return this.retrieveLogins()
	},
	resetActiveLoginId: function () {
		this.state.activeLoginId = null
	},
	resetSearch: function () {
		this.state.searchText = ""
	},
	createNewItem: function (data: CreateEditFormData): Promise<void> {
		return new Promise((resolve, reject) => {
			this.sendAxiosRequest<Record<string, never>>(
				"/logins",
				"post",
				data
			)
				.then(() => resolve())
				.catch((error) => reject(error.data))
		})
	},
	updateLogin: function (
		loginId: number,
		data: CreateEditFormData
	): Promise<void> {
		return new Promise((resolve, reject) => {
			this.sendAxiosRequest<Record<string, never>>(
				this.constructUrl("/login", {
					loginId,
				}),
				"put",
				data
			)
				.then(() => resolve())
				.catch((error) => reject(error.data))
		})
	},
	deleteLogin: function (): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.getters.isActiveLoginValid) {
				reject()
			}

			this.sendAxiosRequest<Record<string, never>>(
				this.constructUrl("/login", {
					loginId: this.getters.getActiveLoginId,
				}),
				"delete"
			)
				.then(() => {
					this.resetLoginsPaginationData()
					this.retrieveLogins()
					this.resetActiveLoginId()
					resolve()
				})
				.catch(() => reject())
		})
	},
	dispatchEvent: function <T>(
		eventName: string,
		{ ...params } = {}
	): Promise<T> {
		return new Promise((resolve, reject) => {
			;(window as WindowType).ipcRenderer
				.invoke(eventName, params)
				.then((result: T) => resolve(result))
				.catch((error: any) => reject(error))
		})
	},
	checkForAppHeader: function () {
		this.dispatchEvent<AppInformationType>("app-init")
			.then((result) => {
				this.state.appInformation = result
			})
			.catch((error: any) => {
				console.log("error", error)
			})
	},
	changePassword: function (data: ChangePrimaryPasswordForm): Promise<void> {
		return new Promise((resolve, reject) => {
			this.sendAxiosRequest<Record<string, never>>(
				"/settings/change-password",
				"put",
				data
			)
				.then(() => resolve())
				.catch((error) =>
					reject(
						(error.data?.errors ?? {}) as ChangePrimaryPasswordForm
					)
				)
		})
	},
})

export default store
