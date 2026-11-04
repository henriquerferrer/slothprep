import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { careerOpsStatusQuery } from "#/server/career-ops";

export const Route = createFileRoute("/")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(careerOpsStatusQuery),
	component: Home,
});

function Home() {
	const { data: status } = useQuery(careerOpsStatusQuery);

	return (
		<section className="pt-10 pb-6">
			<h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
				Practise for the interview you actually have.
			</h1>
			<p className="mt-3 text-muted-foreground">
				Stories, company prep, timed drills and mock interviews, built on your
				career-ops files.
			</p>
			<div
				data-testid="career-ops-status"
				className="mt-6 rounded-xl border bg-card p-4 text-sm"
			>
				{status?.state === "ok" && (
					<p>
						Connected to career-ops at <code>{status.root}</code>
					</p>
				)}
				{status?.state === "unset" && (
					<p>
						career-ops is not connected. Set <code>CAREER_OPS_DIR</code> in{" "}
						<code>.env</code> to your career-ops folder.
					</p>
				)}
				{status?.state === "missing" && (
					<p>
						No folder at <code>{status.root}</code>. Check{" "}
						<code>CAREER_OPS_DIR</code>.
					</p>
				)}
				{status?.state === "invalid" && (
					<p>
						<code>{status.root}</code> is not a career-ops folder (missing{" "}
						{status.missing.join(", ")}).
					</p>
				)}
			</div>
		</section>
	);
}
