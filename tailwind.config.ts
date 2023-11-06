/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/renderer/**/*.vue", "./src/assets/styles/**/*.sass"],
	theme: {
		extend: {
			width: {
				50: "50%",
			},
			borderRadius: {
				1: "1rem",
			},
		},
	},
	plugins: [],
}
