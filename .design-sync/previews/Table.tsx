import {
	Badge,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@kornorg/design-system";

export const Default = () => (
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Name</TableHead>
				<TableHead>Role</TableHead>
				<TableHead>Status</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			<TableRow>
				<TableCell style={{ fontWeight: 500 }}>Ada Lovelace</TableCell>
				<TableCell>Admin</TableCell>
				<TableCell>
					<Badge variant="success">Active</Badge>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ fontWeight: 500 }}>Alan Turing</TableCell>
				<TableCell>Editor</TableCell>
				<TableCell>
					<Badge variant="secondary">Invited</Badge>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ fontWeight: 500 }}>Grace Hopper</TableCell>
				<TableCell>Viewer</TableCell>
				<TableCell>
					<Badge variant="outline">Suspended</Badge>
				</TableCell>
			</TableRow>
		</TableBody>
	</Table>
);
