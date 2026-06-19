import { Checkbox, Label } from "@kornorg/design-system";

const inline: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8 };
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 12 };

export const States = () => (
	<div style={col}>
		<div style={inline}>
			<Checkbox id="c1" />
			<Label htmlFor="c1">Unchecked</Label>
		</div>
		<div style={inline}>
			<Checkbox id="c2" defaultChecked />
			<Label htmlFor="c2">Checked</Label>
		</div>
		<div style={inline}>
			<Checkbox id="c3" defaultChecked disabled />
			<Label htmlFor="c3">Disabled</Label>
		</div>
	</div>
);
