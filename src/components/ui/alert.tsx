import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
	"relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4 [&>svg~*]:pl-7",
	{
		variants: {
			variant: {
				default: "bg-card text-card-foreground",
				destructive:
					"border-destructive/50 text-destructive [&>svg]:text-destructive bg-destructive/5",
				success: "border-success/50 text-success [&>svg]:text-success bg-success/5",
				warning: "border-warning/60 text-warning [&>svg]:text-warning bg-warning/5",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface AlertProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
	return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

export function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
	return (
		<h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
	);
}

export function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("text-sm [&_p]:leading-relaxed opacity-90", className)} {...props} />;
}

export { alertVariants };
