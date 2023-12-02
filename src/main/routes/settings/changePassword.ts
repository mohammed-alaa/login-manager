import {
	reportError,
	validatePrimaryPassword,
	encryptPassword,
	decryptPassword,
	encryptPrimaryPassword,
	formatZodError,
} from "@utils"
import type { LoginItem, ResponseHandler, ChangePrimaryPasswordForm } from "@types"
import { changePrimaryPasswordSchema } from "@schemas"
import { retrieveSetting, updateSetting } from "@repositories/settings"
import { updateLogin, retrieveAllAndUpdateEachWithCB } from "@repositories/logins"
import {
	beginTransactionDB,
	commitTransaction,
	rollbackTransaction,
} from "@repositories/database"

const handle: ResponseHandler = async (res, response) => {
	const body: ChangePrimaryPasswordForm = res.req.body

	try {
		changePrimaryPasswordSchema.parse(body)
	} catch (error: any) {
		return response(res, 422, {
			errors: formatZodError(error.format())
		})
	}

	const currentPrimaryPassword = body.currentPrimaryPassword
	const newPrimaryPassword = body.newPrimaryPassword

	// Validate current primary password
	try {
		const hashedPrimaryPassword = await retrieveSetting(
			"hashedPrimaryPassword"
		)
		if (!validatePrimaryPassword(body.currentPrimaryPassword, hashedPrimaryPassword.value)) {
			return response(res, 401, {
				errors: {
					currentPrimaryPassword: "Current primary password is invalid",
				},
			})
		}
	} catch (error: any) {
		reportError("Error while validating current primary password", {
			message: error.message,
		})
		return response(res, 500, {
			errors: {
				general: error?.message ?? error,
			},
		})
	}

	// Retrieve and update logins
	try {
		await beginTransactionDB()
		await retrieveAllAndUpdateEachWithCB((login: LoginItem) => {
			let loginPassword = login.password
			if (loginPassword.trim().length) {
				loginPassword = decryptPassword(currentPrimaryPassword, loginPassword)
				loginPassword = encryptPassword(newPrimaryPassword, loginPassword)
			}

			login.password = loginPassword
			return updateLogin(login.id, login)
		})
		await commitTransaction()
	} catch (error: any) {
		await rollbackTransaction()
		reportError("Error while retrieving and updating logins", {
			message: error.message,
		})
		return response(res, 400, {
			errors: {
				general: `Error occured while updating logins: ${error.message}`,
			},
		})
	}

	// Update the hashed primary password in settings table
	try {
		await beginTransactionDB()
		await updateSetting("hashedPrimaryPassword", encryptPrimaryPassword(newPrimaryPassword))
		await commitTransaction()
		process.env.PASSWORD = newPrimaryPassword
	} catch (error: any) {
		await rollbackTransaction()
		reportError("Error while updating hashed primary password", {
			message: error.message,
		})
		return response(res, 500, {
			errors: {
				general: `Error occured while updating primary password: ${error.message}`,
			},
		})
	}

	return response(res, 204, {})
}

export default handle