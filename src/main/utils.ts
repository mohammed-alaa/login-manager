import { encrypt, decrypt } from "aes256"
import { compareSync, hashSync, genSaltSync } from "bcrypt"
import { getLogger } from "./logger"

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

export const reportError = (message: string, context: object = {}) => {
	if (isDevelopment()) {
		console.error(message, context)
	} else {
		getLogger()?.error(message, context)
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
		getLogger()?.info(message, context)
	} else {
		console.log(message)
		getLogger()?.info(message)
	}
}
