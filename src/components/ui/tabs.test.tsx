import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Tabs", () => {
	it("shows the default tab's content and switches on click", async () => {
		render(
			<Tabs defaultValue="account">
				<TabsList>
					<TabsTrigger value="account">Account</TabsTrigger>
					<TabsTrigger value="billing">Billing</TabsTrigger>
				</TabsList>
				<TabsContent value="account">Account settings</TabsContent>
				<TabsContent value="billing">Billing details</TabsContent>
			</Tabs>,
		);

		expect(screen.getByText("Account settings")).toBeDefined();
		expect(screen.queryByText("Billing details")).toBeNull();

		await userEvent.click(screen.getByRole("tab", { name: "Billing" }));

		expect(screen.getByText("Billing details")).toBeDefined();
		expect(screen.queryByText("Account settings")).toBeNull();
	});
});
