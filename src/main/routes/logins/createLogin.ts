import type { CreateEditFormData } from "@types"
import { reportError } from "@utils"
import {
	beginTransactionDB,
	commitTransaction,
	rollbackTransaction,
} from "@database"
import { createLogin } from "@repositories/logins"

const handle: ResponseHandler = async (res, response) => {
	const body: CreateEditFormData = res.req.body

	try {
		await beginTransactionDB()
		await createLogin(body)
		await commitTransaction()
		response(res, 201, {})
	} catch (error: any) {
		await rollbackTransaction()
		reportError("Error while creating new login", {
			message: error.message,
		})
		response(res, 500, { message: error.message })
	}
}

export default handle
