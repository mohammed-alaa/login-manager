import type { ResponseHandler, Sort, LoginList } from "@types"
import { reportError } from "@utils"
import { LoginRepository } from "@repositories/logins"

const handle: ResponseHandler = async (res, response) => {
	const page = parseInt(res.req.query?.get("page") || "0")
	const limit = parseInt(res.req.query?.get("limit") || "0")
	const search = res.req.query?.get("search") || ""
	const sort: Sort["direction"] = (res.req.query?.get("sort") ||
		"desc") as Sort["direction"]

	try {
		const loginRepository = new LoginRepository()
		const count = await loginRepository.countLogins()
		let loginsQuery = loginRepository
			.columns(["id", "username", "website"])
			.sort("id", sort)
			.page(page, limit)

		if (search.trim().length) {
			loginsQuery = loginsQuery
				.whereLike("website", search)
				.orWhereLike("username", search)
		}

		const logins = await loginsQuery.retrieveLogins<LoginList>()
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
