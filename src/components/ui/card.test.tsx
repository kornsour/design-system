import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

describe("Card", () => {
	it("renders every sub-part's content", () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Plan</CardTitle>
					<CardDescription>Pro tier</CardDescription>
				</CardHeader>
				<CardContent>$20/month</CardContent>
				<CardFooter>Upgrade</CardFooter>
			</Card>,
		);
		expect(screen.getByText("Plan")).toBeDefined();
		expect(screen.getByText("Pro tier")).toBeDefined();
		expect(screen.getByText("$20/month")).toBeDefined();
		expect(screen.getByText("Upgrade")).toBeDefined();
	});
});
