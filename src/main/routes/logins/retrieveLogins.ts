import { type ResponseHandler } from "@types"
import { reportError } from "@utils"
import { retrieveLogins } from "@repositories/logins"

const handle: ResponseHandler = (res, response) => {
	retrieveLogins()
		.then((logins: any) => {
			response(res, 200, { logins })
		})
		.catch((error: any) => {
			reportError("Error while retrieving logins", {
				message: error.message,
			})

			response(res, 500, { message: error.message })
		})
}

export default handle
