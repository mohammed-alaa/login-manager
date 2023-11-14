/** @type {import('tailwindcss').Config} */
export default {
	content: {
		relative: true,
		files: ["./src/renderer/index.html", "./src/renderer/**/*.vue"],
	},
	theme: {
		extend: {
			height: {
				topbar: "3rem",
			},
			width: {
				50: "50%",
			},
			borderRadius: {
				sm: "0.25rem",
				md: "0.375rem",
				lg: "0.5rem",
				xl: "0.75rem",
			},
		},
	},
	plugins: [],
}
