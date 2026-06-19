import { Alert, AlertDescription, AlertTitle } from "typescript-template";

const Info = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="12" r="10" />
		<path d="M12 16v-4M12 8h.01" />
	</svg>
);

const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 };

export const Default = () => (
	<Alert>
		<Info />
		<AlertTitle>Heads up</AlertTitle>
		<AlertDescription>
			You can add components to your app using the CLI. Run the install command and import from the
			package.
		</AlertDescription>
	</Alert>
);

export const Statuses = () => (
	<div style={col}>
		<Alert variant="success">
			<Info />
			<AlertTitle>Changes saved</AlertTitle>
			<AlertDescription>Your profile has been updated successfully.</AlertDescription>
		</Alert>
		<Alert variant="warning">
			<Info />
			<AlertTitle>Approaching limit</AlertTitle>
			<AlertDescription>You have used 90% of your monthly quota.</AlertDescription>
		</Alert>
		<Alert variant="destructive">
			<Info />
			<AlertTitle>Unable to process payment</AlertTitle>
			<AlertDescription>Your card was declined. Please update your billing details.</AlertDescription>
		</Alert>
	</div>
);
