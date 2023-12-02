import type { ResponseHandler, LoginItem } from "@types"
import { reportError, decryptPassword } from "@utils"
import { retrieveLogin } from "@repositories/logins"

const loginNotFound: ResponseHandler = (res, response) => {
	response(res, 404, { message: "Invalid login ID" })
}

const handle: ResponseHandler = (res, response) => {
	const loginId = res.req.query.get("loginId")

	if (!loginId) {
		return loginNotFound(res, response)
	}

	retrieveLogin(loginId)
		.then((login: LoginItem) => {
			if (login) {
				if (login.password.trim().length) {
					login.password = decryptPassword(
						process.env.PASSWORD,
						login.password
					)
				}
				response(res, 200, { login })
			} else {
				loginNotFound(res, response)
			}
		})
		.catch((error: any) => {
			reportError(`Error while retrieving login ${loginId}`, {
				message: error.message,
			})

			response(res, 500, { message: error.message })
		})
}

export default handle
