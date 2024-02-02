import jsonParser from "./json"
import multipartParser from "./multipart"
import type { BodyParser } from "@types"

const parse: BodyParser = (req, res) => {
	if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
		return multipartParser(req, res)
	} else if (req.headers["content-type"] === "application/json") {
		return jsonParser(req, res)
	} else {
		return Promise.reject("Invalid content type.")
	}
}

export default parse
