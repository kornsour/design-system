# Spartan — design system conventions

A React + Tailwind CSS v4 component library. Neutral zinc surfaces, a Michigan
State green brand accent (anchored on the official #18453B), an 8px base radius,
and soft shadows, with full light + dark mode. Build with the real components
below; style your own layout with the token utility classes named here.

## Setup & wrapping

- **No global provider is required** for styling — the look comes from the
  shipped `styles.css` (Tailwind utilities + token variables). Just render the
  components.
- **`Tooltip` requires a `TooltipProvider`** somewhere above it (wrap the app
  root, or the section using tooltips). Without it the tooltip will not open.
  `Dialog`, `Select`, `Tabs`, and `Checkbox`/`Switch` need no provider.
- **Dark mode is class-based**: add `class="dark"` to a root element (e.g.
  `<html>`). Every token flips automatically — you do not write `dark:` variants
  for the semantic colors; they are already dark-aware.
- Every component accepts a `className` prop that merges with its own classes
  (Tailwind-aware), so you can extend any component without overriding its base.

## Styling idiom — semantic token utilities

This system is styled with **Tailwind utility classes bound to semantic design
tokens**, not raw palette colors. Always prefer the semantic class (e.g.
`bg-primary`, which is the Spartan green) over a literal color (`bg-green-700`) —
semantic classes adapt to light/dark and keep designs on-brand. The full
vocabulary shipped in `styles.css` (each also available as `hover:` /
`focus-visible:`):

| Purpose | Background | Text | Border / ring |
|---|---|---|---|
| Page | `bg-background` | `text-foreground` | — |
| Card / panel | `bg-card` | `text-card-foreground` | `border-border` |
| Brand / primary action | `bg-primary` | `text-primary-foreground` | `ring-ring` |
| Secondary / subtle fill | `bg-secondary` | `text-secondary-foreground` | — |
| Muted / hint text | `bg-muted` | `text-muted-foreground` | — |
| Hover/active surface | `bg-accent` | `text-accent-foreground` | — |
| Danger | `bg-destructive` | `text-destructive-foreground` | — |
| Success | `bg-success` | `text-success-foreground` | — |
| Warning | `bg-warning` | `text-warning-foreground` | — |
| Form field | — | — | `border-input` |

Radius: `rounded-sm` (4px) · `rounded-md` (6px) · `rounded-lg` (8px) ·
`rounded-xl` (12px) · `rounded-full`. Elevation: `shadow-xs` · `shadow-sm` ·
`shadow-md` · `shadow-lg`. Standard Tailwind layout/spacing utilities (`flex`,
`grid`, `gap-*`, `p-*`, `text-sm`, `font-medium`, …) work as usual.

For values you can't express as a utility, read the tokens directly as CSS
variables: `var(--primary)`, `var(--muted-foreground)`, `var(--border)`,
`var(--radius)`, etc.

## Where the truth lives

- `styles.css` (and the `_ds_bundle.css` it imports) — the complete token
  definitions and utility classes. Read it before inventing styles.
- `components/general/<Name>/<Name>.prompt.md` — per-component usage and props.
- `components/general/<Name>/<Name>.d.ts` — the exact prop contract.

## Compound components

Several components are composed from sub-parts (all importable from the package):
`Card` → `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` /
`CardFooter`; `Dialog` → `DialogTrigger` / `DialogContent` / `DialogHeader` /
`DialogTitle` / `DialogDescription` / `DialogFooter` / `DialogClose`; `Select` →
`SelectTrigger` / `SelectValue` / `SelectContent` / `SelectItem`; `Tabs` →
`TabsList` / `TabsTrigger` / `TabsContent`; `Tooltip` → `TooltipTrigger` /
`TooltipContent`; `Alert` → `AlertTitle` / `AlertDescription`; `Avatar` →
`AvatarImage` / `AvatarFallback`; `Table` → `TableHeader` / `TableBody` /
`TableRow` / `TableHead` / `TableCell`.

## Example

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from "@kornorg/design-system";

function PlanCard() {
	return (
		<Card className="max-w-sm">
			<CardHeader>
				<CardTitle>Pro plan</CardTitle>
				<CardDescription>Everything you need to scale.</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
				<Badge variant="success">Active</Badge>
				Renews June 1
			</CardContent>
			<CardFooter className="gap-2">
				<Button>Manage</Button>
				<Button variant="outline">Cancel</Button>
			</CardFooter>
		</Card>
	);
}
```
