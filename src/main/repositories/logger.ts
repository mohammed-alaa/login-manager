import {
	createLogger,
	transports,
	type Logger as AbstractLogger,
} from "winston"

export class Logger {
	private _logger: AbstractLogger | null = null
	private static _instance: Logger | null = null

	constructor() {
		this.init()
	}

	public static getInstance() {
		if (!this._instance) {
			this._instance = new this()
		}

		return this._instance
	}

	public init() {
		this._logger = createLogger({
			transports: [
				new transports.File({
					filename: "error.log",
					level: "error",
				}),
				new transports.File({
					filename: "info.log",
					level: "info",
				}),
			],
		})
	}

	public getLogger() {
		return this._logger
	}

	public deInit() {
		this._logger?.close()
		this._logger = null
	}
}
