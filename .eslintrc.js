module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		commonjs: true,
	},
	extends: [
		"@vue/prettier",
		"plugin:vue/vue3-essential",
		"plugin:vue/vue3-recommended",
		// "@vue/typescript/recommended",
		"@vue/eslint-config-prettier",
	],
	// parserOptions: {
	// parser: "@typescript-eslint/parser",
	// },
	// plugins: ["vue", "@typescript-eslint"],
	plugins: ["vue"],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-extra-boolean-cast": "off",
		"vue/multi-word-component-names": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		// "@typescript-eslint/no-unused-vars": [
		// 	"error",
		// 	{ argsIgnorePattern: "^_" },
		// ],
	},
	ignorePatterns: ["build", "out", "release", "dist"],
}
