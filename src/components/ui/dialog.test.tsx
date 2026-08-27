import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog";

describe("Dialog", () => {
	it("keeps its content unmounted until opened, then shows it", async () => {
		render(
			<Dialog>
				<DialogTrigger>Open settings</DialogTrigger>
				<DialogContent>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Manage your preferences.</DialogDescription>
				</DialogContent>
			</Dialog>,
		);

		expect(screen.queryByRole("dialog")).toBeNull();

		await userEvent.click(screen.getByRole("button", { name: "Open settings" }));

		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeDefined();
		expect(screen.getByText("Settings")).toBeDefined();
		expect(screen.getByText("Manage your preferences.")).toBeDefined();
	});
});
