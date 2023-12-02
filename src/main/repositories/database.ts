import { existsSync, writeFile } from "fs"
import { resolve } from "path"
import sqlite from "sqlite3"
import { debug, reportError, getAppDataPath } from "@utils"

let _dbInstance: sqlite.Database | null = null
const DATABASE_FILE_NAME = "database.db"
export type valueTypeValues = "string" | "number" | "boolean" | "json"

export const runQuery = (
	query: string,
	params: any[] = []
): Promise<sqlite.RunResult> => {
	return new Promise((resolve, reject) => {
		getDatabaseInstanceOrFail()?.run(query, params, function (error) {
			if (error) {
				reportError("Error running database query", {
					message: error.message,
					context: {
						query,
						params,
					},
				})
				reject(error)
			} else {
				resolve(this)
			}
		})
	})
}

const createDatabaseTablesAsync = async () => {
	try {
		await runQuery(
			"CREATE TABLE IF NOT EXISTS `logins` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `website` TEXT NOT NULL, `username` TEXT NOT NULL, `password` TEXT NOT NULL)"
		)
		debug("Database table `logins` created")
	} catch (error: any) {
		throw new Error("Error creating `logins` table", error)
	}

	try {
		await runQuery(
			"CREATE INDEX IF NOT EXISTS `website` ON `logins` (`website`)"
		)
		debug("Database index `website` created")
	} catch (error: any) {
		throw new Error(
			"Error creating `website` index on `logins` table",
			error
		)
	}

	try {
		await runQuery(
			"CREATE INDEX IF NOT EXISTS `username` ON `logins` (`username`)"
		)
		debug("Database index `username` created")
	} catch (error: any) {
		throw new Error(
			"Error creating `username` index on `logins` table",
			error
		)
	}

	try {
		await runQuery(
			"CREATE TABLE IF NOT EXISTS `settings` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT NOT NULL UNIQUE, `value` TEXT, `defaultValue` TEXT, `type` TEXT NOT NULL);"
		)
		debug("Database table `settings` created")
	} catch (error: any) {
		throw new Error("Error creating database table settings", error)
	}
}

const createDatabaseTablesSync = async (): Promise<void> => {
	return new Promise((resolve, reject) => {
		createDatabaseTablesAsync()
			.then(() => resolve())
			.catch((error) => reject(error))
	})
}

export const getMainDatabaseFileName = () => DATABASE_FILE_NAME

export const getDatabaseFilePath = (dbFileName: string = DATABASE_FILE_NAME) => {
	return resolve(getAppDataPath(), dbFileName)
}

const createDatabaseFile = (): Promise<string> => {
	const dbPath = getDatabaseFilePath(DATABASE_FILE_NAME)

	return new Promise((resolve, reject) => {
		if (existsSync(dbPath)) {
			return resolve(dbPath)
		}

		writeFile(dbPath, "", "utf-8", (error) => {
			if (error) {
				reportError("Error while creating database file", {
					message: error.message,
					context: {
						dbPath,
					},
				})
				reject(error)
			} else {
				resolve(dbPath)
			}
		})
	})
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

export const initDatabase = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		createDatabaseFile()
			.then((dbFile) => {
				debug("appPath", getAppDataPath())
				_dbInstance = new sqlite.Database(
					dbFile,
					sqlite.OPEN_READWRITE,
					async (error) => {
						if (error) {
							reportError("Error connecting to database", {
								message: error.message,
								context: {
									dbFile,
								},
							})
							reject(error)
						} else {
							try {
								debug("Database connection established")
								await createDatabaseTablesSync()
								debug("Database tables created")
								resolve()
							} catch (error: any) {
								reject(error)
							}
						}
					}
				)
			})
			.catch((error) => reject(error))
	})
}

export const deInitDatabase = () => {
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

export const getDatabaseInstance = () => _dbInstance

export const getDatabaseInstanceOrFail = () => {
	if (!_dbInstance) {
		reportError("Database instance is not initialized")
	}

	return _dbInstance
}

export const beginTransactionDB = () => {
	return new Promise((resolve, reject) => {
		runQuery("BEGIN TRANSACTION;")
			.then(() => resolve())
			.catch(() => reject())
	})
}

export const commitTransaction = () => {
	return new Promise((resolve, reject) => {
		runQuery("COMMIT;")
			.then(() => resolve())
			.catch(() => reject())
	})
}

export const rollbackTransaction = () => {
	return new Promise((resolve, reject) => {
		runQuery("ROLLBACK;")
			.then(() => resolve())
			.catch(() => reject())
	})
}
