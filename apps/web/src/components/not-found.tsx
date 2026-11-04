import { Link } from "@tanstack/react-router";

export function NotFound() {
	return (
		<div className="py-16 text-center">
			<h1 className="text-2xl font-bold">Page not found</h1>
			<Link to="/" className="mt-4 inline-block text-primary underline">
				Back to start
			</Link>
		</div>
	);
}
