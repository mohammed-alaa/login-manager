import getRawBody from "raw-body"
import type { BodyParser } from "@types"

const parse: BodyParser = (req) => {
	return new Promise((resolve, reject) => {
		getRawBody(req, {
			encoding: true,
		})
			.then((body) => resolve(JSON.parse(body)))
			.catch((error) => {
				reject(error)
			})
	})
}

export default parse
