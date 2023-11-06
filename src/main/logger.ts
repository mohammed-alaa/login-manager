import winston from "winston"

let _logger: winston.Logger | null = null

export function initLogger() {
	_logger = winston.createLogger({
		transports: [
			new winston.transports.File({
				filename: "error.log",
				level: "error",
			}),
			new winston.transports.File({
				filename: "info.log",
				level: "info",
			}),
		],
	})
}

export function getLogger() {
	return _logger
}

export function deInitLogger() {
	_logger?.close()
	_logger = null
}
