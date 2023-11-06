import { reactive, computed } from "vue"
// import { createStore } from "vuex"
import axios from "@/plugins/axios"

const state = reactive({
	isLoading: false,
	logins: [],
	activeLogin: "-1",
	activeLoginPassword: "",
	mode: "v",
	searchText: "",
	appSettings: {},
})
const getters = {
	getIsLoading: computed(() => state.isLoading),
	getLoginList: computed(() => state.logins),
	getActiveLogin: computed(() => state.activeLogin),
	getActiveLoginPassword: computed(() => state.activeLoginPassword),
	getMode: computed(() => state.mode),
	getSearchText: computed(() => state.searchText),
	getAppSettings: computed(() => state.appSettings),
}

export default reactive({
	state,
	getters: {
		...getters,
	},
	// mutations: {
	// 	isLoading(state, status) {
	// 		state.isLoading = status
	// 	},
	// 	retrievelogins(state, logins) {
	// 		state.logins = logins
	// 	},
	// 	updateActiveLoginPassword(state, loginPassword) {
	// 		state.activeLoginPassword = loginPassword
	// 	},
	// 	updateActiveLogin(state, loginId) {
	// 		state.activeLogin = loginId
	// 	},
	// 	setMode(state, modeName) {
	// 		state.mode = modeName
	// 	},
	// 	setSearchText(state, newSearchText) {
	// 		state.searchText = newSearchText
	// 	},
	// 	updateAppSettings(state, appSettings) {
	// 		state.appSettings = appSettings
	// 	},
	// },
	init: function () {
		this.retrieveAppSettings()
	},
	retrieveAppSettings: function () {
		axios
			.get("/settings")
			.then((response) => {
				console.log("response", response)
			})
			.catch((error) => {
				console.log("error", error)
			})
	},
	// actions: {
	// 	dispatchEvent(
	// 		{ commit },
	// 		{ eventName, params = null, response = true }
	// 	) {
	// 		if (response) {
	// 			return new Promise((resolve) => {
	// 				commit("isLoading", true)
	// 				window.ipcRenderer
	// 					.invoke(eventName, params)
	// 					.then((eventResult) => {
	// 						commit("isLoading", false)
	// 						resolve(eventResult)
	// 					})
	// 			})
	// 		} else {
	// 			window.ipcRenderer.send(eventName)
	// 		}
	// 	},
	// 	maximizeApplication({ dispatch }) {
	// 		dispatch("dispatchEvent", {
	// 			eventName: "maximize-application",
	// 			response: false,
	// 		})
	// 	},
	// 	exitApplication({ dispatch }) {
	// 		dispatch("dispatchEvent", {
	// 			eventName: "exit-application",
	// 			response: false,
	// 		})
	// 	},
	// 	minimizeApplication({ dispatch }) {
	// 		dispatch("dispatchEvent", {
	// 			eventName: "minimize-application",
	// 			response: false,
	// 		})
	// 	},
	// 	validatePassPhrase({ dispatch }, passPhrase) {
	// 		return new Promise((resolve) => {
	// 			dispatch("dispatchEvent", {
	// 				eventName: "validate-passphrase",
	// 				params: { passPhrase },
	// 			}).then(resolve)
	// 		})
	// 	},
	// 	createPassPhrase({ dispatch }, passPhrase) {
	// 		return new Promise((resolve) => {
	// 			dispatch("dispatchEvent", {
	// 				eventName: "create-passphrase",
	// 				params: { passPhrase },
	// 			}).then(resolve)
	// 		})
	// 	},
	// 	validateInstalltion({ dispatch }) {
	// 		return new Promise((resolve) => {
	// 			dispatch("dispatchEvent", {
	// 				eventName: "validate-installation",
	// 			}).then(resolve)
	// 		})
	// 	},
	// 	retrieveAppSettings({ dispatch, commit }) {
	// 		return new Promise((resolve) => {
	// 			dispatch("dispatchEvent", {
	// 				eventName: "retrieve-settings",
	// 			}).then((appSettings) => {
	// 				commit("updateAppSettings", appSettings)
	// 				resolve({})
	// 			})
	// 		})
	// 	},
	// 	updateAppSettings({ dispatch, commit }, newAppSettings) {
	// 		return new Promise((resolve) => {
	// 			dispatch("dispatchEvent", {
	// 				eventName: "update-settings",
	// 				params: { newAppSettings: { ...newAppSettings } },
	// 			}).then(() => {
	// 				commit("updateAppSettings", newAppSettings)
	// 				resolve({})
	// 			})
	// 		})
	// 	},
	// 	retrieveLogins({ commit, dispatch }) {
	// 		dispatch("dispatchEvent", { eventName: "read-logins" }).then(
	// 			(logins) => {
	// 				commit("retrievelogins", logins)

	// 				if (logins.length) {
	// 					dispatch("activeLoginChange", logins[0].id)
	// 				} else {
	// 					dispatch("activeLoginChange", "-1")
	// 				}
	// 			}
	// 		)
	// 	},
	// 	activeLoginChange({ getters, commit, dispatch }, loginId) {
	// 		if (getters.getMode === "v") {
	// 			commit("updateActiveLogin", loginId)
	// 			dispatch("retrieveLogin")
	// 		}
	// 	},
	// 	setMode({ commit }, modeName) {
	// 		commit("setMode", modeName)
	// 	},
	// 	setEditMode({ dispatch }) {
	// 		dispatch("setMode", "e")
	// 	},
	// 	setDeleteMode({ dispatch }) {
	// 		dispatch("setMode", "d")
	// 	},
	// 	setCreateMode({ dispatch }) {
	// 		dispatch("activeLoginChange", "-1")
	// 		dispatch("setMode", "c")
	// 	},
	// 	setViewMode({ dispatch, getters }) {
	// 		const isOldModeCreate = getters.getMode === "c"
	// 		dispatch("setMode", "v")
	// 		isOldModeCreate &&
	// 			dispatch(
	// 				"activeLoginChange",
	// 				getters.getLoginList?.[0]?.id || -1
	// 			)
	// 	},
	// 	createNewLogin({ dispatch, getters }, newLogin) {
	// 		newLogin = {
	// 			website: newLogin.website,
	// 			username: newLogin.username,
	// 			password: newLogin.password,
	// 		}
	// 		dispatch("dispatchEvent", {
	// 			eventName: "create-login",
	// 			params: { newLoginInformation: newLogin },
	// 		}).then(() => {
	// 			dispatch("setViewMode")
	// 			dispatch("retrieveLogins")
	// 			dispatch(
	// 				"activeLoginChange",
	// 				getters.getLoginList?.[getters.getLoginList.length - 1]
	// 					?.id || "-1"
	// 			)
	// 		})
	// 	},
	// 	deleteLogin({ dispatch, getters }) {
	// 		dispatch("dispatchEvent", {
	// 			eventName: "delete-login",
	// 			params: { loginId: getters.getActiveLogin },
	// 		}).then(() => {
	// 			dispatch("setViewMode")
	// 			dispatch("retrieveLogins")
	// 		})
	// 	},
	// 	updateLogin({ dispatch, getters }, newLoginInformation) {
	// 		const activeLoginId = getters.getActiveLogin
	// 		newLoginInformation = {
	// 			website: newLoginInformation.website,
	// 			username: newLoginInformation.username,
	// 			password: newLoginInformation.password,
	// 		}
	// 		dispatch("dispatchEvent", {
	// 			eventName: "edit-login",
	// 			params: { loginId: activeLoginId, newLoginInformation },
	// 		}).then(() => {
	// 			dispatch("setViewMode")
	// 			dispatch("retrieveLogins")
	// 			dispatch("activeLoginChange", activeLoginId)
	// 		})
	// 	},
	// 	setSearchText({ commit }, newSearchText) {
	// 		commit("setSearchText", newSearchText)
	// 	},
	// },
})
