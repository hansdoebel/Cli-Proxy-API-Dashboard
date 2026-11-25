# UI theme

The panel ships with two palettes. **Linear dark is the default.** Stripe light and Stripe dark stay in the theme menu as an alternate. Both are readings of public surfaces, not copies of private token files.

The theme menu (header) offers Linear Dark, Linear Light, Stripe Light, Stripe Dark, and Follow system. Follow system uses the Linear palette and the OS color scheme. A saved `auto`, `dark`, or unknown value from older builds migrates to Linear Dark; `light` and `white` migrate to Linear Light.

## Linear

Linear’s product UI is dark-first. The values below are public measurements and community restatements of [linear.app](https://linear.app), not Linear’s private token source.

| Source | What it contributes |
| --- | --- |
| [Faundr design reference](https://faundr.dev/resources/design-md/linear/DESIGN.md), measured from linear.app on 2026-10-28 | Night `#08090A`, graphite `#0F1011`, raised `#161718`, snow `#F7F8F8`, steel `#8A8F98`, dim `#62666D`, hairline `#23252A`, indigo `#5E6AD2`, status green `#27A644`, red `#EB5757`, yellow `#F0BF00` |
| [Cuelark Linear theme](https://ui.cuelark.com/themes/linear) | Same dark canvas and indigo, plus a light variant (`#F9F8F9` / `#FFFFFF` / `#282A30` / `#E9E8EA`) and focus indigo `#7170FF` |
| [BRAND-Atoms Linear](https://www.brand-atoms.com/brands/linear/) | Mercury white `#F4F5F8`, indigo hover `#7A87F0`, product success `#4CB782` |
| [designsystems.one Linear](https://www.designsystems.one/design-systems/linear) | Accent `#5E6AD2`, success `#4CB782`, error `#EB5757` |

The app uses indigo for primary actions (the in-product accent), not the light-gray marketing “Sign up” pill. Success uses the product green `#4CB782` rather than the darker marketing green. Warning marks use `#F0BF00`; warning text uses `#9A7200` on light surfaces so it stays readable.

### Linear dark (default)

| Token | Hex | Role |
| --- | --- | --- |
| `--background` | `#08090A` | Page canvas |
| `--card` | `#0F1011` | Sidebar, cards, inputs |
| `--popover` | `#161718` | Menus and dialogs |
| `--foreground` | `#F7F8F8` | Primary text |
| `--text-secondary` | `#A1A7B0` | Secondary text (above 4.5:1 on the canvas and on cards) |
| `--text-tertiary` | `#8E949E` | Meta text and placeholders. Body text on `#08090A` and `#0F1011` stays above 4.5:1. `#62666D` was about 3.3:1 and is not used for text. |
| `--border` | `#3C3F46` | Hairlines (stronger than the marketing 5% white so inputs stay identifiable) |
| `--input` | `#6B6E76` | Input borders, about 3:1 against cards |
| `--primary` | `#5E6AD2` | Indigo actions and active nav |
| `--primary-hover` | `#4F5BC4` | Primary hover (darkened so white label text stays above 4.5:1) |
| `--primary-active` | `#4450B8` | Primary pressed |
| `--ring` | `#7170FF` | Focus ring |
| `--success` | `#4CB782` | Success |
| `--warning` / `--amber-color` | `#F0BF00` | Warning marks |
| `--destructive` | `#EB5757` | Danger |
| `--danger-hover` | `#D94848` | Danger hover |

White on `#5E6AD2` is about 4.7:1. The hover and pressed indigos are darker, so the label stays at least that strong.

### Linear light

| Token | Hex | Role |
| --- | --- | --- |
| `--background` | `#F4F5F8` | Page canvas |
| `--card` | `#FFFFFF` | Surfaces |
| `--foreground` | `#282A30` | Primary text |
| `--text-secondary` | `#6F6E77` | Secondary text |
| `--border` | `#E9E8EA` | Hairlines |
| `--primary` | `#5E6AD2` | Indigo actions |
| `--success` | `#1F8A4D` | Success text and marks on white |
| `--warning` | `#9A7200` | Warning text |
| `--destructive` | `#EB5757` | Danger |

## Stripe

Kept as a selectable backup. See the previous notes: [stripe.com brand colors](https://stripe.com) captured by [UIColours on 15 January 2025](https://uicolours.com/sites/stripe), the [Reseed extraction](https://www.reseedapp.com/demo/stripe) for the `#533AFD` hover, and [designsystems.one](https://www.designsystems.one/design-systems/stripe-design) for success `#24B47E`. Danger is the published Elements red `#DF1B41`. Stripe dark is a navy adaptation; Sail does not publish dashboard-dark hex values.

### Stripe light

| Token | Hex | Role |
| --- | --- | --- |
| `--background` | `#F6F9FC` | Page canvas |
| `--card` | `#FFFFFF` | Surfaces |
| `--foreground` | `#0A2540` | Primary text |
| `--text-secondary` | `#425466` | Secondary text |
| `--border` | `#E3E8EE` | Hairlines |
| `--primary` | `#635BFF` | Blurple |
| `--primary-hover` | `#533AFD` | Primary hover |
| `--success` | `#24B47E` | Success |
| `--warning` | `#B54708` | Warning text |
| `--destructive` | `#DF1B41` | Danger |
| `--danger-hover` | `#C41636` | Danger hover |

### Stripe dark

| Token | Hex | Role |
| --- | --- | --- |
| `--background` | `#0A1628` | Page canvas |
| `--card` | `#10213A` | Surfaces |
| `--foreground` | `#F6F9FC` | Primary text |
| `--text-secondary` | `#ADBDCC` | Secondary text |
| `--border` | `#24395A` | Hairlines |
| `--primary` | `#7A73FF` | Blurple lifted for navy |
| `--primary-hover` | `#918BFF` | Primary hover, still under white-text contrast |
| `--success` | `#3ECF8E` | Success |
| `--warning` | `#FFC14D` | Warning |
| `--destructive` | `#FF4D6A` | Danger |
| `--danger-hover` | `#FF6B84` | Danger hover |

## Buttons and accents

Linear’s product chrome is grayscale. Indigo (`#5E6AD2`, focus `#7170FF`) is reserved for focus rings, text links, checkboxes, and switches. Filled buttons are neutral: a light pill on dark canvases (`#E6E6E8` on `#08090A`) and a dark pill on light canvases. Secondary and ghost buttons are a hairline border or a transparent control with a gray hover fill. Destructive actions are red text with a faint red border, not a solid red slab. The selected sidebar item is `#232326` with primary text, not an indigo wash.

Stripe uses the same structure. Its accent (`#635BFF` / `#7A73FF`) is only the focus ring, links, and small controls. Primary buttons are navy on Stripe light and a light pill on Stripe dark.

| Token | Use |
| --- | --- |
| `--button-bg` / `--button-fg` | Primary button |
| `--button-hover` / `--button-active` | Primary hover and press |
| `--button-secondary-*` | Secondary and outline |
| `--button-ghost-fg` / `--button-ghost-hover` | Ghost and icon buttons |
| `--button-danger-*` | Destructive |
| `--ring` / `--primary` | Focus, links, checkbox, switch |
| `--bg-hover` | Selected nav item and selected rows |

Disabled controls drop to 45% opacity and do not take a hover fill. Focus is a 2px `--ring` outside a 2px background gap.

## Type

The UI uses the system font, in this order: `-apple-system`, `BlinkMacSystemFont`, `SF Pro Text`, `SF Pro Display`, `Inter`, `Segoe UI`, `Roboto`, then the generic sans-serif. No webfont is bundled, so the single-file build does not grow. Headings use a tracking of `-0.022em` and a line-height of `1.15`. Body text is 16px with a line-height of `1.5`.

Labels are sentence case in that sans font. `font-variant-numeric: tabular-nums` is used for counts. Monospace stays on log lines, the YAML editor, and raw keys or IDs.

## Layout rules

Every authenticated page sits in the same frame: a 24px page gutter (16px below 768px), content capped at 1200px and centered, and 24px between sections. `PageContainer` and `PageHeader` in `src/components/layout/PageContainer.tsx` are that frame.

| Token | Desktop | Narrow | Use |
| --- | --- | --- | --- |
| `--space-page` | 24px | 16px | Page gutter |
| `--space-section` | 24px | 16px | Space between sections |
| `--card-gap` | 16px | 12px | Gap between cards in a grid |
| `--card-padding` | 20px | 16px | Card padding |
| `--card-padding-nested` | 16px | 16px | A card inside a card, sheet, or dialog |
| `--card-radius` | 12px | 12px | Cards. Controls stay near 6–8px. Pills are only for status. |

Type: nothing under 13px. Page titles are 24px, card titles 16px, body and dense UI 14–16px, meta labels 13px. Secondary text stays at or above 4.5:1 on the canvas and on cards.

Buttons use the shadcn `Button` variants only. Primary is an indigo fill with white text. Secondary and outline share one bordered style. Ghost is for icon buttons at 36px. Destructive is a red border and red text, not a filled red pill. Do not add a one-off button color beside these.

Dark mode cards are border only. `--shadow` is `none` on Linear dark and Stripe dark. Shadows stay on popovers, menus, and dialogs (`--shadow-lg`, `--floating-shadow`). No glows on logos, partner cards, or selected pills.

## Where the tokens live

- `src/styles/themes.scss` — `:root` is Linear dark. `[data-palette='linear'][data-theme='light']` is Linear light. `[data-palette='stripe']` selects the Stripe light or dark block.
- `src/styles/tailwind.css` maps the same variables into Tailwind for shadcn.
- `html` starts as `data-palette="linear" data-theme="dark"` so the first paint matches the default.
