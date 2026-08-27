import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
	it("renders its children", () => {
		render(<Badge>New</Badge>);
		expect(screen.getByText("New")).toBeDefined();
	});

	it.each([
		["default", "bg-primary"],
		["secondary", "bg-secondary"],
		["destructive", "bg-destructive"],
		["success", "bg-success"],
		["warning", "bg-warning"],
		["outline", "border-border"],
	] as const)("variant=%s emits its cva class", (variant, expectedClass) => {
		render(<Badge variant={variant}>Status</Badge>);
		expect(screen.getByText("Status").className).toContain(expectedClass);
	});
});
