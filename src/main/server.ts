import http from "http"
import { URL } from "url"
import getRawBody from "raw-body"
import { debug } from "@utils"
import { Request, Response, Route, ResponseFunction } from "@types"

import retrieveLogins from "@routes/logins/retrieveLogins"
import retrieveSettings from "@routes/settings/retrieveSettings"
import updateSetting from "@routes/settings/updateSetting"
import install from "@routes/install"
import login from "@routes/login"
import createLogin from "@routes/logins/createLogin"
import updateLogin from "@routes/logins/updateLogin"
import retrieveLogin from "@routes/logins/retrieveLogin"
import deleteLogin from "@routes/logins/deleteLogin"

let _server: http.Server | null = null
const port = import.meta.env.MAIN_VITE_SERVER_PORT ?? 3000

const _routes: Route[] = [
	{
		path: "/install",
		method: "POST",
		handler: install,
	},
	{
		path: "/login",
		method: "POST",
		handler: login,
	},
	{
		path: "/settings",
		method: "GET",
		handler: retrieveSettings,
	},
	{
		path: "/settings",
		method: "PUT",
		handler: updateSetting,
	},
	{
		path: "/logins?",
		method: "GET",
		handler: retrieveLogins,
	},
	{
		path: "/logins",
		method: "POST",
		handler: createLogin,
	},
	{
		path: "/login?",
		method: "GET",
		handler: retrieveLogin,
	},
	{
		path: "/login?",
		method: "PUT",
		handler: updateLogin,
	},
	{
		path: "/login?",
		method: "DELETE",
		handler: deleteLogin,
	},
]

const response: ResponseFunction = (res, statusCode, data = null) => {
	res.statusCode = statusCode
	res.setHeader("Content-Type", "application/json")
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Accept, X-Requested-With, User-Agent, Referer"
	)
	res.setHeader(
		"Access-Control-Allow-Methods",
		"OPTIONS, GET, POST, PUT, DELETE"
	)

	if (statusCode === 204) {
		res.end()
	} else {
		res.end(JSON.stringify(data))
	}
}

const routeNotFoundResponse = (res: Response) => {
	debug(`Route not found: ${res?.req?.url}`)
	response(res, 404, { message: "Not Found" })
}

const parseBody = async (req: Request) => {
	try {
		const body = await getRawBody(req, {
			encoding: true,
		})

		return JSON.parse(body)
	} catch (error: any) {
		debug("Error parsing body", {
			message: error.message,
		})
		return {}
	}
}

const router = async (req: Request, res: Response) => {
	if (!req.url || !req.method) {
		routeNotFoundResponse(res)
		return
	}

	const requestURL = new URL(req.url, `http://${req.headers.host}`)
	const path = `${requestURL.pathname}${requestURL.search?.[0] ?? ""}`
	const method = req.method.toUpperCase()
	req.query = requestURL.searchParams

	debug(`Request received`, {
		path,
		method,
	})

	if (method === "OPTIONS") {
		return response(res, 200, { message: "OK" })
	} else if (!["GET", "DELETE"].includes(method)) {
		req.body = await parseBody(req)
	}

	const route = _routes.find((route: Route) => {
		return route.path === path && route.method === method
	})

	res.req = req
	if (route) {
		route.handler(res, response)
	} else {
		routeNotFoundResponse(res)
	}
}

export function initServer() {
	if (_server) {
		deInitServer()
	}
	_server = http.createServer(router).listen(port, () => {
		debug(`Server running at http://localhost:${port}`)
	})
}

export function deInitServer() {
	if (!_server) {
		return
	}

	debug("Server shutting down")
	_server.close()
	_server = null
}
