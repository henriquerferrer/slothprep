import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import appCss from "../styles.css?url";

const Devtools = import.meta.env.DEV
	? lazy(() => import("../integrations/devtools"))
	: () => null;

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover",
			},
			{ title: "slothprep" },
			{
				name: "description",
				content:
					"Interview practice built on career-ops: stories, company prep, timed drills and mock interviews.",
			},
			{ name: "theme-color", content: "#2f6a4a" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
					<div className="mx-auto flex h-14 max-w-3xl items-center px-4">
						<Link to="/" className="text-lg font-bold tracking-tight">
							slothprep
						</Link>
					</div>
				</header>
				<main className="mx-auto max-w-3xl px-4 pb-16">{children}</main>
				<Suspense>
					<Devtools />
				</Suspense>
				<Scripts />
			</body>
		</html>
	);
}
