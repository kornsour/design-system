import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

describe("Select", () => {
	// Opening the popover exercises Radix's pointer-capture/scroll-lock
	// internals, which jsdom doesn't implement — closed-state rendering
	// (trigger + placeholder) is what a smoke test can assert reliably here.
	it("renders a closed trigger showing the placeholder", () => {
		render(
			<Select>
				<SelectTrigger aria-label="Framework">
					<SelectValue placeholder="Choose a framework" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="react">React</SelectItem>
				</SelectContent>
			</Select>,
		);

		const trigger = screen.getByRole("combobox", { name: "Framework" });
		expect(trigger).toBeDefined();
		expect(trigger.getAttribute("aria-expanded")).toBe("false");
		expect(screen.getByText("Choose a framework")).toBeDefined();
	});
});
