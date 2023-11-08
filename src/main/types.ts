import type { IncomingMessage, ServerResponse } from "http"

export * from "@globalTypes"

export type Request = IncomingMessage & {
	body?: any
}
export type Response = ServerResponse & {
	req: Request
}
export type ResponseData = object | string | number | boolean | null

export type ResponseFunction = (
	res: Response,
	statusCode: number,
	data: ResponseData
) => void

export type ResponseHandler = (
	res: Response,
	response: ResponseFunction
) => void

export type Route = {
	path: string
	method: string
	handler: ResponseHandler
}
