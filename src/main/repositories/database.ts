import { existsSync, writeFile } from "fs"
import { resolve } from "path"
import sqlite from "sqlite3"
import { debug, reportError } from "@utils"
import { Settings } from "@types"

let _dbInstance: sqlite.Database | null = null

export const transformSettingValue = (
	value: any,
	isFromDatabase: boolean = true
) => {
	return isFromDatabase ? JSON.parse(value) : JSON.stringify(value)
}

const checkEntry = (name: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		_dbInstance?.get(
			"SELECT `value` FROM `settings` WHERE `name` = ?",
			[name],
			(err: Error | null, row: string) => {
				if (err) {
					reject(err)
				} else {
					resolve(row ? true : false)
				}
			}
		)
	})
}

const checkDefaultSettings = () => {
	const defaultSettings: Settings = {
		startOnLogin: false,
		startMinimized: false,
		hashedPassPhrase: "",
	}

	Object.entries(defaultSettings).forEach(([name, value]) => {
		checkEntry(name)
			.then((exists) => {
				if (exists) {
					return
				}
				_dbInstance?.run(
					"INSERT INTO `settings` (`name`, `value`) VALUES (?, ?)",
					[name, transformSettingValue(value, false)],
					(result: sqlite.RunResult, error: Error | null) => {
						if (error) {
							reportError("Error inserting default setting", {
								message: error.message,
								context: {
									name,
									value,
									error,
								},
							})
						} else {
							debug(`Default setting "${name}" inserted`)
						}
					}
				)
			})
			.catch((error: Error) => {
				reportError("Error checking default setting", {
					message: error.message,
					context: {
						name,
						value,
						error,
					},
				})
			})
	})
}

const createDatabaseTables = () => {
	_dbInstance?.serialize(() => {
		_dbInstance
			?.run(
				"CREATE TABLE IF NOT EXISTS `logins` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `website` TEXT NOT NULL, `username` TEXT NOT NULL, `password` TEXT NOT NULL)",
				(result: sqlite.RunResult, error: Error | null) => {
					if (error) {
						reportError("Error creating `logins` table", {
							message: error.message,
							context: {
								result,
							},
						})
					} else {
						debug("Database table `logins` created")
					}
				}
			)
			?.run(
				"CREATE INDEX IF NOT EXISTS `website` ON `logins` (`website`)",
				(result: sqlite.RunResult, error: Error | null) => {
					if (error) {
						reportError(
							"Error creating `website` index on `logins` table",
							{
								message: error.message,
								context: {
									result,
								},
							}
						)
					} else {
						debug("Database index `website` created")
					}
				}
			)
			?.run(
				"CREATE INDEX IF NOT EXISTS `username` ON `logins` (`username`)",
				(result: sqlite.RunResult, error: Error | null) => {
					if (error) {
						reportError(
							"Error creating `username` index on `logins` table",
							{
								message: error.message,
								context: {
									result,
								},
							}
						)
					} else {
						debug("Database index `username` created")
					}
				}
			)
	})

	_dbInstance?.serialize(() => {
		_dbInstance?.run(
			"CREATE TABLE `settings` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT NOT NULL UNIQUE, `value` TEXT DEFAULT '');",
			(result: sqlite.RunResult, error: Error | null) => {
				if (error) {
					reportError("Error creating database table settings", {
						message: error.message,
						context: {
							result,
						},
					})
				} else {
					debug("Database table `settings` created")
					checkDefaultSettings()
				}
			}
		)
	})
}

const createDatabaseFile = (appPath: string) => {
	const dbPath = resolve(appPath, "database.db")

	if (!existsSync(dbPath)) {
		writeFile(dbPath, "", "utf-8", (error) => {
			if (error) {
				reportError("Error while creating database file", {
					message: error.message,
					context: {
						dbPath,
						appPath,
					},
				})
			}
		})
	}

	return dbPath
}

export function initDatabase(appPath: string) {
	const dbFile = createDatabaseFile(appPath)

	_dbInstance = new sqlite.Database(
		dbFile,
		sqlite.OPEN_READWRITE,
		(error) => {
			if (error) {
				reportError("Error connecting to database", {
					message: error.message,
					context: {
						appPath,
						dbFile,
					},
				})
			} else {
				createDatabaseTables()
			}
		}
	)
}

export function getDatabaseInstance() {
	return _dbInstance
}

export function getDatabaseInstanceOrFail() {
	if (!getDatabaseInstance()) {
		reportError("Database instance is not initialized")
	}

	return _dbInstance
}

export function deInitDatabase() {
	_dbInstance?.close((error) => {
		if (error) {
			reportError("Error closing database connection", {
				message: error.message,
				context: {
					_dbInstance,
				},
			})
		} else {
			debug("Database connection closed")
		}
	})
}
