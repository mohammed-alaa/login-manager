import { type ResponseHandler } from "@types"
import { reportError } from "@utils"
import { countLogins, retrieveLogins } from "@repositories/logins"

const handle: ResponseHandler = async (res, response) => {
	try {
		const search: string = res.req.query?.get("search") || ""
		const logins = await retrieveLogins(search)
		const loginsNumber = await countLogins()
		response(res, 200, { logins, loginsNumber })
	} catch(error: any) {
		reportError("Error while retrieving logins", {
			message: error.message,
		})

		response(res, 500, { message: error.message })
	}
}

export default handle
