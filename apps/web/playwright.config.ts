import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

// e2e always runs against the fictional fixture, never a real career-ops.
const FIXTURE = fileURLToPath(
	new URL("../../fixtures/career-ops", import.meta.url),
);

const PORT = 4173;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
	use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
	// Mobile first: the phone project is the primary target.
	projects: [
		{ name: "mobile", use: { ...devices["Pixel 7"] } },
		{ name: "desktop", use: { ...devices["Desktop Chrome"] } },
	],
	webServer: {
		command: `pnpm build && pnpm preview --port ${PORT} --strictPort`,
		port: PORT,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
		env: { CAREER_OPS_DIR: FIXTURE },
	},
});
