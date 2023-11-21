import { reportError, encryptPrimaryPassword } from "@utils"
import type { ResponseHandler, InstallForm } from "@types"
import { installFormSchema } from "@schemas"
import { updateSetting } from "@repositories/settings"

const handle: ResponseHandler = async (res, response) => {
	const body: InstallForm = res.req.body

	try {
		installFormSchema.parse(body)
	} catch (error: any) {
		const errors = error.format()
		response(res, 422, {
			errors: {
				primaryPassword: errors.primaryPassword?._errors?.[0] ?? "",
				confirmedPrimaryPassword:
					errors.confirmedPrimaryPassword?._errors?.[0] ?? "",
			},
		})
		return
	}

	try {
		await updateSetting(
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
