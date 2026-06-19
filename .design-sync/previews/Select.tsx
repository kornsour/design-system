import {
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@kornorg/design-system";

const field: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, width: 240 };

export const WithLabel = () => (
	<div style={field}>
		<Label htmlFor="role">Role</Label>
		<Select defaultValue="editor">
			<SelectTrigger id="role">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="admin">Admin</SelectItem>
				<SelectItem value="editor">Editor</SelectItem>
				<SelectItem value="viewer">Viewer</SelectItem>
			</SelectContent>
		</Select>
	</div>
);

export const Placeholder = () => (
	<div style={{ width: 240 }}>
		<Select>
			<SelectTrigger>
				<SelectValue placeholder="Select a role" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="admin">Admin</SelectItem>
				<SelectItem value="editor">Editor</SelectItem>
				<SelectItem value="viewer">Viewer</SelectItem>
			</SelectContent>
		</Select>
	</div>
);
