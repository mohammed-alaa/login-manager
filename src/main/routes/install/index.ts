import { reportError, encryptPrimaryPassword, formatZodError } from "@utils"
import type { ResponseHandler, InstallForm } from "@types"
import { installFormSchema } from "@schemas"
import { SettingsRepository } from "@repositories/settings"

const handle: ResponseHandler = async (res, response) => {
	const body: InstallForm = res.req.body

	try {
		installFormSchema.parse(body)
	} catch (error: any) {
		response(res, 422, {
			errors: formatZodError(error.format()),
		})
		return
	}

	try {
		await new SettingsRepository().updateSetting(
			"hashedPrimaryPassword",
			encryptPrimaryPassword(body.primaryPassword)
		)
		response(res, 204, {})
	} catch (error: any) {
		reportError(error)
		response(res, error?.message ? 400 : 500, {
			message: error?.message ?? error,
		})
	}
}

export default handle
