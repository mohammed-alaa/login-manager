import { reportError } from "@utils"
import { ResponseHandler } from "@types"
import { updateSetting } from "@repositories/settings"
import { updateSettingSchema } from "@schemas"

const handle: ResponseHandler = async (res, response) => {
	try {
		updateSettingSchema.parse(res.req.body)
	} catch (error: any) {
		reportError("Update setting: Error while validating request body", {
			message: JSON.parse(error.message),
		})

		response(res, 400, { message: JSON.parse(error.message) })
		return
	}

	try {
		const settingName: string = res.req.body.name
		const settingValue: any = res.req.body.value
		await updateSetting(settingName, settingValue)
		response(res, 204, {})
	} catch (error: any) {
		reportError("Error while updating setting", {
			message: error.message,
		})

		response(res, 500, { message: error.message })
	}
}

export default handle
