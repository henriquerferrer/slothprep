import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		// Absolute path to a career-ops checkout. Unset is a valid state: the app
		// shows how to connect one instead of failing.
		CAREER_OPS_DIR: z.string().min(1).optional(),
		SERVER_URL: z.url().optional(),
	},
	clientPrefix: "VITE_",
	client: {},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
