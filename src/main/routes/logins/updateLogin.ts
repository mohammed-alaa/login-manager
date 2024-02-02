import type { CreateEditFormData, ResponseHandler } from "@types"
import { reportError, encryptPassword } from "@utils"
import { LoginRepository } from "@repositories/logins"

const loginNotFound: ResponseHandler = (res, response) => {
	response(res, 404, { message: "Invalid login ID" })
}

const handle: ResponseHandler = async (res, response) => {
	const body: CreateEditFormData = res.req.body
	const loginId: number = parseInt(res.req.query?.get("loginId") || "0")

	if (!loginId) {
		return loginNotFound(res, response)
	}

	if (body.password.trim().length) {
		body.password = encryptPassword(process.env.PASSWORD, body.password)
	}

	try {
		const updated = await new LoginRepository().updateLogin(loginId, body)
		return updated ? response(res, 204, {}) : loginNotFound(res, response)
	} catch (error: any) {
		reportError("Error while update login", {
			message: error.message,
		})

		response(res, 500, { message: error.message })
	}
}

export default handle
