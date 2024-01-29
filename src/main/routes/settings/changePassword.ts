import {
	reportError,
	validatePrimaryPassword,
	encryptPassword,
	decryptPassword,
	encryptPrimaryPassword,
	formatZodError,
} from "@utils"
import type {
	LoginItem,
	ResponseHandler,
	ChangePrimaryPasswordForm,
} from "@types"
import { changePrimaryPasswordSchema } from "@schemas"
import { LoginRepository } from "@repositories/logins"
import { SettingsRepository } from "@repositories/settings"

const handle: ResponseHandler = async (res, response) => {
	const body: ChangePrimaryPasswordForm = res.req.body

	try {
		changePrimaryPasswordSchema.parse(body)
	} catch (error: any) {
		return response(res, 422, {
			errors: formatZodError(error.format()),
		})
	}

	const currentPrimaryPassword = body.currentPrimaryPassword
	const newPrimaryPassword = body.newPrimaryPassword

	const loginRepository = new LoginRepository()
	const settingsRepository = new SettingsRepository()

	// Validate current primary password
	try {
		const hashedPrimaryPassword = (await settingsRepository.retrieveSetting(
			"hashedPrimaryPassword"
		)) as string
		if (
			!validatePrimaryPassword(
				body.currentPrimaryPassword,
				hashedPrimaryPassword
			)
		) {
			return response(res, 401, {
				errors: {
					currentPrimaryPassword:
						"Current primary password is invalid",
				},
			})
		}
	} catch (error: any) {
		reportError(
			"Error while validating current primary password",
			error.message
		)
		return response(res, 500, {
			errors: {
				general: error?.message ?? error,
			},
		})
	}

	// Retrieve logins
	const oldLogins = await loginRepository
		.columns(["website", "username", "password"])
		.retrieveLogins<LoginItem[]>()

	const newLogins = oldLogins.map((login) => {
		let loginPassword = login.password
		if (loginPassword.trim().length) {
			loginPassword = decryptPassword(
				currentPrimaryPassword,
				loginPassword
			)
			loginPassword = encryptPassword(newPrimaryPassword, loginPassword)
		}

		login.password = loginPassword
		return login
	})

	try {
		await loginRepository.deleteLogins()
	} catch (error: any) {
		reportError("Error while deleting old logins", error.message)
		return response(res, 400, {
			errors: {
				general: `Error occured while updating logins: ${error.message}`,
			},
		})
	}

	try {
		await loginRepository.createLogins(newLogins)
	} catch (error: any) {
		await loginRepository.createLogins(oldLogins)
		reportError("Error while creating new logins", error.message)
		return response(res, 400, {
			errors: {
				general: `Error occured while updating logins: ${error.message}`,
			},
		})
	}

	// Update the hashed primary password in settings table
	try {
		await settingsRepository.updateSetting(
			"hashedPrimaryPassword",
			encryptPrimaryPassword(newPrimaryPassword)
		)
		process.env.PASSWORD = newPrimaryPassword
	} catch (error: any) {
		reportError(
			"Error while updating hashed primary password",
			error.message
		)
		return response(res, 500, {
			errors: {
				general: `Error occured while updating primary password: ${error.message}`,
			},
		})
	}

	return response(res, 204, {})
}

export default handle
