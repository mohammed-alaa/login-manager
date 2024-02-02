import { reportError, formatZodError } from "@utils"
import type { Settings, ResponseHandler } from "@types"
import retrieveSettings from "@routes/settings/retrieveSettings"
import { SettingsRepository } from "@repositories/settings"
import { updateSettingSchema } from "@schemas"

const handle: ResponseHandler = async (res, response) => {
	const body: Settings = res.req.body

	try {
		updateSettingSchema.parse(body)
	} catch (error: any) {
		return response(res, 422, {
			errors: formatZodError(error.format()),
		})
	}

	const settingsRepository = new SettingsRepository()

	try {
		await settingsRepository.updateSetting(
			"startOnLogin",
			body.startOnLogin
		)
	} catch (error: any) {
		reportError("Error while updating start on login setting", {
			message: error.message,
		})

		return response(res, 500, { message: error.message })
	}

	try {
		const startMinimized = body.startOnLogin && body.startMinimized
		await settingsRepository.updateSetting("startMinimized", startMinimized)
	} catch (error: any) {
		reportError("Error while updating start minimized setting", {
			message: error.message,
		})

		return response(res, 500, { message: error.message })
	}

	retrieveSettings(res, response)
}

export default handle
