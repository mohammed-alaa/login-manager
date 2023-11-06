import http from "http"
import { URL } from "url"
import { debug } from "@utils"
import { Request, Response, Route, ResponseFunction } from "@types"
// import retrieveLogins from "@routes/retrieveLogins"
import retrieveSettings from "@routes/settings/retrieveSettings"

let _server: http.Server | null = null
const port = import.meta.env.MAIN_VITE_SERVER_PORT ?? 3000

const _routes: Route[] = [
	{
		path: "/settings",
		method: "GET",
		handler: retrieveSettings,
	},
	// {
	// 	path: "/logins",
	// 	method: "GET",
	// 	handler: retrieveLogins,
	// },
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

const router = (req: Request, res: Response) => {
	if (!req.url || !req.method) {
		routeNotFoundResponse(res)
		return
	}

	const requestURL = new URL(req.url, `http://${req.headers.host}`)
	const path = requestURL.pathname
	const method = req.method.toUpperCase()

	debug(`Request received`, {
		path,
		method,
	})

	if (method === "OPTIONS") {
		return response(res, 200, { message: "OK" })
	}

	const route = _routes.find(
		(route) => route.path === path && route.method === method
	)

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
	_server?.closeAllConnections()
	_server?.close()
	_server = null
}
