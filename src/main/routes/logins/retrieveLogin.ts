import type { ResponseHandler } from "@types"
import { reportError, decryptPassword } from "@utils"
import { LoginRepository } from "@repositories/logins"

const loginNotFound: ResponseHandler = (res, response) => {
	response(res, 404, { message: "Invalid login ID" })
}

const handle: ResponseHandler = async (res, response) => {
	const loginId = parseInt(res.req.query?.get("loginId") || "0")

	if (!loginId) {
		return loginNotFound(res, response)
	}

	try {
		const loginRepository = new LoginRepository()
		const login = await loginRepository.retrieveLogin(loginId)
		if (login.password.trim().length) {
			login.password = decryptPassword(
				process.env.PASSWORD,
				login.password
			)
		}
		response(res, 200, { login })
	} catch (error: any) {
		reportError(`Error while retrieving login ${loginId}`, {
			message: error.message,
		})

		response(res, 500, { message: error.message })
	}
}

export default handle
