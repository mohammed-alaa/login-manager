import { reportError, formatZodError } from "@utils"
import type { Settings, ResponseHandler } from "@types"
import retrieveSettings from "@routes/settings/retrieveSettings"
import {
	beginTransactionDB,
	commitTransaction,
	rollbackTransaction,
} from "@database"
import { updateSetting } from "@repositories/settings"
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

	const startOnLogin = body.startOnLogin

	try {
		await beginTransactionDB()
		await updateSetting("startOnLogin", startOnLogin)
		await commitTransaction()
	} catch (error: any) {
		await rollbackTransaction()
		reportError("Error while updating start on login setting", {
			message: error.message,
		})

		return response(res, 500, { message: error.message })
	}

	try {
		let startMinimized = body.startMinimized
		if (!startOnLogin) {
			startMinimized = false
		}

		await beginTransactionDB()
		await updateSetting("startMinimized", startMinimized)
		await commitTransaction()
	} catch (error: any) {
		await rollbackTransaction()
		reportError("Error while updating start minimized setting", {
			message: error.message,
		})

		return response(res, 500, { message: error.message })
	}

	return retrieveSettings(res, response)
}

export default handle
