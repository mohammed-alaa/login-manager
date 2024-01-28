import { reportError } from "@utils"
import { ResponseHandler } from "@types"
import { SettingsRepository } from "@repositories/settings"

const handle: ResponseHandler = async (res, response) => {
	try {
		const settings = await new SettingsRepository().retrieveSettings()
		response(res, 200, { settings })
	} catch (error: any) {
		reportError("Error while retrieving settings", {
			message: error.message,
		})

		response(res, 500, { message: error.message })
	}
}

export default handle
