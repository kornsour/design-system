import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";
import { Label } from "./label";

describe("Label", () => {
	it("associates with a field via htmlFor", () => {
		render(
			<>
				<Label htmlFor="email">Email</Label>
				<Input id="email" />
			</>,
		);
		expect(screen.getByLabelText("Email")).toBeDefined();
	});
});
