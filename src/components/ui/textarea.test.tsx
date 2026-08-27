import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
	it("renders as a textarea and accepts typed text", async () => {
		render(<Textarea placeholder="Notes" />);
		const textarea = screen.getByPlaceholderText("Notes");
		expect(textarea.tagName).toBe("TEXTAREA");

		await userEvent.type(textarea, "Ships Friday");
		expect(textarea).toHaveProperty("value", "Ships Friday");
	});
});
