import { existsSync, writeFile } from "fs"
import { resolve } from "path"
import sqlite from "sqlite3"
import { debug, reportError, getAppDataPath } from "@utils"

export type valueTypeValues = "string" | "number" | "boolean" | "json"

export class AbstractDatabase {
	private _DATABASE_FILE_NAME = "database.db"
	protected _dbInstance: sqlite.Database | null = null

	private createDatabaseFile(dbPath: string): Promise<string> {
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

	private connectToDatabase(dbFile: string) {
		return new sqlite.Database(
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
					throw new Error(error.message)
				}
			}
		)
	}

	private getDatabaseFilePath() {
		return resolve(getAppDataPath(), this._DATABASE_FILE_NAME)
	}

	private createDatabaseTablesSync(): Promise<void> {
		return new Promise((resolve, reject) => {
			Promise.all([
				this.createLoginsTable(),
				this.createWebsiteIndex(),
				this.createUsernameIndex(),
				this.createSettingsTable(),
			])
				.then(() => {
					debug("Database tables created")
					resolve()
				})
				.catch((error) => reject(error))
		})
	}

	private createLoginsTable(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.runQuery(
				"CREATE TABLE IF NOT EXISTS `logins` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `website` TEXT NOT NULL, `username` TEXT NOT NULL, `password` TEXT NOT NULL)",
				[]
			)
				.then(() => {
					debug("Database table `logins` created")
					resolve()
				})
				.catch((error) => {
					reject(`Error creating logins table: ${error.message}`)
				})
		})
	}

	private createWebsiteIndex(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.runQuery(
				"CREATE INDEX IF NOT EXISTS `website` ON `logins` (`website`)",
				[]
			)
				.then(() => {
					debug("Database index `website` created")
					resolve()
				})
				.catch((error) => {
					reject(
						`Error creating website index on logins table: ${error.message}`
					)
				})
		})
	}

	private createUsernameIndex(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.runQuery(
				"CREATE INDEX IF NOT EXISTS `username` ON `logins` (`username`)",
				[]
			)
				.then(() => {
					debug("Database index `username` created")
					resolve()
				})
				.catch((error) => {
					reject(
						`Error creating username index on logins table: ${error.message}`
					)
				})
		})
	}

	private createSettingsTable(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.runQuery(
				"CREATE TABLE IF NOT EXISTS `settings` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT NOT NULL UNIQUE, `value` TEXT, `defaultValue` TEXT, `type` TEXT NOT NULL);",
				[]
			)
				.then(() => {
					debug("Database table `settings` created")
					resolve()
				})
				.catch((error) => {
					reject(`Error creating settings table: ${error.message}`)
				})
		})
	}

	public async init() {
		try {
			debug("appPath", getAppDataPath())
			const dbPath = this.getDatabaseFilePath()
			const dbFile = await this.createDatabaseFile(dbPath)
			this._dbInstance = this.connectToDatabase(dbFile)
			debug("Database connection established")
			await this.createDatabaseTablesSync()
		} catch (error: any) {
			throw new Error(error.message)
		}
	}

	public async close(): Promise<void> {
		return new Promise((resolve, reject) => {
			this._dbInstance?.close((error) => {
				if (error) {
					reportError("Error closing database connection", {
						message: error.message,
						context: {
							dbInstance: this._dbInstance,
						},
					})
					reject(error)
				} else {
					debug("Database connection closed")
					this._dbInstance = null
					resolve()
				}
			})
		})
	}

	public runQuery<Params>(query: string, params: Params): Promise<number> {
		return new Promise((resolve, reject) => {
			this._dbInstance?.run(query, params, function (error) {
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
					resolve(this.changes)
				}
			})
		})
	}
}
