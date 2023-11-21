import { reportError } from "@utils"
import type { Settings, ResponseHandler } from "@types"
import retrieveSettings from "@routes/settings/retrieveSettings"
import { updateSetting } from "@repositories/settings"
import { updateSettingSchema } from "@schemas"

const handle: ResponseHandler = async (res, response) => {
	const body: Settings = res.req.body

	try {
		updateSettingSchema.parse(body)
	} catch (error: any) {
		const errors = error.format()
		reportError("Update setting: Error while validating request body", {
			errors,
		})
		return response(res, 422, {
			errors: errorObject,
		})
	}

	for (const [key, value] of Object.entries(body)) {
		try {
			await updateSetting(key, value)
		} catch (error: any) {
			reportError(`Error while updating setting ${key}`, {
				message: error.message,
			})

			return response(res, 500, { message: error.message })
		}
	}

	return retrieveSettings(res, response)
}

export default handle
