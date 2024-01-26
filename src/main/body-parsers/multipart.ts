import multer from "multer"
import type { BodyParser } from "@types"

const parse: BodyParser = (req, res) => {
	const upload = multer({ storage: multer.memoryStorage() })
	const multerUpload = upload.any()

	return new Promise((resolve, reject) => {
		multerUpload(req, res, (error: any) => {
			if (error) {
				return reject(error)
			}

			const body = req.body // Assuming req.body is an object

			const formData = Object.keys(body).reduce(
				(acc: Record<string, any>, curr: string) => {
					if (Buffer.isBuffer(body[curr])) {
						acc[curr] = body[curr].toString("utf-8")
					} else {
						const value = body[curr]
						if (["true", "false"].includes(value)) {
							acc[curr] = value === "true"
						} else {
							acc[curr] = value
						}
					}
					return acc
				},
				{}
			)
			return resolve(formData)
		})
	})
}

export default parse
