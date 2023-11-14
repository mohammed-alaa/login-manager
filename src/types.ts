// These file contains all the types used in the project
// Across main and renderer processes

export type InstallForm = {
	passPhrase: string
	confirmedPassPhrase: string
}

export type Settings = {
	startOnLogin: boolean
	startMinimized: boolean
	hashedPassPhrase: string
}

export type LoginItem = {
	id: number
	website: string
	username: string
	password: string
}

export type LoginList = Array<Exclude<LoginItem, "password">>
