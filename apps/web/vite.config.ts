import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// Single .env at the monorepo root, shared with packages/db. Variables already
// set in the environment win, so CI/e2e can point at a different database.
const rootEnv = new URL("../../.env", import.meta.url);
if (existsSync(rootEnv)) {
	for (const [k, v] of Object.entries(
		parseEnv(readFileSync(rootEnv, "utf8")),
	)) {
		process.env[k] ??= v;
	}
}

export default defineConfig({
	envDir: "../..",
	resolve: { tsconfigPaths: true },
	plugins: [devtools(), nitro(), tailwindcss(), tanstackStart(), viteReact()],
});
