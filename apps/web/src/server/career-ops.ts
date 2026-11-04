import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export const getCareerOpsStatus = createServerFn({ method: "GET" }).handler(
	async () => {
		const { careerOpsStatus } = await import("@slothprep/core/career-ops");
		const { env } = await import("#/env");
		return careerOpsStatus(env.CAREER_OPS_DIR);
	},
);

export const careerOpsStatusQuery = queryOptions({
	queryKey: ["career-ops", "status"],
	queryFn: () => getCareerOpsStatus(),
});
