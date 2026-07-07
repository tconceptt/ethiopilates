# Design

Visual system for the Ethio Pilates Studio site. Derived from the studio's physical materials: cream plaster walls, brass wall lettering, oxblood lockers, olive accent walls, warm oak joinery, black reformer machines.

## Color

Defined in `app/globals.css` under `@theme inline` (Tailwind v4 tokens).

| Token | Value | Role |
|---|---|---|
| `--color-background` | `#F7F3EC` | Body background (matches studio plaster walls) |
| `--color-surface` | `#FFFFFF` | Cards, raised surfaces |
| `--color-foreground` | `#292420` | Ink — espresso brown-black |
| `--color-primary` | `#8C7A6B` | Taupe — legacy brand neutral, borders/soft UI |
| `--color-primary-dark` | `#4A3F35` | Deep taupe — headings on light |
| `--color-brass` | `#9A7B3F` | Brass/gold — the studio's wall-lettering metal; accents, small type, rules |
| `--color-oxblood` | `#7A3B2E` | Oxblood — the locker lacquer; committed section backgrounds, emphasis |
| `--color-olive` | `#6C6842` | Olive — the sauna/vanity walls; secondary accents |
| `--color-secondary` | `#E4DCCD` | Sand — tinted panels, dividers |

Strategy: **full palette, used sparingly** — cream base carries calm; brass for small moments of shine; oxblood for one or two committed dark sections; olive for supporting notes. Never all four accents in one component.

Contrast rules: body text is `#292420` or `stone-700`+ on cream/white; on oxblood use `#F3E4DC`-range tints, never gray.

## Typography

- **Display/serif**: Cormorant Garamond (`--font-serif`) — matches the studio's printed brand posters. Weights 300–700, generous size contrast, italic used for the "second voice" in headings.
- **Body/UI**: Lato (`--font-sans`) 300/400/700. Small caps + letterspacing reserved for buttons and tiny labels only — not as an eyebrow over every section.
- Headings use `text-wrap: balance`; hero clamps ≤ 6rem; letter-spacing ≥ -0.02em.

## Imagery

Real studio photography in `public/studio/` (semantic names: `class-reformer.jpg`, `sauna.jpg`, `locker-lounge.jpg`, …). Full-bleed hero, editorial crops elsewhere. Photos are warm-lit; avoid heavy tint overlays — a soft espresso gradient scrim for text legibility only. Alt text describes the actual space ("Brass 'Who run the world — girls' lettering above the reformer hall"), not generic labels.

## Motion

Framer Motion. Slow, confident, ease-out (`[0.16, 1, 0.3, 1]`), 0.7–1s durations. Content is visible by default; motion enhances (whileInView with small offsets). Every animation respects `prefers-reduced-motion` (via `useReducedMotion` or CSS).

## Components & Layout

- Buttons: rectangular (rounded-sm), uppercase tracked labels, brass or espresso fill.
- Sections alternate cream / white / one oxblood dark passage; padding `py-20 md:py-28`.
- Pricing: serif numerals, thin rules, no card-grid monotony.
- Radii: images may use large organic radii (arch shape echoes the studio's arched niches); cards stay ≤16px.
