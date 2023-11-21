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
} from "@types"

const state: StateType = reactive<StateType>({
	isLoading: false,
	logins: [],
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
		loginsNumber: computed(() => getters.getLoginList.value.length),
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
				.get("/logins")
				.then((response) => {
					this.state.logins = response.data.logins
					resolve(response.data.logins)
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
				.get("/logins", { params: { loginId } })
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
	searchLogins: function (searchText: string): Promise<void> {
		return new Promise((resolve, reject) => {
			axios
				.get(`/logins/search/${searchText}`)
				.then((response) => {
					this.state.logins = response.data.logins
					resolve()
				})
				.catch((error) => reject(error.response.data))
		})
	},
	clearActiveLoginId: function () {
		this.state.activeLoginId = null
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
				.put("/logins", data, { params: { loginId } })
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
				.delete("/logins", {
					params: { loginId: this.getters.getActiveLoginId },
				})
				.then(() => {
					this.retrieveLogins()
					this.clearActiveLoginId()
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
