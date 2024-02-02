import constants from "./src/renderer/constants"

const height = {
	"settings-header-height": "3.5rem",
	"search-bar": `${constants.height.searchBar}px`,
	"login-list-item": `${constants.height.loginListItem}px`,
	"login-list-toolbar": `${constants.height.loginListToolbar}px`,
}

/** @type {import('tailwindcss').Config} */
export default {
	content: {
		relative: true,
		files: [
			"./node_modules/flowbite/**/*.js",
			"./src/renderer/index.html",
			"./src/renderer/**/*.vue",
		],
	},
	theme: {
		extend: {
			colors: {
				white: "#fff",
				gray: "#ccc",
				alert: {
					danger: "#ffa9a9",
					success: "#62ffb7",
				},
				btn: {
					primary: {
						filled: "#e5d6ef",
						outlined: "#5e35b1",
					},
					danger: {
						filled: "#ffd8d8",
						outlined: "#e22727",
					},
					secondary: {
						filled: "#beded9",
						outlined: "#0f7d6b",
					},
					warning: {
						filled: "#211b0b",
						outlined: "#eab208",
					},
				},
			},
			backgroundColor: {
				body: "#131417",
				main: "#1e1f24",
				secondary: "#191a1e",
				input: "#26272d",
				focus: "#1a1b21",
				primary: "#5e35b1",
				alert: {
					danger: "#c5141433",
					success: "#1146266e",
				},
				btn: {
					primary: "#5e35b1",
					danger: "#b11111",
					secondary: "#004d40",
					warning: "#eab208",
				},
				switch: {
					on: "#5e35b1",
					off: "#32343c",
					circle: {
						on: "#fff",
						off: "#fff",
					},
				},
			},
			borderColor: {
				main: "#2e3235",
				focus: "#3d4156",
				alert: {
					danger: "#7b2a33",
					success: "#205d41",
				},
				btn: {
					primary: "#5e35b1",
					danger: "#b11111",
					secondary: "#004d40",
					warning: "#eab208",
				},
				switch: {
					circle: {
						on: "#fff",
						off: "#bdbdbd",
					},
				},
			},
			ringColor: {
				"switch-focus": "#a478ff",
			},
			height,
			minHeight: height,
			maxHeight: height,
			width: {
				50: "50%",
				80: "80%",
				"login-list": "300px",
			},
			maxWidth: {
				50: "50%",
				80: "80%",
			},
			borderRadius: {
				sm: "0.25rem",
				md: "0.375rem",
				lg: "0.5rem",
				xl: "0.75rem",
				circle: "50%",
			},
			fontSize: {
				sm: ["0.875rem", "1.25rem"],
				md: ["1rem", "1.5rem"],
				lg: ["1.125rem", "1.75rem"],
			},
			animation: {
				progress: "progress 750ms ease-in-out infinite both alternate",
			},
			keyframes: {
				progress: {
					"0%": { width: "0", left: "-100%" },
					"25%": { width: "0", left: "0" },
					"75%": { width: "100%", left: "0" },
					"100%": { width: "0", left: "100%" },
				},
			},
		},
	},
	plugins: [require("flowbite/plugin")],
}
