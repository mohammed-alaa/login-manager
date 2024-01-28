import type {
	Sort,
	Where,
	QueryVerbs,
	DatabaseQuery,
	InsertQueryValues,
	UpdateQueryValues,
} from "@types"
import { debug } from "@utils"

export class QueryCompiler {
	public constructor(private _tableName: string) {}

	private _buildSelectQuery(columns: DatabaseQuery["columns"] = ["*"]) {
		return ["SELECT", columns.join(", "), "FROM", this._tableName]
	}

	private _buildDeleteQuery() {
		return ["DELETE FROM", this._tableName]
	}

	private _buildInsertQuery(
		columns: DatabaseQuery["columns"] = ["*"],
		params: InsertQueryValues
	) {
		const placeholderValue = Array(columns.length).fill("?").join(", ")
		const query = [
			"INSERT INTO",
			this._tableName,
			`(${columns.join(", ")})`,
			"SELECT",
			placeholderValue,
		]

		const placeholders = params.map(
			() => ` UNION ALL SELECT ${placeholderValue} `
		)

		placeholders.splice(0, 1)
		query.push(...placeholders)
		return query
	}

	private _buildInsertOrReplaceQuery(
		columns: DatabaseQuery["columns"] = ["*"],
		params: InsertQueryValues
	) {
		const query = this._buildInsertQuery(columns, params)
		query[0] = "INSERT OR REPLACE INTO"
		return query
	}

	private _buildUpdateQuery(columns: DatabaseQuery["columns"] = []) {
		const query = ["UPDATE", this._tableName, "SET"]

		if (columns.length === 0) {
			throw new Error("No columns provided")
		}

		query.push(...columns.map((column) => `${column} = ?`))
		return query
	}

	private _compileQuery<T>(
		verb: QueryVerbs,
		columns: DatabaseQuery["columns"],
		params: T
	) {
		let query: string[] = []

		switch (verb) {
			case "SELECT":
				query = this._buildSelectQuery(columns)
				break
			case "INSERT":
				query = this._buildInsertQuery(
					columns,
					params as InsertQueryValues
				)
				break
			case "INSERT OR REPLACE":
				query = this._buildInsertOrReplaceQuery(
					columns,
					params as InsertQueryValues
				)
				break
			case "UPDATE":
				query = this._buildUpdateQuery(columns)
				break
			case "DELETE":
				query = this._buildDeleteQuery()
				break
		}

		return query.join(" ")
	}

	private _compileWheres(wheres: Where[]) {
		const compiledWheres = wheres.map(({ column, operator, or }) => {
			const where = [or ? "OR" : "AND", ` ${column} ${operator} ?`]
			if (["LIKE", "NOT LIKE"].includes(operator)) {
				where.push("ESCAPE '\\'")
			} else if (["IN", "NOT IN"].includes(operator)) {
				where.push(`(${Array(wheres.length).fill("?").join(", ")})`)
			}
			return where.join(" ")
		})

		return compiledWheres.length
			? `WHERE ${compiledWheres.join(" ").replace(/^OR |^AND /, "")}`
			: ""
	}

	private _compileLimit(limit: DatabaseQuery["limit"]) {
		return !limit ? "" : `LIMIT ${limit}`
	}

	private _compileOffset(offset: DatabaseQuery["offset"]) {
		return !offset ? "" : `OFFSET ${offset}`
	}

	private _compileSorts(sorts: Sort[]) {
		const compiledSorts = sorts.map(({ column, direction }) => {
			return `${column} ${direction}`
		})

		return compiledSorts.length
			? `ORDER BY ${compiledSorts.join(", ")}`
			: ""
	}

	private _prepareParams<T>(verb: QueryVerbs, wheres: Where[], params: T): T {
		const wheresValues = wheres.map(({ value }) => value)

		switch (verb) {
			// Use wheres params
			case "DELETE":
				params = wheresValues.flat() as T
				break
			case "SELECT":
				params = wheresValues.flat() as T
				break
			// Use values
			case "INSERT":
			case "INSERT OR REPLACE":
				params = (params as InsertQueryValues).flat() as T
				break
			// Use both wheres and values params, in this order: values, wheres
			case "UPDATE":
				params = [
					...(params as UpdateQueryValues),
					...wheresValues.flat(),
				] as T
				break
		}

		return params as T
	}

	private _buildQuery(
		query: string,
		wheres: string,
		sorts: string,
		limit: string,
		offset: string
	) {
		return [query, wheres, sorts, limit, offset]
			.filter((part) => part)
			.join(" ")
			.trim()
	}

	public compile<T>(verb: QueryVerbs, dbQuery: DatabaseQuery, params: T) {
		const query = this._compileQuery<T>(verb, dbQuery.columns, params)
		const wheres = this._compileWheres(dbQuery.wheres)
		const sorts = this._compileSorts(dbQuery.sort)
		const limit = this._compileLimit(dbQuery.limit)
		const offset = this._compileOffset(dbQuery.offset)
		const sql = this._buildQuery(query, wheres, sorts, limit, offset)
		params = this._prepareParams<T>(verb, dbQuery.wheres, params)
		debug("QueryCompiler", {
			sql,
			params,
		})
		return { sql, params }
	}
}
