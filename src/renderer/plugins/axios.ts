import axios from "axios"

const _axios = axios.create({
	baseURL: `http://localhost:${import.meta.env.RENDERER_VITE_SERVER_PORT}`,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest",
	},
})

export default _axios
