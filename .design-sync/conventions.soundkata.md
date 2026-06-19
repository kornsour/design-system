# soundkata — design system conventions

A React + Tailwind CSS v4 component library for **soundkata**, an electronic-
music-production learning platform. The feel is **studio / dark-first**: deep
blue-black surfaces, an electric azure accent, vivid teal for success, tight 6px
radius — designed to look at home next to a DAW while staying readable for
lessons. Same components and class vocabulary as the base system; only the tokens
differ.

## Setup & wrapping

- **Dark-first**: this theme is designed to render on `class="dark"` (deep studio
  background). It also has a clean cool-light variant; toggle by adding/removing
  `dark` on a root element. Tokens are dark-aware — never write `dark:` variants
  for the semantic colors.
- **No global provider is required** for styling — the look comes from the shipped
  `styles.css` (Tailwind utilities + token variables). Just render the components.
- **`Tooltip` requires a `TooltipProvider`** above it. `Dialog`, `Select`, `Tabs`,
  `Checkbox`/`Switch` need no provider.
- Every component accepts a `className` prop that merges with its own classes.

## Styling idiom — semantic token utilities

Styled with **Tailwind utility classes bound to semantic design tokens**, never raw
palette colors. Prefer `bg-primary` over `bg-blue-500` — semantic classes adapt to
light/dark and carry the soundkata feel. Full vocabulary in `styles.css` (each also
`hover:` / `focus-visible:`):

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

Radius (tight): `rounded-sm` · `rounded-md` · `rounded-lg` (6px) · `rounded-xl` ·
`rounded-full`. Elevation: `shadow-xs/sm/md/lg`. Standard Tailwind layout/spacing
utilities work as usual. For values not expressible as a utility, read tokens
directly: `var(--primary)`, `var(--muted-foreground)`, `var(--border)`, `var(--radius)`.

## Where the truth lives

- `styles.css` (and the `_ds_bundle.css` it imports) — token definitions + utilities.
- `components/general/<Name>/<Name>.prompt.md` — per-component usage and props.
- `components/general/<Name>/<Name>.d.ts` — the exact prop contract.

## Compound components

Importable sub-parts: `Card` → `CardHeader`/`CardTitle`/`CardDescription`/
`CardContent`/`CardFooter`; `Dialog` → `DialogTrigger`/`DialogContent`/`DialogHeader`/
`DialogTitle`/`DialogDescription`/`DialogFooter`/`DialogClose`; `Select` →
`SelectTrigger`/`SelectValue`/`SelectContent`/`SelectItem`; `Tabs` → `TabsList`/
`TabsTrigger`/`TabsContent`; `Tooltip` → `TooltipTrigger`/`TooltipContent`; `Alert`
→ `AlertTitle`/`AlertDescription`; `Avatar` → `AvatarImage`/`AvatarFallback`;
`Table` → `TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell`.

## Example

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from "@kornorg/design-system";
import "@kornorg/design-system/themes/soundkata.css";

function LessonCard() {
	return (
		<Card className="max-w-sm">
			<CardHeader>
				<CardTitle>Sidechain compression</CardTitle>
				<CardDescription>Module 3 · 12 min</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
				<Badge variant="success">Completed</Badge>
				Next: ducking the bass
			</CardContent>
		</Card>
	);
}
```
