import { app } from "electron"
import { resolve } from "path"
import { encrypt, decrypt } from "aes256"
import { compareSync, hashSync, genSaltSync } from "bcrypt"
import { Logger } from "@repositories/logger"
import type { ZodError } from "zod"

export const encryptPrimaryPassword = (primaryPassword: string) => {
	return hashSync(primaryPassword, genSaltSync(10))
}

export const validatePrimaryPassword = (
	primaryPassword: string,
	hashedPrimaryPassword: string
) => {
	return compareSync(primaryPassword, hashedPrimaryPassword)
}

export const encryptPassword = (
	primaryPassword: string,
	plainPassword: string
) => {
	return encrypt(primaryPassword, plainPassword)
}

export const decryptPassword = (
	primaryPassword: string,
	encryptedPassword: string
) => {
	return decrypt(primaryPassword, encryptedPassword)
}

export const isWindows = () => {
	return process.platform === "win32"
}

export const isMac = () => {
	return process.platform === "darwin"
}

export const canShowCustomAppHeader = () => {
	return isWindows() || isMac()
}

export const isDevelopment = () => {
	return process.env.NODE_ENV === "development"
}

export const getAppDataPath = () => {
	return resolve(app.getPath("appData"), app.getName())
}

export const reportError = (message: string, context: object = {}) => {
	if (isDevelopment()) {
		console.error(message, context)
	} else {
		Logger.getInstance().getLogger()?.error(message, context)
	}
}

export const debug = <T>(
	message: string,
	context: null | boolean | object | string | number | Array<T> = null
) => {
	if (!isDevelopment()) {
		return
	}

	if (context) {
		console.log(message, context)
		Logger.getInstance().getLogger()?.info(message, context)
	} else {
		console.log(message)
		Logger.getInstance().getLogger()?.info(message)
	}
}

export const formatZodError = (errors: ZodError) => {
	const formatedErrors: { [key: string]: string } = {}
	Object.entries(errors).forEach(([key, value]) => {
		// "_errors" is coming fom zod, so ignoring it
		if (key !== "_errors") {
			formatedErrors[key] = value?._errors?.[0] ?? ""
		}
	})

	return formatedErrors
}
