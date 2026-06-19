import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
			<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Design System</h1>
			<p className="max-w-md text-lg text-muted-foreground">
				A token-driven component library — synced to Claude Design via{" "}
				<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">/design-sync</code>.
			</p>
			<Button asChild size="lg">
				<Link href="/design-system">View components</Link>
			</Button>
		</div>
	);
}
