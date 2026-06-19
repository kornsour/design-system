import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "design-system";

export const Confirmation = () => (
	<Dialog defaultOpen>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Delete project</DialogTitle>
				<DialogDescription>
					This will permanently delete the project and all of its data. This action cannot be
					undone.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">Cancel</Button>
				</DialogClose>
				<DialogClose asChild>
					<Button variant="destructive">Delete project</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
