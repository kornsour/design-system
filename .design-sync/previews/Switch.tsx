import { Label, Switch } from "design-system";

const inline: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8 };
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 12 };

export const States = () => (
	<div style={col}>
		<div style={inline}>
			<Switch id="s1" />
			<Label htmlFor="s1">Off</Label>
		</div>
		<div style={inline}>
			<Switch id="s2" defaultChecked />
			<Label htmlFor="s2">On</Label>
		</div>
		<div style={inline}>
			<Switch id="s3" defaultChecked disabled />
			<Label htmlFor="s3">Disabled</Label>
		</div>
	</div>
);
