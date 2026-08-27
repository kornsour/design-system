import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
	it("renders as a button with its children", () => {
		render(<Button>Save</Button>);
		expect(screen.getByRole("button", { name: "Save" })).toBeDefined();
	});

	it("renders as the child element when asChild is set", () => {
		render(
			<Button asChild>
				<a href="/docs">Docs</a>
			</Button>,
		);
		const link = screen.getByRole("link", { name: "Docs" });
		expect(link).toBeDefined();
		expect(link.tagName).toBe("A");
	});

	it.each([
		["primary", "bg-primary"],
		["secondary", "bg-secondary"],
		["destructive", "bg-destructive"],
		["outline", "border-input"],
		["ghost", "hover:bg-accent"],
		["link", "text-primary"],
	] as const)("variant=%s emits its cva class", (variant, expectedClass) => {
		render(<Button variant={variant}>Go</Button>);
		const button = screen.getByRole("button", { name: "Go" });
		expect(button.className).toContain(expectedClass);
	});

	it.each([
		["sm", "h-8"],
		["md", "h-9"],
		["lg", "h-10"],
		["icon", "size-9"],
	] as const)("size=%s emits its cva class", (size, expectedClass) => {
		render(<Button size={size}>Go</Button>);
		expect(screen.getByRole("button", { name: "Go" }).className).toContain(expectedClass);
	});

	it("merges a caller className without dropping variant classes", () => {
		render(<Button className="w-full">Go</Button>);
		const button = screen.getByRole("button", { name: "Go" });
		expect(button.className).toContain("w-full");
		expect(button.className).toContain("bg-primary");
	});
});
