import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
	it("renders unchecked by default and toggles on click", async () => {
		render(<Checkbox aria-label="Accept terms" />);
		const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
		expect(checkbox.getAttribute("aria-checked")).toBe("false");

		await userEvent.click(checkbox);
		expect(checkbox.getAttribute("aria-checked")).toBe("true");
	});

	it("stays unchecked and inert when disabled", async () => {
		render(<Checkbox aria-label="Accept terms" disabled />);
		const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
		await userEvent.click(checkbox);
		expect(checkbox.getAttribute("aria-checked")).toBe("false");
	});
});
