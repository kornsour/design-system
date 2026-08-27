import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "./table";

describe("Table", () => {
	it("renders header, body, footer, and caption content", () => {
		render(
			<Table>
				<TableCaption>Recent orders</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Order</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>#1024</TableCell>
					</TableRow>
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell>Total: 1</TableCell>
					</TableRow>
				</TableFooter>
			</Table>,
		);
		expect(screen.getByRole("table")).toBeDefined();
		expect(screen.getByText("Recent orders")).toBeDefined();
		expect(screen.getByText("Order")).toBeDefined();
		expect(screen.getByText("#1024")).toBeDefined();
		expect(screen.getByText("Total: 1")).toBeDefined();
	});
});
