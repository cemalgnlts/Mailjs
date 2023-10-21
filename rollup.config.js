import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

/** @type {import("rollup").RollupOptions} */
export default {
	input: "src/index.ts",
	external: ["node-fetch", "eventsource"],
	plugins: [typescript({ tsconfig: "./tsconfig.json" })],
	output: [
		{
			file: "dist/mailjs.mjs",
			format: "es",
		},
		{
			file: "dist/mailjs.cjs",
			format: "cjs",
			exports: "default"
		},
		{
			file: "dist/mailjs.min.js",
			format: "iife",
			name: "Mailjs",
			interop: "default",
			globals: { "eventsource": "window.EventSourcePolyfill" },
			plugins: [terser()]
		}
	],
};
