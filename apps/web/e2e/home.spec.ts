import { expect, test } from "@playwright/test";

test("home connects to the career-ops fixture", async ({ page }) => {
	await page.goto("/");
	await expect(
		page.getByRole("heading", { name: /interview you actually have/i }),
	).toBeVisible();
	await expect(page.getByTestId("career-ops-status")).toContainText(
		"Connected to career-ops",
	);
});
