import { reportError } from "@utils"
import {
	type valueTypeValues,
	runQuery,
	exportToDatabaseValue,
	exportFromDatabaseValue,
	getDatabaseInstanceOrFail,
} from "@database"

type TransformedSetting = { [key: string]: any }
type DatabaseSetting = {
	id?: number
	name: string
	value?: string
	defaultValue: string
	type: valueTypeValues
}

const defaultSettings: DatabaseSetting[] = [
	{
		name: "startOnLogin",
		defaultValue: "true",
		type: "boolean",
	},
	{
		name: "startMinimized",
		defaultValue: "false",
		type: "boolean",
	},
	{
		name: "hashedPrimaryPassword",
		defaultValue: "",
		type: "string",
	},
]

export const transformSettingArrayToObject = (
	setting: DatabaseSetting
): TransformedSetting => {
	return {
		[setting.name]: exportFromDatabaseValue(
			setting.value ?? setting.defaultValue,
			setting.type
		),
	}
}

export const transformSettingsArrayToObject = (settings: DatabaseSetting[]) => {
	let settingsObject: TransformedSetting = {}

	settings.forEach((setting: DatabaseSetting) => {
		settingsObject = {
			...settingsObject,
			...transformSettingArrayToObject(setting),
		}
	})

	return settingsObject
}

export function retrieveSetting(name: string): Promise<DatabaseSetting> {
	return new Promise((resolve, reject) => {
		const db = getDatabaseInstanceOrFail()
		db?.get(
			"SELECT * FROM `settings` WHERE `name` = ?",
			[name],
			(error: Error | null, row: DatabaseSetting | undefined) => {
				if (error) {
					reportError("Error getting retrieving setting", {
						message: error.message,
						context: {
							name,
						},
					})
					reject(error)
				} else {
					const settingDefaultInformation = {
						...defaultSettings.find(
							(setting) => setting.name === name
						),
						...{ ...(row ?? {}) },
					} as DatabaseSetting

					resolve(settingDefaultInformation)
				}
			}
		)
	})
}

export function retrieveSettings(): Promise<DatabaseSetting[]> {
	const db = getDatabaseInstanceOrFail()

	return new Promise((resolve, reject) => {
		db?.all(
			`SELECT * FROM settings`,
			[],
			(error, rows: DatabaseSetting[]) => {
				if (error) {
					reportError("Error getting retrieving settings", {
						message: error.message,
					})
					reject(error)
				} else {
					resolve([...defaultSettings, ...rows])
				}
			}
		)
	})
}

export async function updateSetting(name: string, newValue: any) {
	const setting = await retrieveSetting(name)

	return new Promise((resolve, reject) => {
		runQuery(
			"INSERT OR REPLACE INTO `settings` (`name`, `value`, `defaultValue`, `type`) VALUES (?, ?, ?, ?)",
			[
				name,
				exportToDatabaseValue(
					newValue ?? setting.defaultValue,
					setting.type
				),
				setting.defaultValue,
				setting.type,
			]
		)
			.then(() => resolve(null))
			.catch((error: Error) => {
				reportError("Error updating application setting", {
					message: error.message,
					context: {
						name,
						newValue,
					},
				})
				reject(error)
			})
	})
}
