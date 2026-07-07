"use client";

import { Bell, Mail, Settings } from "lucide-react";
import { PaletteToggle } from "@/components/palette-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Avatar,
	AvatarFallback,
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Checkbox,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
				{title}
			</h2>
			<div className="flex flex-wrap items-start gap-4">{children}</div>
		</section>
	);
}

export default function DesignSystemPage() {
	return (
		<TooltipProvider>
			<div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
				<header className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-semibold tracking-tight">Design System</h1>
						<p className="text-muted-foreground">Modern Neutral — tokens & components</p>
					</div>
					<div className="flex items-center gap-2">
						<PaletteToggle />
						<ThemeToggle />
					</div>
				</header>

				<Section title="Buttons">
					<Button>Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="link">Link</Button>
					<Button size="sm">Small</Button>
					<Button size="lg">Large</Button>
					<Button size="icon" aria-label="Settings">
						<Settings />
					</Button>
					<Button disabled>Disabled</Button>
				</Section>

				<Section title="Badges">
					<Badge>Default</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="success">Success</Badge>
					<Badge variant="warning">Warning</Badge>
					<Badge variant="destructive">Destructive</Badge>
					<Badge variant="outline">Outline</Badge>
				</Section>

				<Section title="Form controls">
					<div className="flex w-full max-w-sm flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="you@example.com" />
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="bio">Bio</Label>
							<Textarea id="bio" placeholder="Tell us about yourself" />
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="role">Role</Label>
							<Select>
								<SelectTrigger id="role">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="editor">Editor</SelectItem>
									<SelectItem value="viewer">Viewer</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox id="terms" defaultChecked />
							<Label htmlFor="terms">Accept terms and conditions</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch id="notifications" defaultChecked />
							<Label htmlFor="notifications">Enable notifications</Label>
						</div>
					</div>
				</Section>

				<Section title="Card">
					<Card className="w-full max-w-sm">
						<CardHeader>
							<CardTitle>Upgrade your plan</CardTitle>
							<CardDescription>Unlock advanced features and higher limits.</CardDescription>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							You are currently on the free plan. Upgrade any time.
						</CardContent>
						<CardFooter className="gap-2">
							<Button>Upgrade</Button>
							<Button variant="outline">Learn more</Button>
						</CardFooter>
					</Card>
				</Section>

				<Section title="Alerts">
					<div className="flex w-full flex-col gap-3">
						<Alert>
							<Bell />
							<AlertTitle>Heads up</AlertTitle>
							<AlertDescription>This is a default informational alert.</AlertDescription>
						</Alert>
						<Alert variant="success">
							<Bell />
							<AlertTitle>Saved</AlertTitle>
							<AlertDescription>Your changes were saved successfully.</AlertDescription>
						</Alert>
						<Alert variant="destructive">
							<Bell />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>Something went wrong. Please try again.</AlertDescription>
						</Alert>
					</div>
				</Section>

				<Section title="Avatar, Tooltip & Dialog">
					<Avatar>
						<AvatarFallback>AK</AvatarFallback>
					</Avatar>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline" size="icon" aria-label="Mail">
								<Mail />
							</Button>
						</TooltipTrigger>
						<TooltipContent>You have new mail</TooltipContent>
					</Tooltip>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">Open dialog</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Are you sure?</DialogTitle>
								<DialogDescription>
									This action cannot be undone. This will permanently delete your data.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<DialogClose asChild>
									<Button variant="destructive">Delete</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</Section>

				<Section title="Tabs">
					<Tabs defaultValue="account" className="w-full max-w-md">
						<TabsList>
							<TabsTrigger value="account">Account</TabsTrigger>
							<TabsTrigger value="password">Password</TabsTrigger>
						</TabsList>
						<TabsContent value="account" className="text-sm text-muted-foreground">
							Make changes to your account here.
						</TabsContent>
						<TabsContent value="password" className="text-sm text-muted-foreground">
							Change your password here.
						</TabsContent>
					</Tabs>
				</Section>

				<Section title="Table">
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
								<TableCell>Ada Lovelace</TableCell>
								<TableCell>Admin</TableCell>
								<TableCell>
									<Badge variant="success">Active</Badge>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Alan Turing</TableCell>
								<TableCell>Editor</TableCell>
								<TableCell>
									<Badge variant="secondary">Invited</Badge>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Section>
			</div>
		</TooltipProvider>
	);
}
