import { type ResponseHandler } from "@types"
import { reportError } from "@utils"
import { LoginRepository } from "@repositories/logins"
import type { Sort } from "@repositories/queryCompiler"

const handle: ResponseHandler = async (res, response) => {
	const page = parseInt(res.req.query?.get("page") || "0")
	const search = res.req.query?.get("search") || ""
	const sort = res.req.query?.get("sort") || "desc"

	try {
		const loginRepository = new LoginRepository()
		const count = await loginRepository.countLogins()
		const logins = await loginRepository.retrieveLogins({
			search,
			page,
			sort: sort as Sort["direction"],
		})
		response(res, 200, {
			logins,
			count,
			hasMore: loginRepository.hasMore(count, page),
		})
	} catch (error: any) {
		reportError("Error while retrieving logins", {
			message: error.message,
		})

		response(res, 500, { message: error.message })
	}
}

export default handle
