import { reportError, encryptPassword } from "@utils"
import { runQuery, getDatabaseInstanceOrFail } from "@database"
import type { LoginItem, LoginList, CreateEditFormData } from "@types"

const LoginListPaginationLimit = 7

export function countLogins(): Promise<number> {
	return new Promise((resolve, reject) => {
		const db = getDatabaseInstanceOrFail()

		db?.get(
			"SELECT COUNT(*) AS `logins_number` FROM `logins`",
			[],
			(error, row: number) => {
				if (error) {
					reportError("Error while retrieving number of logins", {
						message: error.message,
					})
					reject(error)
				} else {
					resolve(row.logins_number)
				}
			}
		)
	})
}

export const hasMore = (count: number, page: number): boolean => {
	return count > page * LoginListPaginationLimit
}

export function retrieveLogins(
	searchText: string = "",
	page: number = 0,
	sort: "asc" | "desc" = "desc"
) {
	return new Promise((resolve, reject) => {
		const db = getDatabaseInstanceOrFail()
		let query = "SELECT `id`, `website`, `username` FROM `logins`"
		const params = []

		if (searchText.trim().length) {
			searchText = searchText.replace(/_/g, "\\_").replace(/%/g, "\\%")
			searchText = `%${searchText}%`
			query += " WHERE `website` LIKE ? OR `username` LIKE ? ESCAPE '\\'"
			params.push(searchText, searchText)
		}

		query += ` ORDER BY \`id\` ${sort === "desc" ? "DESC" : "ASC"}`

		if (page >= 0 && !isNaN(Number(page))) {
			query += ` LIMIT ${LoginListPaginationLimit} OFFSET ${
				Number(page) * LoginListPaginationLimit
			}`
		}

		db?.all(query, params, (error, rows: LoginList[]) => {
			if (error) {
				reportError("Error while retrieving logins", {
					message: error.message,
					query,
					params,
					searchText,
				})
				reject(error)
			} else {
				resolve(rows)
			}
		})
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
					reportError(`Error while retrieving login ${loginId}`, {
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
		runQuery(
			"UPDATE `logins` SET `website` = ?, `username` = ?, `password` = ? WHERE `id` = ?",
			[data.website, data.username, data.password, loginId]
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

export function retrieveAllAndUpdateEachWithCB(callback: any) {
	return new Promise((resolve, reject) => {
		const db = getDatabaseInstanceOrFail()

		db?.each("SELECT * FROM `logins`", [], async (error, row: LoginItem) => {
			if (error) {
				reportError("Error while retrieving logins and updating with callback", {
					message: error.message,
				})
				reject(error)
			} else {
				try {
					await callback(row)
				} catch (error: any) {
					reject(error)
				}
			}
		}, (error) => {
			if (error) {
				reportError("Error after finished retrieving logins and updating with callback", {
					message: error.message,
				})
				reject(error)
			} else {
				resolve()
			}
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
