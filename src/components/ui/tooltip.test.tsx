import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./tooltip";

describe("Tooltip", () => {
	// TooltipContent only mounts once open, which in Radix depends on a hover
	// delay timer; asserting the closed-state trigger is the reliable smoke
	// check without reaching for fake timers.
	it("renders its trigger without mounting content until opened", () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
				</Tooltip>
			</TooltipProvider>,
		);

		expect(screen.getByText("Hover me")).toBeDefined();
		expect(screen.queryByRole("tooltip")).toBeNull();
	});
});
