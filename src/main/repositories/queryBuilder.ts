import { Database } from "@database"
import { QueryCompiler } from "./queryCompiler"
import type {
	InsertQueryValues,
	DatabaseQuery,
	QueryVerbs,
	Where,
	Sort,
	WhereOperators,
	UpdateQueryValues,
	WhereOperatorsLike,
	WhereOperatorsComparison,
	DeleteQueryValues,
	SelectQueryValues,
} from "@types"

export class QueryBuilder extends Database {
	private _instance
	private _queryCompiler: QueryCompiler
	private _query: DatabaseQuery = {
		columns: ["*"],
		wheres: [] as Where[],
		sort: [] as Sort[],
		limit: null as number | null,
		offset: null as number | null,
	}

	private _WHERE_OPERATORS: WhereOperators[] = [
		"=",
		"<",
		">",
		"<=",
		">=",
		"<>",
		"!=",
		"LIKE",
		"NOT LIKE",
		"IN",
		"NOT IN",
		"BETWEEN",
		"NOT BETWEEN",
		"IS",
		"IS NOT",
	]

	constructor(tableName: string) {
		super()
		this._queryCompiler = new QueryCompiler(tableName)
		this._instance = Database.getInstance()
	}

	private _compileQuery<T>(verb: QueryVerbs, params: T) {
		return this._queryCompiler.compile<T>(verb, this._query, params)
	}

	private _where(
		column: Where["column"],
		value: Where["value"] = null,
		operator: Where["operator"] = "=",
		or: Where["or"] = false
	) {
		if (Array.isArray(value)) {
			value = value.flat()
			if (["=", "!=", "IN", "NOT IN"].includes(operator)) {
				operator = operator === "=" ? "IN" : "NOT IN"
			} else {
				throw new Error(`Invalid operator for array value: ${operator}`)
			}
		} else if (value === null) {
			if (["=", "!=", "IS", "IS NOT"].includes(operator)) {
				operator = operator === "=" ? "IS" : "IS NOT"
			} else {
				throw new Error(`Invalid operator for null value: ${operator}`)
			}
		}

		if (!this._WHERE_OPERATORS.includes(operator)) {
			throw new Error(`Invalid operator: ${operator}`)
		}

		this._query.wheres.push({ column, value, operator, or })
		return this
	}

	private _orWhere(
		column: Where["column"],
		value: Where["value"] = null,
		operator: WhereOperators = "="
	) {
		return this._where(column, value, operator, true)
	}

	private _whereLike(
		column: Where["column"],
		value: Where["value"] = null,
		operator: WhereOperatorsLike = "LIKE",
		or: Where["or"] = false
	) {
		if (typeof value === "string") {
			value = value.replace(/_/g, "\\_").replace(/%/g, "\\%")
		}

		value = `%${value}%`
		return or
			? this._orWhere(column, value, operator)
			: this._where(column, value, operator, false)
	}

	private _resetQuery() {
		this._query = {
			columns: ["*"],
			wheres: [] as Where[],
			sort: [] as Sort[],
			limit: null as number | null,
			offset: null as number | null,
		}
	}

	private async _getInstance() {
		return await this._instance
	}

	public columns(columns: DatabaseQuery["columns"] = ["*"]) {
		this._query.columns = columns
		return this
	}

	public where(
		column: Where["column"],
		value: Where["value"] = null,
		operator: WhereOperatorsComparison = "="
	) {
		return this._where(column, value, operator, false)
	}

	public orWhere(
		column: Where["column"],
		value: Where["value"] = null,
		operator: WhereOperatorsComparison = "="
	) {
		return this._orWhere(column, value, operator)
	}

	public whereIn(column: Where["column"], value: Where["value"] = null) {
		return this._where(column, value, "IN", false)
	}

	public whereNotIn(column: Where["column"], value: Where["value"] = null) {
		return this._where(column, value, "NOT IN", false)
	}

	public whereBetween(column: Where["column"], value: Where["value"] = null) {
		return this._where(column, value, "BETWEEN")
	}

	public whereNotBetween(
		column: Where["column"],
		value: Where["value"] = null
	) {
		return this._where(column, value, "NOT BETWEEN", false)
	}

	public whereNull(column: Where["column"]) {
		return this._where(column, null, "IS", false)
	}

	public whereNotNull(column: Where["column"]) {
		return this._where(column, null, "IS NOT", false)
	}

	public whereLike(column: Where["column"], value: Where["value"] = null) {
		return this._whereLike(column, value, "LIKE", false)
	}

	public whereNotLike(column: Where["column"], value: Where["value"] = null) {
		return this._whereLike(column, value, "NOT LIKE", false)
	}

	public orWhereLike(column: Where["column"], value: Where["value"] = null) {
		return this._whereLike(column, value, "LIKE", true)
	}

	public orWhereNotLike(
		column: Where["column"],
		value: Where["value"] = null
	) {
		return this._whereLike(column, value, "NOT LIKE", true)
	}

	public sort(column: Sort["column"], direction: Sort["direction"] = "DESC") {
		direction = direction.toUpperCase() as Sort["direction"]
		direction = ["ASC", "DESC"].includes(direction) ? direction : "DESC"
		this._query.sort.push({ column, direction })
		return this
	}

	public limit(limit: DatabaseQuery["limit"]) {
		this._query.limit = limit
		return this
	}

	public offset(offset: DatabaseQuery["offset"]) {
		this._query.offset = offset
		return this
	}

	public async beginTransaction() {
		return (await this._getInstance()).runQuery<any>(
			"BEGIN TRANSACTION;",
			[]
		)
	}

	public async commitTransaction() {
		return (await this._getInstance()).runQuery<any>("COMMIT;", [])
	}

	public async rollbackTransaction() {
		return (await this._getInstance()).runQuery<any>("ROLLBACK;", [])
	}

	public async withTransaction<T>(callback: () => Promise<T>) {
		try {
			await this.beginTransaction()
			const result = await callback()
			await this.commitTransaction()
			return result
		} catch (error) {
			await this.rollbackTransaction()
			throw error
		}
	}

	public override async all<T>() {
		const { sql, params } = this._compileQuery<SelectQueryValues>(
			"SELECT",
			[]
		)
		const result = (await this._getInstance()).all<T>(sql, params)
		this._resetQuery()
		return result
	}

	public override async get<T>() {
		const { sql, params } = this._compileQuery<SelectQueryValues>(
			"SELECT",
			[]
		)
		const result = (await this._getInstance()).get<T>(sql, params)
		this._resetQuery()
		return result
	}

	public async insert(values: InsertQueryValues) {
		const { sql, params } = this._compileQuery<InsertQueryValues>(
			"INSERT",
			values
		)
		const result = (await this._getInstance()).runQuery(sql, params)
		this._resetQuery()
		return result
	}

	public async update(values: UpdateQueryValues) {
		const { sql, params } = this._compileQuery<UpdateQueryValues>(
			"UPDATE",
			values
		)
		const result = (await this._getInstance()).runQuery(sql, params)
		this._resetQuery()
		return result
	}

	public async insertOrReplace(values: InsertQueryValues) {
		const { sql, params } = this._compileQuery<InsertQueryValues>(
			"INSERT OR REPLACE",
			values
		)
		const result = (await this._getInstance()).runQuery(sql, params)
		this._resetQuery()
		return result
	}

	public async delete() {
		const { sql, params } = this._compileQuery<DeleteQueryValues>(
			"DELETE",
			[]
		)
		const result = (await this._getInstance()).runQuery(sql, params)
		this._resetQuery()
		return result
	}
}
