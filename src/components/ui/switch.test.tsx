import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Switch } from "./switch";

describe("Switch", () => {
	it("renders unchecked by default and toggles on click", async () => {
		render(<Switch aria-label="Notifications" />);
		const toggle = screen.getByRole("switch", { name: "Notifications" });
		expect(toggle.getAttribute("aria-checked")).toBe("false");

		await userEvent.click(toggle);
		expect(toggle.getAttribute("aria-checked")).toBe("true");
	});
});
