export type ValueTypes = string | number | boolean | null

export type SelectQueryValues = Array<ValueTypes>
export type UpdateQueryValues = Array<ValueTypes>
export type DeleteQueryValues = Array<ValueTypes>
export type InsertQueryValues = ValueTypes[] | ValueTypes[][]

export type AllQueryValues =
	| SelectQueryValues
	| DeleteQueryValues
	| UpdateQueryValues
	| InsertQueryValues

export type QueryVerbs =
	| "SELECT"
	| "UPDATE"
	| "DELETE"
	| "INSERT"
	| "INSERT OR REPLACE"

export type WhereOperatorsArray = "IN" | "NOT IN"
export type WhereOperatorsBetween = "BETWEEN" | "NOT BETWEEN"
export type WhereOperatorsNull = "IS" | "IS NOT"
export type WhereOperatorsLike = "LIKE" | "NOT LIKE"
export type WhereOperatorsComparison =
	| "="
	| "<>"
	| "!="
	| "<"
	| ">"
	| "<="
	| ">="

export type WhereOperators =
	| WhereOperatorsArray
	| WhereOperatorsBetween
	| WhereOperatorsNull
	| WhereOperatorsLike
	| WhereOperatorsComparison

export interface Where {
	column: string
	value: ValueTypes | ValueTypes[]
	operator: WhereOperators
	or: boolean
}

export type Sort = {
	column: string
	direction: "ASC" | "DESC"
}

export type DatabaseQuery = {
	columns: string[]
	wheres: Where[]
	sort: Sort[]
	limit: number | null
	offset: number | null
}
