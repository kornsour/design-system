import type * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
	return (
		// This is the standard fix for axe's scrollable-region-focusable rule
		// (WCAG 2.1.1): a horizontally scrollable region needs to be reachable by
		// keyboard, hence tabIndex + role="region" + aria-label on an otherwise
		// non-interactive div rather than a bare <section> (which has no
		// equivalent for naming an unlabeled region).
		// biome-ignore lint/a11y/useSemanticElements: see above
		<div
			className="relative w-full overflow-x-auto"
			// biome-ignore lint/a11y/noNoninteractiveTabindex: see comment above the div
			tabIndex={0}
			role="region"
			aria-label="Scrollable table"
		>
			<table className={cn("w-full caption-bottom text-sm", className)} {...props} />
		</div>
	);
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
	return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
	return (
		<tfoot
			className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
			{...props}
		/>
	);
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			className={cn(
				"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
				className,
			)}
			{...props}
		/>
	);
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
	return (
		<th
			className={cn(
				"h-10 px-3 text-left align-middle font-medium text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
	return <td className={cn("p-3 align-middle", className)} {...props} />;
}

export function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
	return <caption className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />;
}
