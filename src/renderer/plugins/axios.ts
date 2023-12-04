import axios from "axios"

const _axios = axios.create({
	baseURL: `http://localhost:${import.meta.env.RENDERER_VITE_SERVER_PORT}`,
	timeout: 5000,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest",
	},
})

_axios.interceptors.response.use(
	function (response) {
		return Promise.resolve(response.data)
	},
	function (error) {
		return Promise.reject(error.response ?? {})
	}
)

export default _axios
