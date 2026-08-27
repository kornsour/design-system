import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
	it("renders as a role=alert region with title and description", () => {
		render(
			<Alert>
				<AlertTitle>Heads up</AlertTitle>
				<AlertDescription>Something needs your attention.</AlertDescription>
			</Alert>,
		);
		const alert = screen.getByRole("alert");
		expect(alert).toBeDefined();
		expect(screen.getByText("Heads up")).toBeDefined();
		expect(screen.getByText("Something needs your attention.")).toBeDefined();
	});

	it.each([
		["default", "bg-card"],
		["destructive", "border-destructive/50"],
		["success", "border-success/50"],
		["warning", "border-warning/60"],
	] as const)("variant=%s emits its cva class", (variant, expectedClass) => {
		render(<Alert variant={variant}>Body</Alert>);
		expect(screen.getByRole("alert").className).toContain(expectedClass);
	});
});
