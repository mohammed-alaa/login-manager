import {
	defineConfig,
	splitVendorChunkPlugin,
	externalizeDepsPlugin,
} from "electron-vite"
import vue from "@vitejs/plugin-vue"
import eslintPlugin from "vite-plugin-eslint"
import { resolve } from "path"

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
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
		],
		resolve: {
			extensions: [".js", ".vue"],
			alias: {
				"@": resolve(__dirname, "./src/renderer"),
				"@components": resolve(__dirname, "./src/renderer/components"),
				"@utils": resolve(__dirname, "./src/renderer/utils/index.js"),
			},
		},
		build: {
			outDir: "build/renderer",
			emptyOutDir: true,
			commonjsOptions: {
				sourceMap: false,
				extensions: [".js", ".vue"],
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
