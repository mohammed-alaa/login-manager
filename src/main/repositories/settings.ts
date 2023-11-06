import { getDatabaseInstanceOrFail, transformSettingValue } from "@database"

type DatabaseSetting = {
	id: number
	name: string
	value: string
	type: string
}
type TransformedSetting = { [key: string]: any }

const transformSettingsArrayToObject = (settings: DatabaseSetting[]) => {
	const settingsObject: TransformedSetting = {}

	settings.forEach((setting: DatabaseSetting) => {
		settingsObject[setting.name] = transformSettingValue(setting.value)
	})

	return settingsObject
}

// const transformSettingsObjectToArray = (settings: any) => {}

export function retrieveSettings() {
	const db = getDatabaseInstanceOrFail()

	return new Promise((resolve, reject) => {
		db?.all(
			`SELECT * FROM settings`,
			[],
			(error, rows: DatabaseSetting[]) => {
				if (error) {
					reject(error)
				} else {
					const settings = transformSettingsArrayToObject(rows)
					resolve(settings)
				}
			}
		)
	})
}

// export function updateSetting()
