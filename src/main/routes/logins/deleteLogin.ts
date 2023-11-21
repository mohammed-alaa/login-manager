import { reportError } from "@utils"
import { deleteLogin } from "@repositories/logins"

const loginNotFound: ResponseHandler = (res, response) => {
	response(res, 404, { message: "Invalid login ID" })
}

const handle: ResponseHandler = async (res, response) => {
	const loginId = res.req.query.get("loginId")

	if (!loginId) {
		return loginNotFound(res, response)
	}

	deleteLogin(loginId)
		.then((deleted) => {
			deleted ? response(res, 204, {}) : loginNotFound(res, response)
		})
		.catch((error: any) => {
			reportError("Error while deleting login", {
				message: error.message,
			})

			response(res, 500, { message: error.message })
		})
}

export default handle
