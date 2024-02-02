import type { IncomingMessage, ServerResponse } from "http"
import type { URLSearchParams } from "url"

export type FileType = {
	size: number
	buffer: Buffer
	mimetype: string
	encoding: string
	fieldname: string
	originalname: string
}

export type Request = IncomingMessage & {
	body?: any
	query?: URLSearchParams
	files?: FileType[]
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

export type BodyParser = (
	req: Request,
	res: Response
) => Promise<Record<string, any>>
