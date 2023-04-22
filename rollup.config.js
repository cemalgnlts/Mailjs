import typescript from "@rollup/plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

export default {
	input: "src/index.ts",
	external: "node-fetch",
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
			file: "./mailjs.min.js",
			format: "iife",
			name: "Mailjs",
			interop: false,
			globals: {
				"node-fetch": "fetch"
			},
			plugins: [uglify()]
		}
	],
	plugins: [typescript({ tsconfig: "./tsconfig.json" })]
};
