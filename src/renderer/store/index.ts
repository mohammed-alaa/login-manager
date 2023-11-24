import { reactive, computed } from "vue"
import axios from "@/plugins/axios"
import type {
	StateType,
	StoreType,
	GetterType,
	WindowType,
	Settings,
	LoginItem,
	LoginList,
	LoginForm,
	InstallForm,
	CreateEditFormData,
	AppInformationType,
	RetrieveLoginListType,
} from "@types"

const state: StateType = reactive<StateType>({
	isLoading: false,
	logins: {
		data: [],
		loading: false,
		error: false,
		pagination: {
			page: 0,
			count: 0,
			sort: "desc",
			hasMore: false,
		},
	},
	activeLoginId: null,
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
	},
})

const getters: GetterType = {
	getIsLoading: computed(() => state.isLoading),
	getLogins: computed(() => state.logins),
	getActiveLoginId: computed({
		get: () => state.activeLoginId,
		set: (value: null | number) => (state.activeLoginId = value),
	}),
	getSearchText: computed(() => state.searchText),
	getAppInformation: computed(() => state.appInformation),
}

const store: StoreType = reactive<StoreType>({
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
		getLoginListPage: computed(() => getters.getLogins.value.pagination.page),
		getLoginListSort: computed(() => getters.getLogins.value.pagination.sort),
		isLoginListHasMore: computed(() => getters.getLogins.value.pagination.hasMore),
	},
	init: function () {
		this.checkForAppHeader()
	},
	retrieveAppSettings: function (): Promise<Settings> {
		return new Promise((resolve, reject) => {
			axios
				.get("/settings")
				.then((response) => resolve(response.data.settings))
				.catch((error) => reject(error.response.data))
		})
	},
	updateAppSettings: function (settings: Settings): Promise<Settings> {
		return new Promise((resolve, reject) => {
			axios
				.put("/settings", settings)
				.then((response) => resolve(response.data.settings))
				.catch((error) => reject(error.response.data))
		})
	},
	retrieveLogins: function (): Promise<LoginList> {
		if (this.getters.isLoginListLoading) {
			return
		}

		this.state.logins.loading = true
		this.state.logins.error = false

		return new Promise((resolve, reject) => {
			axios
				.get("/logins", {
					params: {
						search: this.getters.getSearchText,
						page: this.getters.getLoginListPage,
						sort: this.getters.getLoginListSort,
					},
				})
				.then((response) => {
					const data: RetrieveLoginListType = response.data
					this.state.logins.pagination.page++
					this.state.logins.pagination.hasMore = data.hasMore
					this.state.logins.pagination.count = data.count
					this.state.logins.data = [...this.state.logins.data, ...data.logins]
					resolve(data.logins)
				})
				.catch((error) => {
					this.state.logins.error = true
					reject(error)
				})
				.finally(() => {
					this.state.logins.loading = false
				})
		})
	},
	retrieveLogin: function (loginId: number): Promise<LoginItem> {
		return new Promise((resolve, reject) => {
			axios
				.get("/login", { params: { loginId } })
				.then(({ data }) => resolve(data.login))
				.catch((error) => reject(error.response.data))
		})
	},
	install: function (data: InstallForm): Promise<void> {
		return new Promise((resolve, reject) => {
			axios
				.post("/install", data)
				.then(() => resolve())
				.catch((error) => reject(error.response.data))
		})
	},
	login: function (data: LoginForm): Promise<void> {
		return new Promise((resolve, reject) => {
			axios
				.post("/login", data)
				.then(() => resolve())
				.catch((error) => reject(error.response.data))
		})
	},
	searchLogins: function (searchText: string): Promise<LoginList> {
		this.state.searchText = searchText.trim()
		this.state.logins.pagination.page = 0
		this.state.logins.data = []
		return this.retrieveLogins()
	},
	updateLoginsSortOrder: function (): Promise<LoginList> {
		this.state.logins.pagination.sort = (this.getters.getLoginListSort === "asc" ? "desc" : "asc")
		this.state.logins.pagination.page = 0
		this.state.logins.data = []
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
			axios
				.post("/logins", data)
				.then(() => resolve())
				.catch((error) => reject(error.response.data))
		})
	},
	updateLogin: function (
		loginId: number,
		data: CreateEditFormData
	): Promise<void> {
		return new Promise((resolve, reject) => {
			axios
				.put("/login", data, { params: { loginId } })
				.then(() => resolve())
				.catch((error) => reject(error.response.data))
		})
	},
	deleteLogin: function (): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.getters.isActiveLoginValid) {
				reject()
			}

			axios
				.delete("/login", {
					params: { loginId: this.getters.getActiveLoginId },
				})
				.then(() => {
					this.retrieveLogins()
					this.resetActiveLoginId()
					resolve()
				})
				.catch(() => reject())
		})
	},
	dispatchEvent: function (eventName: string, { ...params } = {}) {
		return new Promise((resolve, reject) => {
			;(window as WindowType).ipcRenderer
				.invoke(eventName, params)
				.then((result: any) => resolve(result))
				.catch((error: any) => reject(error))
		})
	},
	checkForAppHeader: function () {
		this.dispatchEvent("app-init")
			.then((result: AppInformationType) => {
				this.state.appInformation = result
			})
			.catch((error: any) => {
				console.log("error", error)
			})
	},
	maximizeApplication: function () {
		this.dispatchEvent("maximize-application")
	},
	exitApplication: function () {
		this.dispatchEvent("exit-application")
	},
	minimizeApplication: function () {
		this.dispatchEvent("minimize-application")
	},
})

export default store
