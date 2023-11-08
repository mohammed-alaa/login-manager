import {
	defineConfig,
	splitVendorChunkPlugin,
	externalizeDepsPlugin,
} from "electron-vite"
import { resolve } from "path"
import vue from "@vitejs/plugin-vue"
import eslintPlugin from "vite-plugin-eslint"
import svgLoader from "vite-svg-loader"

export default defineConfig({
	main: {
		publicDir: resolve(__dirname, "./resources"),
		plugins: [externalizeDepsPlugin()],
		resolve: {
			extensions: [".js", ".ts"],
			alias: [
				{
					find: "@utils",
					replacement: resolve(__dirname, "./src/main/utils.ts"),
				},
				{
					find: "@types",
					replacement: resolve(__dirname, "./src/main/types.ts"),
				},
				{
					find: "@globalTypes",
					replacement: resolve(__dirname, "./src/types.ts"),
				},
				{
					find: "@repositories",
					replacement: resolve(__dirname, "./src/main/repositories"),
				},
				{
					find: "@database",
					replacement: resolve(
						__dirname,
						"./src/main/repositories/database.ts"
					),
				},
				{
					find: "@routes",
					replacement: resolve(__dirname, "./src/main/routes"),
				},
				{
					find: "@schemas",
					replacement: resolve(__dirname, "./src/main/schemas.ts"),
				},
			],
		},
		build: {
			outDir: "build/main",
			emptyOutDir: true,
			rollupOptions: {
				external: ["sqlite3"],
			},
			commonjsOptions: {
				sourceMap: false,
				transformMixedEsModules: true,
			},
		},
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
		build: {
			outDir: "build/preload",
			emptyOutDir: true,
		},
	},
	renderer: {
		plugins: [
			splitVendorChunkPlugin(),
			vue({
				template: {
					transformAssetUrls: {
						base: null,
						includeAbsolute: false,
					},
					compilerOptions: {
						whitespace: "condense",
						optimizeImports: true,
						sourceMap: false,
					},
				},
				style: {
					trim: true,
				},
			}),
			eslintPlugin({
				emitWarning: true,
				emitError: true,
			}),
			svgLoader({
				defaultImport: "component",
			}),
		],
		resolve: {
			extensions: [".js", ".ts", ".vue"],
			alias: [
				{
					find: "@",
					replacement: resolve(__dirname, "./src/renderer"),
				},
				{
					find: "@components",
					replacement: resolve(
						__dirname,
						"./src/renderer/components"
					),
				},
				{
					find: /^@views\/(.*)$/,
					replacement: resolve(
						__dirname,
						"./src/renderer/router/$1/index.vue"
					),
				},
				{
					find: "@utils",
					replacement: resolve(
						__dirname,
						"./src/renderer/utils/index.ts"
					),
				},
				{
					find: "@store",
					replacement: resolve(
						__dirname,
						"./src/renderer/store/index.ts"
					),
				},
				{
					find: "@assets",
					replacement: resolve(__dirname, "./src/renderer/assets"),
				},
				{
					find: /^@icons\/(.*)$/,
					replacement: resolve(
						__dirname,
						"./src/renderer/assets/icons/$1.svg"
					),
				},
				{
					find: "@globalTypes",
					replacement: resolve(__dirname, "./src/types.ts"),
				},
			],
		},
		css: {
			devSourcemap: true,
		},
		build: {
			emptyOutDir: true,
			outDir: "build/renderer",
			commonjsOptions: {
				sourceMap: false,
				extensions: [".js", ".ts", ".vue"],
			},
			rollupOptions: {
				treeshake: "recommended",
				output: {
					compact: true,
					manualChunks: () => "app",
				},
			},
		},
	},
})
