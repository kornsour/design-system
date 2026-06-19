import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@kornorg/design-system";

export const Default = () => (
	<Card style={{ maxWidth: 360 }}>
		<CardHeader>
			<CardTitle>Upgrade your plan</CardTitle>
			<CardDescription>Unlock advanced features and higher usage limits.</CardDescription>
		</CardHeader>
		<CardContent style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
			You are currently on the Free plan. Upgrade any time to access team features.
		</CardContent>
		<CardFooter style={{ gap: 8 }}>
			<Button>Upgrade</Button>
			<Button variant="outline">Learn more</Button>
		</CardFooter>
	</Card>
);

export const Simple = () => (
	<Card style={{ maxWidth: 360 }}>
		<CardHeader>
			<CardTitle>Notifications</CardTitle>
			<CardDescription>You have 3 unread messages.</CardDescription>
		</CardHeader>
	</Card>
);
