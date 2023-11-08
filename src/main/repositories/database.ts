import { existsSync, writeFile } from "fs"
import { resolve } from "path"
import sqlite from "sqlite3"
import { debug, reportError } from "@utils"

let _dbInstance: sqlite.Database | null = null
type valueTypeValues = "string" | "number" | "boolean" | "json"

export type DatabaseSetting = {
	id?: number
	name: string
	value?: string
	defaultValue: string
	type: valueTypeValues
}

export const exportToDatabaseValue = (value: any, type: valueTypeValues) => {
	switch (type) {
		case "string":
		case "number":
		case "boolean":
			return String(value)
		case "json":
			return JSON.stringify(value)
	}
}

export const exportFromDatabaseValue = (
	value: string,
	type: valueTypeValues
) => {
	switch (type) {
		case "string":
			return String(value)
		case "number":
			return Number(value)
		case "boolean": {
			const lowerCaseValue = value.toLowerCase()
			return lowerCaseValue === "true" || lowerCaseValue === "1"
		}
		case "json":
			try {
				return JSON.parse(value)
			} catch (error: any) {
				reportError("Error parsing JSON", {
					message: error.message,
					context: {
						value,
						type,
					},
				})
				return null
			}
	}
}

const createDatabaseTables = () => {
	_dbInstance?.serialize(() => {
		_dbInstance
			?.run(
				"CREATE TABLE IF NOT EXISTS `logins` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `website` TEXT NOT NULL, `username` TEXT NOT NULL, `password` TEXT NOT NULL)",
				(error: Error | null) => {
					if (error) {
						reportError("Error creating `logins` table", {
							message: error.message,
						})
					} else {
						debug("Database table `logins` created")
					}
				}
			)
			?.run(
				"CREATE INDEX IF NOT EXISTS `website` ON `logins` (`website`)",
				(error: Error | null) => {
					if (error) {
						reportError(
							"Error creating `website` index on `logins` table",
							{
								message: error.message,
							}
						)
					} else {
						debug("Database index `website` created")
					}
				}
			)
			?.run(
				"CREATE INDEX IF NOT EXISTS `username` ON `logins` (`username`)",
				(error: Error | null) => {
					if (error) {
						reportError(
							"Error creating `username` index on `logins` table",
							{
								message: error.message,
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
			"CREATE TABLE `settings` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT NOT NULL UNIQUE, `value` TEXT, `defaultValue` TEXT, `type` TEXT NOT NULL);",
			(error: Error | null) => {
				if (error) {
					reportError("Error creating database table settings", {
						message: error.message,
					})
				} else {
					debug("Database table `settings` created")
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

export function getDatabaseInstance() {
	return _dbInstance
}

export function getDatabaseInstanceOrFail() {
	if (!getDatabaseInstance()) {
		reportError("Database instance is not initialized")
	}

	return _dbInstance
}
