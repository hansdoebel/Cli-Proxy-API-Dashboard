# UI theme

The management panel uses a Stripe-inspired palette on shadcn/ui tokens. Stripe’s internal Sail system is private, so these values come from public brand surfaces, published captures of stripe.com, and Stripe’s own dashboard dark appearance adapted for contrast. They are not a copy of private token files.

## Sources

| Source | What it contributes |
| --- | --- |
| [stripe.com brand colors](https://stripe.com), captured by [UIColours on 15 January 2025](https://uicolours.com/sites/stripe) | Blurple `#635BFF`, navy `#0A2540`, slate `#425466`, cloud `#F6F9FC`, white `#FFFFFF`, hairline `#E3E8EE` |
| [stripe.com design extraction (Reseed)](https://www.reseedapp.com/demo/stripe) | CTA blurple `#533AFD` used as the primary hover, border `#E6ECF2` (we keep the more common dashboard hairline `#E3E8EE`) |
| [Stripe design notes (designsystems.one)](https://www.designsystems.one/design-systems/stripe-design) | Success `#24B47E`, plus the same navy / cloud / blurple roles. Marked there as an unofficial reading of public surfaces |
| Stripe.js / Elements error red, widely published as `#DF1B41` | Danger. An older public citation uses `#CD3D64`; the panel uses `#DF1B41` |
| dashboard.stripe.com appearance | Light dashboard is white cards on the cloud canvas with navy text and blurple actions. Dark mode exists in the dashboard appearance menu. Sail does not publish those dark hex values, so the dark theme below is a navy adaptation of the same roles (community restatements such as the [Cuelark Stripe theme](https://ui.cuelark.com/themes/stripe) describe the same direction: deep navy, not neutral gray, with blurple lifted for contrast) |

Warning amber is not a single published Stripe dashboard token. `#F5A623` is the amber used for status marks; `#B54708` is the text color chosen so warning copy stays readable on white. It is separate from danger on purpose.

Söhne is Stripe’s commercial product face. This panel does not bundle it. The font stack names Söhne when a machine has it, then `ui-sans-serif` / system UI, so the single-file build does not request a remote font.

## Light

Default (`:root`, theme “Light”, and system light). Theme “Pure White” uses the same ink and blurple with a `#FFFFFF` page background.

| Token | Hex | Role |
| --- | --- | --- |
| `--background` | `#F6F9FC` | Page canvas |
| `--card` | `#FFFFFF` | Sidebar, cards, dialogs, inputs |
| `--foreground` | `#0A2540` | Headings and primary text |
| `--muted-foreground` | `#425466` | Secondary text |
| `--text-tertiary` | `#6B7C93` | Meta text |
| `--text-quaternary` | `#8898AA` | Placeholders and quiet marks |
| `--border` | `#E3E8EE` | Hairlines |
| `--input` | `#D5DBE4` | Input borders |
| `--primary` | `#635BFF` | Blurple actions, active nav, focus ring |
| `--primary-hover` | `#533AFD` | Primary hover |
| `--primary-foreground` | `#FFFFFF` | Text on blurple |
| `--muted` / `--accent` | `#EEF2F7` / `#E6EBF1` | Wells and hover fills |
| `--success` | `#24B47E` | Success, live traffic |
| `--warning` | `#B54708` | Warning text |
| `--amber-color` | `#F5A623` | Warning marks |
| `--destructive` | `#DF1B41` | Danger and failed requests |

Shadows use Stripe’s cool navy tint: `rgb(50 50 93 / …)` rather than pure black.

## Dark

Applied with `data-theme="dark"` (and the `dark` class for Tailwind).

| Token | Hex | Role |
| --- | --- | --- |
| `--background` | `#0A1628` | Page canvas |
| `--card` | `#10213A` | Surfaces |
| `--popover` | `#142847` | Menus and dialogs |
| `--foreground` | `#F6F9FC` | Primary text |
| `--muted-foreground` | `#ADBDCC` | Secondary text |
| `--border` | `#24395A` | Hairlines |
| `--primary` | `#7A73FF` | Blurple lifted for navy backgrounds |
| `--success` | `#3ECF8E` | Success |
| `--warning` / `--amber-color` | `#FFC14D` | Warning |
| `--destructive` | `#FF4D6A` | Danger |

## Where the tokens live

- `src/styles/themes.scss` defines the shadcn variables and the legacy names (`--bg-*`, `--text-*`, `--primary-color`) as aliases, so existing SCSS modules pick up the palette.
- `src/styles/tailwind.css` maps those variables into Tailwind color utilities for `src/components/ui/shadcn/`.
- Tailwind is loaded without Preflight. Feature SCSS modules stay the styling for existing pages.
