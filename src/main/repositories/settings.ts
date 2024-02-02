import { reportError } from "@utils"
import type { ValueTypes } from "@types"
import { BaseRepository } from "./base"

type TransformedSetting = { [key: string]: ValueTypes }
type DatabaseSetting = {
	id?: number
	name: string
	value?: string
	defaultValue: string
	type: "string" | "number" | "boolean" | "json"
}
type DefaultSetting = {
	name: DatabaseSetting["name"]
	defaultValue: DatabaseSetting["defaultValue"]
	type: DatabaseSetting["type"]
}

export class SettingsRepository extends BaseRepository {
	private _DEFAULT_SETTINGS: DefaultSetting[] = [
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

	constructor() {
		super("settings")
	}

	private _exportFromDatabaseValue(
		value: string,
		type: DatabaseSetting["type"]
	) {
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

	private _exportToDatabaseValue(
		value: ValueTypes,
		type: DatabaseSetting["type"]
	) {
		switch (type) {
			case "string":
			case "number":
			case "boolean":
				return String(value)
			case "json":
				return JSON.stringify(value)
		}
	}

	private _transformSettingArrayToObject(setting: DatabaseSetting) {
		return {
			[setting.name]: this._exportFromDatabaseValue(
				setting.value ?? setting.defaultValue,
				setting.type
			),
		} as TransformedSetting
	}

	private _transformSettingsArrayToObject(settings: DatabaseSetting[]) {
		let settingsObject: TransformedSetting = {}

		settings.forEach((setting: DatabaseSetting) => {
			settingsObject = {
				...settingsObject,
				...this._transformSettingArrayToObject(setting),
			} as TransformedSetting
		})

		return settingsObject
	}

	private async _retrieveSetting(name: DatabaseSetting["name"]) {
		return this.where("name", name)
			.get<DatabaseSetting | undefined>()
			.then((setting) => {
				setting = {
					...this._DEFAULT_SETTINGS.find(
						(setting) => setting.name === name
					),
					...{ ...(setting ?? {}) },
				} as DatabaseSetting
				return setting
			})
			.catch((error) => {
				reportError("Error while retrieving setting", {
					message: error.message,
				})
				throw error
			})
	}

	public async retrieveSetting(name: DatabaseSetting["name"]) {
		return this._retrieveSetting(name)
			.then((setting) => {
				return this._transformSettingArrayToObject(setting)[name]
			})
			.catch((error) => {
				reportError("Error while retrieving setting", {
					message: error.message,
				})
				throw error
			})
	}

	public async retrieveSettings() {
		return await this.all<DatabaseSetting>()
			.then((settings) => {
				return this._transformSettingsArrayToObject([
					...this._DEFAULT_SETTINGS.map((setting) => {
						return {
							...setting,
							...settings.find((s) => s.name === setting.name),
						}
					}),
					...settings,
				])
			})
			.catch((error) => {
				reportError("Error while retrieving settings", {
					message: error.message,
				})
				throw error
			})
	}

	public async updateSetting(
		name: DatabaseSetting["name"],
		newValue: ValueTypes
	) {
		const setting = await this._retrieveSetting(name)

		return new Promise((resolve, reject) => {
			this.columns(["name", "value", "defaultValue", "type"])
				.insertOrReplace([
					[
						name,
						this._exportToDatabaseValue(
							newValue ?? setting.defaultValue,
							setting.type
						),
						setting.defaultValue,
						setting.type,
					],
				])
				.then((data) => resolve(Boolean(data)))
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
}
