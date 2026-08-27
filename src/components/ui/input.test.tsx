import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
	it("renders as a text input and accepts typed text", async () => {
		render(<Input placeholder="Email" />);
		const input = screen.getByPlaceholderText("Email");
		expect(input.tagName).toBe("INPUT");

		await userEvent.type(input, "hi@example.com");
		expect(input).toHaveProperty("value", "hi@example.com");
	});

	it("marks itself invalid via aria-invalid without losing its base classes", () => {
		render(<Input aria-invalid="true" />);
		const input = screen.getByRole("textbox");
		expect(input.getAttribute("aria-invalid")).toBe("true");
		expect(input.className).toContain("rounded-md");
	});
});
