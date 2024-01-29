import { reportError } from "@utils"
import type { LoginItem, CreateEditFormData } from "@types"
import { BaseRepository } from "./base"

export class LoginRepository extends BaseRepository {
	private _LOGIN_LIST_PAGINATION_LIMIT = 7

	constructor() {
		super("logins")
	}

	public async countLogins() {
		return this.columns(["COUNT(*) AS `logins_number`"])
			.get<{ logins_number: number }>()
			.then(({ logins_number }) => logins_number)
			.catch((error) => {
				reportError("Error while retrieving number of logins", {
					message: error.message,
				})
				throw error
			})
	}

	public async retrieveLogins<T>() {
		return await this.all<T>()
			.then((logins) => logins)
			.catch((error) => {
				reportError("Error while retrieving logins", error.message)
				throw error
			})
	}

	public async retrieveLogin(loginId: number) {
		return await this.columns(["id", "website", "username", "password"])
			.where("id", loginId)
			.get<LoginItem>()
			.then((login) => login)
			.catch((error) => {
				reportError(`Error while retrieving login ${loginId}`, {
					message: error.message,
					loginId,
				})
				throw error
			})
	}

	public hasMore(count: number, page: number) {
		return count > page * this._LOGIN_LIST_PAGINATION_LIMIT
	}

	public async updateLogin(loginId: number, data: CreateEditFormData) {
		return this.withTransaction(async () => {
			await this.columns(["website", "username", "password"])
				.where("id", loginId)
				.update(Object.values(data))
				.then((isUpdated) => Boolean(isUpdated))
				.catch((error: Error) => {
					reportError("Error updating login details", {
						message: error.message,
						context: {
							loginId,
							data,
						},
					})
					throw error
				})
		})
	}

	public async deleteLogin(loginId: number) {
		return this.withTransaction(async () => {
			return await this.where("id", loginId)
				.delete()
				.catch((error: Error) => {
					reportError("Error deleting login", {
						message: error.message,
						context: {
							loginId,
						},
					})
					throw error
				})
		})
	}

	public async createLogin(data: CreateEditFormData) {
		return this.withTransaction(async () => {
			await this.columns(["website", "username", "password"])
				.insert(Object.values(data))
				.then((isInserted) => Boolean(isInserted))
				.catch((error: Error) => {
					reportError("Error creating new login", {
						message: error.message,
						context: {
							data,
						},
					})
					throw error
				})
		})
	}

	public async createLogins(logins: LoginItem[]) {
		return await this.withTransaction(async () => {
			return await this.columns(["website", "username", "password"])
				.insert(logins.map((login) => Object.values(login)))
				.then((isInserted) => Boolean(isInserted))
				.catch((error: Error) => {
					reportError("Error creating new logins", {
						message: error.message,
						context: {
							logins,
						},
					})
					throw error
				})
		})
	}

	public async deleteLogins() {
		return this.withTransaction(async () => {
			await this.delete()
				.then((isDeleted) => Boolean(isDeleted))
				.catch((error: Error) => {
					reportError("Error deleting logins", {
						message: error.message,
					})
					throw error
				})
		})
	}
}
