import { Label, Textarea } from "design-system";

const field: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, maxWidth: 380 };

export const WithLabel = () => (
	<div style={field}>
		<Label htmlFor="bio">Bio</Label>
		<Textarea id="bio" placeholder="Tell us a little about yourself" />
	</div>
);

export const Disabled = () => (
	<div style={field}>
		<Textarea defaultValue="This field is read-only." disabled />
	</div>
);
