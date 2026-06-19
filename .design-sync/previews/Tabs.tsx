import { Tabs, TabsContent, TabsList, TabsTrigger } from "typescript-template";

const body: React.CSSProperties = { fontSize: 14, color: "var(--muted-foreground)", paddingTop: 4 };

export const Default = () => (
	<div style={{ width: 420 }}>
		<Tabs defaultValue="account">
			<TabsList>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
				<TabsTrigger value="team">Team</TabsTrigger>
			</TabsList>
			<TabsContent value="account" style={body}>
				Make changes to your account here. Click save when you're done.
			</TabsContent>
			<TabsContent value="password" style={body}>
				Change your password here.
			</TabsContent>
			<TabsContent value="team" style={body}>
				Manage your team members.
			</TabsContent>
		</Tabs>
	</div>
);
