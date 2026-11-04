import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { careerOpsStatus } from "./career-ops";

function tempDir() {
	return mkdtempSync(join(tmpdir(), "slothprep-"));
}

describe("careerOpsStatus", () => {
	it("is unset when no directory is configured", () => {
		expect(careerOpsStatus(undefined)).toEqual({ state: "unset" });
		expect(careerOpsStatus("  ")).toEqual({ state: "unset" });
	});

	it("reports a directory that does not exist", () => {
		const root = join(tempDir(), "nope");
		expect(careerOpsStatus(root)).toEqual({ state: "missing", root });
	});

	it("lists the sentinels a folder is missing", () => {
		const root = tempDir();
		writeFileSync(join(root, "AGENTS.md"), "");
		expect(careerOpsStatus(root)).toEqual({
			state: "invalid",
			root,
			missing: ["modes"],
		});
	});

	it("rejects a sentinel of the wrong kind", () => {
		const root = tempDir();
		mkdirSync(join(root, "AGENTS.md"));
		mkdirSync(join(root, "modes"));
		expect(careerOpsStatus(root)).toMatchObject({
			state: "invalid",
			missing: ["AGENTS.md"],
		});
	});

	it("accepts a career-ops checkout", () => {
		const root = tempDir();
		writeFileSync(join(root, "AGENTS.md"), "");
		mkdirSync(join(root, "modes"));
		expect(careerOpsStatus(root)).toEqual({ state: "ok", root });
	});
});
