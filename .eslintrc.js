module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: [
		"plugin:vue/vue3-recommended",
		"prettier",
		"eslint:recommended",
		"@vue/typescript/recommended",
		"@vue/prettier",
	],
	parserOptions: {
		ecmaVersion: 2021,
	},
	plugins: ["vue", "@typescript-eslint"],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-extra-boolean-cast": "off",
		"vue/multi-word-component-names": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-unused-vars": "warn",
		"@typescript-eslint/explicit-module-boundary-types": "off",
	},
	ignorePatterns: ["build", "out", "release", "dist"],
}
