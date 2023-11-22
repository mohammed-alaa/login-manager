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
	logins: [],
	loginsNumber: 0,
	activeLoginId: null,
	searchText: "",
	appInformation: {
		appName: "",
		version: "",
		customAppHeader: false,
	},
})

const getters: GetterType = {
	getIsLoading: computed(() => state.isLoading),
	getLoginList: computed(() => state.logins),
	loginsNumber: computed(() => state.loginsNumber),
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
		return new Promise((resolve, reject) => {
			axios
				.get("/logins", { params: { search: this.getters.getSearchText }})
				.then((response) => {
					const data: RetrieveLoginListType = response.data
					this.state.logins = data.logins
					this.state.loginsNumber = data.loginsNumber
					resolve(data.logins)
				})
				.catch((error) => {
					console.log("error", error)
					reject(error)
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
