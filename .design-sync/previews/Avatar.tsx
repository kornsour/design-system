import { Avatar, AvatarFallback } from "@kornorg/design-system";

const row: React.CSSProperties = { display: "flex", gap: 8, alignItems: "center" };

export const Fallback = () => (
	<Avatar>
		<AvatarFallback>AK</AvatarFallback>
	</Avatar>
);

export const Group = () => (
	<div style={row}>
		<Avatar>
			<AvatarFallback>AL</AvatarFallback>
		</Avatar>
		<Avatar>
			<AvatarFallback>AT</AvatarFallback>
		</Avatar>
		<Avatar>
			<AvatarFallback>GH</AvatarFallback>
		</Avatar>
	</div>
);
