import { createRouter, createWebHashHistory } from "vue-router"
import PassPhraseView from "@views/PassPhraseView"

const routes = [
	{
		path: "/",
		name: "PassPhrase",
		component: PassPhraseView,
	},
	{
		path: "/",
		name: "home",
		component: () => import("@views/HomeView"),
	},
	{
		path: "/settings",
		name: "settings",
		component: () => import("@views/SettingsView"),
	},
	{
		path: "/install",
		name: "install",
		component: () => import("@views/InstallView"),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
