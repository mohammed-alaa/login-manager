import { reportError, validatePrimaryPassword, formatZodError } from "@utils"
import type { ResponseHandler, LoginForm } from "@types"
import { loginFormSchema } from "@schemas"
import { SettingsRepository } from "@repositories/settings"

const handle: ResponseHandler = async (res, response) => {
	const body: LoginForm["Data"] = res.req.body
	try {
		loginFormSchema.parse(body)
	} catch (error: any) {
		return response(res, 422, {
			errors: formatZodError(error.format()),
		})
	}

	const primaryPassword = body.primaryPassword

	try {
		const settingsRepository = new SettingsRepository()
		const hashedPrimaryPassword = (await settingsRepository.retrieveSetting(
			"hashedPrimaryPassword"
		)) as string
		if (validatePrimaryPassword(primaryPassword, hashedPrimaryPassword)) {
			process.env.PASSWORD = primaryPassword
			response(res, 204, {})
		} else {
			response(res, 401, {
				errors: {
					primaryPassword: "Primary password is invalid",
				},
			})
		}
	} catch (error: any) {
		reportError(error)
		response(res, error?.message ? 400 : 500, {
			errors: {
				general: error?.message ?? error,
			} as LoginForm["Errors"],
		})
	}
}

export default handle
