import { Checkbox, Input, Label } from "typescript-template";

const field: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, maxWidth: 320 };
const inline: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8 };

export const WithInput = () => (
	<div style={field}>
		<Label htmlFor="name">Full name</Label>
		<Input id="name" placeholder="Ada Lovelace" />
	</div>
);

export const WithCheckbox = () => (
	<div style={inline}>
		<Checkbox id="terms" defaultChecked />
		<Label htmlFor="terms">Accept terms and conditions</Label>
	</div>
);
