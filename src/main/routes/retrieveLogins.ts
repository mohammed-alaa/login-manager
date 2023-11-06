import { ResponseHandler } from "@types"

const handle: ResponseHandler = (res, response) => {
	response(res, 200, { message: "Hello World" })
}

export default handle
