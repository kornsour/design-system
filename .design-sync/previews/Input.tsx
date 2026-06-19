import { Input, Label } from "typescript-template";

const field: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, maxWidth: 320 };
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 };

export const WithLabel = () => (
	<div style={field}>
		<Label htmlFor="email">Email</Label>
		<Input id="email" type="email" placeholder="you@example.com" />
	</div>
);

export const States = () => (
	<div style={col}>
		<Input placeholder="Default" />
		<Input defaultValue="With a value" />
		<Input placeholder="Disabled" disabled />
		<Input defaultValue="Invalid entry" aria-invalid="true" />
	</div>
);
