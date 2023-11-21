import { reportError, validatePrimaryPassword } from "@utils"
import type { ResponseHandler, LoginForm } from "@types"
import { loginFormSchema } from "@schemas"
import { retrieveSetting } from "@repositories/settings"

const handle: ResponseHandler = async (res, response) => {
	const body: LoginForm = res.req.body
	const primaryPassword = body.primaryPassword
	try {
		loginFormSchema.parse({ primaryPassword })
	} catch (error: any) {
		const errors = error.format()
		return response(res, 422, {
			errors: {
				primaryPassword: errors.primaryPassword?._errors?.[0] ?? "",
			},
		})
	}

	try {
		const hashedPrimaryPassword = await retrieveSetting(
			"hashedPrimaryPassword"
		)
		if (
			validatePrimaryPassword(
				primaryPassword,
				hashedPrimaryPassword?.value ?? ""
			)
		) {
			process.env.PASSWORD = primaryPassword
			response(res, 204, {})
		} else {
			response(res, 401, {
				message: "Primary password is invalid",
			})
		}
	} catch (error: any) {
		reportError(error)
		response(res, error?.message ? 400 : 500, {
			message: error?.message ?? error,
		})
	}
}

export default handle
