import http from "http"
import { URL } from "url"
import requestParser from "./body-parsers"
import { debug, reportError } from "@utils"
import type {
	Request,
	Response,
	Route,
	ResponseFunction,
	BodyParser,
} from "@types"
import retrieveLogins from "@routes/logins/retrieveLogins"
import retrieveSettings from "@routes/settings/retrieveSettings"
import updateApplicationSettings from "@routes/settings/updateApplicationSettings"
import install from "@routes/install"
import login from "@routes/login"
import createLogin from "@routes/logins/createLogin"
import updateLogin from "@routes/logins/updateLogin"
import retrieveLogin from "@routes/logins/retrieveLogin"
import deleteLogin from "@routes/logins/deleteLogin"
import changePassword from "@routes/settings/changePassword"
import importLogins from "@routes/import"

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
		path: "/settings/application",
		method: "PUT",
		handler: updateApplicationSettings,
	},
	{
		path: "/settings/change-password",
		method: "PUT",
		handler: changePassword,
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
	{
		path: "/import",
		method: "POST",
		handler: importLogins,
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

const parseBody: BodyParser = (req, res) => {
	return new Promise((resolve) => {
		requestParser(req, res)
			.then((body) => resolve(body))
			.catch((error) => {
				reportError("Error parsing body", {
					message: error.message,
				})
				resolve({})
			})
	})
}

const matchRoute = (path: string, method: string) => {
	return _routes.find((route: Route) => {
		return route.path === path && route.method === method
	})
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
		req.body = await parseBody(req, res)
	}

	const route = matchRoute(path, method)

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
