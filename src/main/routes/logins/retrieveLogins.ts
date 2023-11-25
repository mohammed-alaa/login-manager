import { type ResponseHandler } from "@types"
import { reportError } from "@utils"
import { hasMore, countLogins, retrieveLogins } from "@repositories/logins"

const handle: ResponseHandler = async (res, response) => {
	try {
		const page: number = res.req.query?.get("page") || 0
		const search: string = res.req.query?.get("search") || ""
		const sort: "asc" | "desc" = res.req.query?.get("sort") || "desc"
		const logins = await retrieveLogins(search, page, sort)
		const count = await countLogins()
		response(res, 200, {
			logins,
			count,
			hasMore: hasMore(count, page),
		})
	} catch (error: any) {
		reportError("Error while retrieving logins", {
			message: error.message,
		})

		response(res, 500, { message: error.message })
	}
}

export default handle
