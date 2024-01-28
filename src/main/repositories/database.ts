import { AbstractDatabase } from "./abstractDatabase"
import type { SelectQueryValues } from "@types"

export class Database extends AbstractDatabase {
	private static _instance: Database | null = null

	public static async getInstance() {
		if (!this._instance) {
			this._instance = new this()
			await this._instance.init()
		}

		return this._instance
	}

	public async all<T>(
		query: string,
		params: SelectQueryValues
	): Promise<T[]> {
		return new Promise((resolve, reject) => {
			this._dbInstance?.all<T>(query, params, (error, rows) => {
				error ? reject(error) : resolve(rows)
			})
		})
	}

	public async get<T>(query: string, params: SelectQueryValues): Promise<T> {
		return new Promise((resolve, reject) => {
			this._dbInstance?.get<T>(query, params, (error, row) => {
				error ? reject(error) : resolve(row)
			})
		})
	}

	public async runQuery<Params>(query: string, params: Params) {
		return super.runQuery<Params>(query, params)
	}
}
