import type {
	Response,
	ResponseFunction,
	ResponseHandler,
	ImportFileDataType,
	LoginItem,
} from "@types"
import {
	reportError,
	formatZodError,
	decryptPassword,
	encryptPassword,
} from "@utils"
import { importFileSchema } from "@schemas"
import { LoginRepository } from "@repositories/logins"

interface ImportOptionsCSV {
	delimiter: string
	fileContent: string
	columns: ImportFileDataType["columns"]
}

interface ImportOptionsJSON {
	oldJSONPassword: string
	isOldJSON: boolean
	fileContent: string
	columns: ImportFileDataType["columns"]
}

const importFromCSV = (
	res: Response,
	response: ResponseFunction,
	options: ImportOptionsCSV
): Exclude<LoginItem, "id">[] | undefined => {
	let content = []

	try {
		content = options.fileContent.split("\n")

		const contentHeader = content[0].split(options.delimiter)
		const columns = {
			website: contentHeader.indexOf(String(options.columns.website)),
			username: contentHeader.indexOf(String(options.columns.username)),
			password: contentHeader.indexOf(String(options.columns.password)),
		}

		if (Object.values(columns).some((column) => column === -1)) {
			response(res, 422, {
				errors: {
					file: "Invalid CSV columns.",
				},
			})
			return undefined
		}

		const logins = content
			.slice(1)
			.filter((line) => {
				line = line.trim()
				return !line.startsWith("#") && line.length > 0
			})
			.map((line) => {
				const logins = line.trim().split(options.delimiter)
				return {
					website: logins[columns.website],
					username: logins[columns.username],
					password: logins[columns.password],
				} as Exclude<LoginItem, "id">
			})
		return logins
	} catch (error: any) {
		reportError("Parsing CSV file", {
			error: error.message,
			...options,
		})
		response(res, 422, {
			errors: {
				file: "Invalid CSV file.",
			},
		})
		return undefined
	}
}

const importFromJSON = (
	res: Response,
	response: ResponseFunction,
	options: ImportOptionsJSON
): Exclude<LoginItem, "id">[] | undefined => {
	let content = []
	const { fileContent, columns } = options
	try {
		content = JSON.parse(fileContent)
	} catch (error: any) {
		reportError("Parsing JSON file", {
			error: error.message,
			...options,
		})
		response(res, 422, {
			errors: {
				file: "Invalid JSON file.",
			},
		})
		return undefined
	}

	if (options.isOldJSON) {
		if (!options.oldJSONPassword?.trim()?.length) {
			response(res, 422, {
				errors: {
					oldJSONPassword: "Password is required.",
				},
			})
			return undefined
		}

		content = content?.logins?.map?.((login: any) => ({
			website: login.website ?? "",
			username: login.username ?? "",
			password: !login.password
				? ""
				: decryptPassword(options.oldJSONPassword, login.password),
		}))
	} else {
		content = content?.map?.((login: any) => ({
			website: login[columns.website] ?? "",
			username: login[columns.username] ?? "",
			password: login[columns.password] ?? "",
		}))
	}

	if (content === undefined) {
		response(res, 422, {
			errors: {
				file: "File content is invalid.",
			},
		})
	}

	return content
}

const handle: ResponseHandler = async (res, response) => {
	const body: Exclude<ImportFileDataType, "file"> = res.req.body

	try {
		importFileSchema.parse(body)
	} catch (error: any) {
		return response(res, 422, { errors: formatZodError(error.format()) })
	}

	const file = res.req.files?.[0]
	if (!file) {
		return response(res, 422, {
			errors: {
				file: "Invalid file.",
			},
		})
	} else if (!file.mimetype?.endsWith(body.type)) {
		reportError("Invalid file type", {
			expected: body.type,
			received: file.mimetype,
		})
		return response(res, 422, {
			errors: {
				file: `Invalid file type. Expected ${body.type} file.`,
			},
		})
	}

	const fileContent = file.buffer.toString("utf-8")
	let logins: Exclude<LoginItem, "id">[] | undefined = undefined

	if (body.type === "csv") {
		logins = importFromCSV(res, response, {
			...body,
			fileContent,
		})
	} else if (body.type === "json") {
		logins = importFromJSON(res, response, {
			...body,
			fileContent,
		})
	}
	if (!logins) return

	logins = logins.map((login) => {
		login.password = encryptPassword(process.env.PASSWORD, login.password)
		return login
	})

	try {
		const loginRepository = new LoginRepository()
		await loginRepository.createLogins(logins)
		response(res, 201, {})
	} catch (error: any) {
		reportError("Importing logins", {
			error: error.message,
		})
		response(res, 422, {
			errors: {
				general: error.message,
			},
		})
	}
}

export default handle
