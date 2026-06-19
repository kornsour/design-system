import { Button } from "@kornorg/design-system";

const row: React.CSSProperties = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" };

export const Variants = () => (
	<div style={row}>
		<Button>Primary</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="outline">Outline</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="destructive">Delete</Button>
		<Button variant="link">Link</Button>
	</div>
);

export const Sizes = () => (
	<div style={row}>
		<Button size="sm">Small</Button>
		<Button size="md">Medium</Button>
		<Button size="lg">Large</Button>
	</div>
);

export const Disabled = () => (
	<div style={row}>
		<Button disabled>Disabled</Button>
		<Button variant="outline" disabled>
			Disabled
		</Button>
	</div>
);
