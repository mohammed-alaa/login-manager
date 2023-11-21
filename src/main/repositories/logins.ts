import { reportError, encryptPassword } from "@utils"
import { runQuery, getDatabaseInstanceOrFail } from "@database"
import type { LoginItem, LoginList, CreateEditFormData } from "@types"

export function retrieveLogins() {
	return new Promise((resolve, reject) => {
		const db = getDatabaseInstanceOrFail()

		db?.all(
			"SELECT `id`, `website`, `username` FROM `logins`",
			[],
			(error, rows: LoginList[]) => {
				if (error) {
					reportError("Error getting retrieving settings", {
						message: error.message,
					})
					reject(error)
				} else {
					resolve(rows)
				}
			}
		)
	})
}

export function retrieveLogin(loginId: number) {
	return new Promise((resolve, reject) => {
		const db = getDatabaseInstanceOrFail()

		db?.get(
			"SELECT * FROM `logins` WHERE `id` = ?",
			[loginId],
			(error, row: LoginItem) => {
				if (error) {
					reportError(`Error getting retrieving login ${loginId}`, {
						message: error.message,
					})
					reject(error)
				} else {
					resolve(row)
				}
			}
		)
	})
}

export function createLogin(data: CreateEditFormData) {
	return new Promise((resolve, reject) => {
		let password = data.password

		if (password.trim().length) {
			password = encryptPassword(process.env.PASSWORD, password)
		}

		runQuery(
			"INSERT INTO `logins` (`website`, `username`, `password`) VALUES (?, ?, ?)",
			[data.website, data.username, password]
		)
			.then(() => resolve(null))
			.catch((error: Error) => {
				reportError("Error creating new login", {
					message: error.message,
					context: {
						data,
					},
				})
				reject(error)
			})
	})
}

export function updateLogin(loginId: number, data: CreateEditFormData) {
	return new Promise((resolve, reject) => {
		let password = data.password

		if (password.trim().length) {
			password = encryptPassword(process.env.PASSWORD, password)
		}

		runQuery(
			"UPDATE `logins` SET `website` = ?, `username` = ?, `password` = ? WHERE `id` = ?",
			[data.website, data.username, password, loginId]
		)
			.then((result) => resolve(!!result.changes))
			.catch((error: Error) => {
				reportError("Error updating login details", {
					message: error.message,
					context: {
						loginId,
						data,
					},
				})
				reject(error)
			})
	})
}

export function deleteLogin(loginId: number) {
	return new Promise((resolve, reject) => {
		runQuery("DELETE FROM `logins` WHERE `id` = ?", [loginId])
			.then((result) => resolve(!!result.changes))
			.catch((error: Error) => {
				reportError("Error deleting login", {
					message: error.message,
					context: {
						loginId,
					},
				})
				reject(error)
			})
	})
}
