import { build } from "esbuild";

const entryPoints = ["src/index.ts"];

const buildOpts = [
    {
        format: "cjs",
        platform: "node",
        packages: "external",
        outfile: "dist/mail.cjs",
    },
    {
        format: "esm",
        platform: "node",
        packages: "external",
        outfile: "dist/mail.mjs"
    },
    {
        format: "iife",
        outfile: "dist/mail.min.js",
        platform: "browser",
        globalName: "Mailjs",
    }
];

const promises = [];

for (const opts of buildOpts) {
    const step = build({
        allowOverwrite: true,
        entryPoints,
        ...opts
    });

    promises.push(step);
}

await Promise.all(promises);