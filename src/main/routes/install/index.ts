import { reportError, encryptPassPhrase } from "@utils"
import type { ResponseHandler, InstallForm } from "@types"
import { installFormSchema } from "@schemas"
import { updateSetting } from "@repositories/settings"

const handle: ResponseHandler = async (res, response) => {
	const body: InstallForm = res.req.body
	const passPhrase = body.passPhrase
	try {
		installFormSchema.parse({
			passPhrase,
			confirmedPassPhrase: body.confirmedPassPhrase,
		})
	} catch (error: any) {
		const errors = error.format()
		response(res, 422, {
			errors: {
				passPhrase: errors.passPhrase?._errors?.[0] ?? "",
				confirmedPassPhrase:
					errors.confirmedPassPhrase?._errors?.[0] ?? "",
			},
		})
	}

	try {
		process.env.PASS_PHRASE = passPhrase
		await updateSetting("hashedPassPhrase", encryptPassPhrase(passPhrase))
		response(res, 204, {})
	} catch (error: any) {
		reportError(error)
		response(res, error?.message ? 400 : 500, {
			message: error?.message ?? error,
		})
	}
}

export default handle
