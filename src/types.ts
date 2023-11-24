// These file contains all the types used in the project
// Across main and renderer processes

export type InstallForm = {
	primaryPassword: string
	confirmedPrimaryPassword: string
}

export type LoginForm = {
	primaryPassword: string
}

export type Settings = {
	startOnLogin: boolean
	startMinimized: boolean
	hashedPrimaryPassword: string
}

export type LoginItem = {
	id: number
	website: string
	username: string
	password: string
}

export type LoginList = Array<Exclude<LoginItem, "password">>
export type RetrieveLoginListType = {
	hasMore: boolean
	count: number
	logins: LoginList
}

export type CreateEditFormData = {
	website: string
	username: string
	password: string
}

export type ipcRenderer = {
	invoke: (channel: string, ...args: any) => Promise<any>
	send: (channel: string, ...args: any) => void
}

export type AppInformationType = {
	customAppHeader: boolean
	appName: string
	version: string
	homepage: string
	description: string
	repository: string
	bugs: {
		url: string
		email: string
	}
	author: {
		name: string
		email: string
		url: string
	}
}
