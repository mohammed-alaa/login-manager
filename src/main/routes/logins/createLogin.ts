import type { CreateEditFormData, ResponseHandler } from "@types"
import { reportError, encryptPassword } from "@utils"
import { LoginRepository } from "@repositories/logins"

const handle: ResponseHandler = async (res, response) => {
	const body: CreateEditFormData = res.req.body

	if (body.password.trim().length) {
		body.password = encryptPassword(process.env.PASSWORD, body.password)
	}

	try {
		await new LoginRepository().createLogin(body)
		response(res, 201, {})
	} catch (error: any) {
		reportError("Error while creating new login", {
			message: error.message,
		})
		response(res, 500, { message: error.message })
	}
}

export default handle
