import { createRouter, createWebHashHistory } from "vue-router"
import PassPhraseView from "@/router/PassPhraseView"

const routes = [
	{
		path: "/",
		name: "PassPhrase",
		component: PassPhraseView,
	},
	{
		path: "/home",
		name: "home",
		component: () => import("@/router/HomeView"),
	},
	{
		path: "/settings",
		name: "settings",
		component: () => import("@/router/SettingsView"),
	},
	{
		path: "/install",
		name: "install",
		component: () => import("@/router/InstallView"),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
