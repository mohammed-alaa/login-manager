import type { CreateEditFormData } from "@types"
import { reportError, encryptPassword } from "@utils"
import {
	beginTransactionDB,
	commitTransaction,
	rollbackTransaction,
} from "@database"
import { updateLogin } from "@repositories/logins"

const loginNotFound: ResponseHandler = (res, response) => {
	response(res, 404, { message: "Invalid login ID" })
}

const handle: ResponseHandler = async (res, response) => {
	const body: CreateEditFormData = res.req.body
	const loginId = res.req.query.get("loginId")

	if (!loginId) {
		return loginNotFound(res, response)
	}

	if (body.password.trim().length) {
		body.password = encryptPassword(process.env.PASSWORD, body.password)
	}

	try {
		await beginTransactionDB()
		const updated = await updateLogin(loginId, body)
		await commitTransaction()
		return updated ? response(res, 204, {}) : loginNotFound(res, response)
	} catch (error: any) {
		await rollbackTransaction()
		reportError("Error while update login", {
			message: error.message,
		})

		response(res, 500, { message: error.message })
	}
}

export default handle
