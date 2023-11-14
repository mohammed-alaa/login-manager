import { reportError } from "@utils"
import { getDatabaseInstanceOrFail } from "@database"
import { type LoginItem, type LoginList } from "@types"

export function retrieveLogins() {
	const db = getDatabaseInstanceOrFail()

	return new Promise((resolve, reject) => {
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
