import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "typescript-template";

export const Default = () => (
	<TooltipProvider>
		<Tooltip defaultOpen>
			<TooltipTrigger asChild>
				<Button variant="outline">Hover me</Button>
			</TooltipTrigger>
			<TooltipContent>Add to your library</TooltipContent>
		</Tooltip>
	</TooltipProvider>
);
