import type { CreateEditFormData } from "@types"
import { reportError } from "@utils"
import { createLogin } from "@repositories/logins"

const handle: ResponseHandler = (res, response) => {
	const body: CreateEditFormData = res.req.body
	createLogin(body)
		.then(() => {
			response(res, 201, {})
		})
		.catch((error: any) => {
			reportError("Error while creating new login", {
				message: error.message,
			})

			response(res, 500, { message: error.message })
		})
}

export default handle
