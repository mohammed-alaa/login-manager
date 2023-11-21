import { createRouter, createWebHashHistory } from "vue-router"
import Login from "@views/Login.vue"

const routes = [
	{
		path: "/",
		name: "Login",
		component: Login,
	},
	{
		path: "/home",
		name: "home",
		component: () => import("@views/Home.vue"),
	},
	{
		path: "/settings",
		name: "settings",
		component: () => import("@views/Settings.vue"),
	},
	{
		path: "/install",
		name: "install",
		component: () => import("@views/Install.vue"),
	},
	{
		path: "/create",
		name: "create",
		component: () => import("@views/Create.vue"),
	},
	{
		path: "/edit/:id",
		name: "edit",
		component: () => import("@views/Edit.vue"),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
