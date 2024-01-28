import { reportError } from "@utils"
import type { ResponseHandler } from "@types"
import { LoginRepository } from "@repositories/logins"

const loginNotFound: ResponseHandler = (res, response) => {
	response(res, 404, { message: "Invalid login ID" })
}

const handle: ResponseHandler = async (res, response) => {
	const loginId: number = parseInt(res.req.query?.get("loginId") || "0")

	if (!loginId) {
		return loginNotFound(res, response)
	}

	try {
		const deleted = await new LoginRepository().deleteLogin(loginId)
		return deleted ? response(res, 204, {}) : loginNotFound(res, response)
	} catch (error: any) {
		reportError("Error while deleting login", {
			message: error.message,
		})

		response(res, 500, { message: error.message })
	}
}

export default handle
