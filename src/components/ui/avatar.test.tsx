import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarFallback } from "./avatar";

describe("Avatar", () => {
	it("renders its fallback content", () => {
		// AvatarImage is omitted: jsdom never resolves image loads, so Radix
		// would leave it stuck in the "loading" state forever — untestable
		// without faking image decode, and out of scope for a smoke test.
		render(
			<Avatar>
				<AvatarFallback>AK</AvatarFallback>
			</Avatar>,
		);
		expect(screen.getByText("AK")).toBeDefined();
	});
});
