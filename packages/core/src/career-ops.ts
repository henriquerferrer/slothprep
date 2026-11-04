import { existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

// career-ops identifies its own checkout by these two sentinels (see its
// SKILL.md "Project Root Resolution"). We use the same rule so we never read
// from a folder that only looks similar.
const SENTINELS = [
	{ path: "AGENTS.md", kind: "file" },
	{ path: "modes", kind: "dir" },
] as const;

export type CareerOpsStatus =
	| { state: "unset" }
	| { state: "missing"; root: string }
	| { state: "invalid"; root: string; missing: string[] }
	| { state: "ok"; root: string };

export function careerOpsStatus(dir: string | undefined): CareerOpsStatus {
	if (!dir?.trim()) return { state: "unset" };
	const root = resolve(dir);
	if (!existsSync(root) || !statSync(root).isDirectory()) {
		return { state: "missing", root };
	}
	const missing = SENTINELS.filter(({ path, kind }) => {
		const p = join(root, path);
		if (!existsSync(p)) return true;
		const st = statSync(p);
		return kind === "dir" ? !st.isDirectory() : !st.isFile();
	}).map(({ path }) => path);
	return missing.length > 0
		? { state: "invalid", root, missing }
		: { state: "ok", root };
}
