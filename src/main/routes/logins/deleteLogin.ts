import { reportError } from "@utils"
import {
	beginTransactionDB,
	commitTransaction,
	rollbackTransaction,
} from "@database"
import { deleteLogin } from "@repositories/logins"

const loginNotFound: ResponseHandler = (res, response) => {
	response(res, 404, { message: "Invalid login ID" })
}

const handle: ResponseHandler = async (res, response) => {
	const loginId = res.req.query.get("loginId")

	if (!loginId) {
		return loginNotFound(res, response)
	}

	try {
		await beginTransactionDB()
		const deleted = await deleteLogin(loginId)
		await commitTransaction()
		return deleted ? response(res, 204, {}) : loginNotFound(res, response)
	} catch (error: any) {
		await rollbackTransaction()
		reportError("Error while deleting login", {
			message: error.message,
		})

		response(res, 500, { message: error.message })
	}
}

export default handle
