import { reportError } from "@utils"
import { ResponseHandler } from "@types"
import {
	retrieveSettings,
	transformSettingsArrayToObject,
} from "@repositories/settings"

const handle: ResponseHandler = (res, response) => {
	retrieveSettings()
		.then((settings) => {
			response(res, 200, {
				settings: transformSettingsArrayToObject(settings),
			})
		})
		.catch((error: any) => {
			reportError("Error while retrieving settings", {
				message: error.message,
			})

			response(res, 500, { message: error.message })
		})
}

export default handle
