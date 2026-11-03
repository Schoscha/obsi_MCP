---
name: Tectonic Precision
colors:
  surface: '#080d0f'
  surface-dim: '#080d0f'
  surface-bright: '#1b353c'
  surface-container-lowest: '#05090b'
  surface-container-low: '#0b1417'
  surface-container: '#0e1b1e'
  surface-container-high: '#112226'
  surface-container-highest: '#162c32'
  on-surface: '#e6f1f3'
  on-surface-variant: '#99f6e4'
  inverse-surface: '#e6f1f3'
  inverse-on-surface: '#0f2024'
  outline: '#5e8c85'
  outline-variant: '#1f4248'
  surface-tint: '#5ef6c4'
  primary: '#5ef6c4'
  on-primary: '#042f2e'
  primary-container: '#10b981'
  on-primary-container: '#022c22'
  inverse-primary: '#059669'
  secondary: '#8cb4ae'
  on-secondary: '#0f2024'
  secondary-container: '#1c373e'
  on-secondary-container: '#7e9ea5'
  tertiary: '#22d3ee'
  on-tertiary: '#003549'
  tertiary-container: '#0891b2'
  on-tertiary-container: '#002d40'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a7f3d0'
  primary-fixed-dim: '#5ef6c4'
  on-primary-fixed: '#022c22'
  on-primary-fixed-variant: '#065f46'
  secondary-fixed: '#d5ece8'
  secondary-fixed-dim: '#8cb4ae'
  on-secondary-fixed: '#081214'
  on-secondary-fixed-variant: '#1c373e'
  tertiary-fixed: '#a5f3fc'
  tertiary-fixed-dim: '#22d3ee'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#080d0f'
  on-background: '#e6f1f3'
  surface-variant: '#162c32'
  canvas-paper: '#041310'
  blueprint-amber: '#34d399'
  structural-border: '#173037'
  drafting-grid: '#13252a'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  title-md:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  title-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.08em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system is engineered for developers, systems architects, and technical product teams who design complex infrastructure. It merges the deliberate discipline of architectural drafting with modern technical minimalism. The aesthetic avoids decorative superficiality, favoring structural clarity, high-density utility, and purposeful layout engineering.

The emotional tone balances institutional rigor with refined craftsmanship: reliable, precise, tactile, and mathematically grounded. Visual metaphors evoke blueprint paper, engineering schematics, and clean IDE environments. The system pairs sharp grid alignments with warm tactile neutrals and an intentional industrial signal color to guide cognitive focus through complex workflows.

## Colors

The core color palette derives from engineering schematics, raw tactile paper, and hardware drafting surfaces.

- **Primary (`#34d399`):** Industrial Vermillion. Used strictly for active states, key interactive targets, operational alerts, and focal callouts. It serves as an authoritative signal across predominantly monochromatic layouts.
- **Secondary (`#D8D4C7`):** Architectural Bone. Provides high-clarity contrast for primary typography and foreground structural elements in dark mode, reflecting the tone of heavy uncoated drafting vellum.
- **Neutral (`#18160F`):** Deep Obsidian. Serves as the primary canvas base, evoking dark technical workbenches, IDE consoles, and matte graphite surfaces.
- **Named Accents:**
  - `canvas-paper` (`#041310`): Inverted mode surfaces or print-grade export previews.
  - `structural-border` (`#173037`): Delivers low-contrast structural dividers between pane zones and terminal modules.
  - `drafting-grid` (`#13252a`): Reserved for subtle schematic grid lines and coordinate markers.

## Typography

The typographic hierarchy combines **Space Grotesk** for structured, forward-facing display headers with **JetBrains Mono** for all operational copy, metadata, data visualization markers, and body layers.

- **Display & Section Headers:** Space Grotesk provides a geometric, engineered presence. Headlines are tightly tracked and compact.
- **System Body & Metadata:** JetBrains Mono serves as the default workhorse font. Its code ligatures, proportional glyph balance, and monospaced rhythm elevate code snippets, architectural node names, and standard descriptions alike.
- **Labels & Micro-data:** Micro-labels utilize uppercase monospaced text with widened letter-spacing (`0.04em` to `0.08em`) to mirror technical drafting notations, coordinate systems, and CLI flags.

## Layout & Spacing

The layout adopts a rigid, coordinate-driven fluid grid system anchored by a baseline 8px (0.5rem) increment. Layouts emphasize visible structural boundaries, dockable columns, and balanced modular panes.

- **Grid Architecture:** 
  - Mobile (under 768px): 4-column layout with 16px (`1rem`) gutters and 16px margins.
  - Tablet (768px - 1024px): 8-column layout with 16px gutters and 24px margins.
  - Desktop (1024px+): 12-column layout with 24px (`1.5rem`) gutters and 40px (`2.5rem`) outer margins.
- **Modular Panes:** Interfaces often adopt multi-pane developer workflows (sidebar tree, central canvas/drafting plane, inspector panel). Dividers are explicitly 1px continuous borders adhering to `structural-border`.
- **Rhythm & Padding:** Component interiors rely on compact vertical rhythm (`space-xs` to `space-sm`) and generous horizontal breathing room (`space-md`) to optimize data readability and compact toolbelt interactions.

## Elevation & Depth

Visual hierarchy rejects organic drop shadows and heavy blur layers. Depth is established through **architectural stratification** and **crisp planar boundaries**:

1. **Surface Stratification:**
   - **Base Plane (Z0):** `#18160F` (primary window/canvas).
   - **Docked Panes (Z1):** `#1D1A13` with a 1px border (`#173037`).
   - **Active Floating Panels / Context Menus (Z2):** `#232018` with a 1px border (`#3D382C`) and a faint, directional contact shadow: `0 4px 16px rgba(0, 0, 0, 0.45)`.
2. **Ghost Borders & Grid Registration:** Panels interlock with 1px border intersections, mimicking schematic drafting modules rather than disconnected floating elements.
3. **Accent Glows:** High-priority or focused terminal cursors and active node anchors utilize a subtle 1px highlight or focused outline (`#34d399`) rather than soft ambient halos.

## Shapes

The design system enforces a precise, calibrated shape language with `roundedness: 1` (Soft: 0.25rem / 4px base). 

- **Containers & Panes:** Rigid 0px to 4px corners, reinforcing modular docking without soft bulbous edges.
- **Interactive Controls (Buttons, Inputs, Selectors):** Standardized 4px (`0.25rem`) corner radius.
- **Badges, Status Tags, and Nodes:** Precise 4px (`0.25rem`) radius. Pill shapes (`rounded-full`) are strictly prohibited to retain the engineered drafting aesthetic.

## Components

### Buttons
- **Primary:** Background in `#34d399`, label in `#041310`, 4px radius. Monospaced typography with medium weight. Hover shifts to `#F05C3E`; active state scales subtly (`0.98`) with a hard inner tint.
- **Secondary / Outlined:** Transparent background, 1px border in `#3D382C`, label in `#D8D4C7`. Hover fills with `#232018` and updates border color to `#D8D4C7`.
- **Ghost / Icon:** Transparent canvas, color `#D8D4C7`. Hover brings background to `#232018`.

### Inputs & Selectors
- **Text Fields:** Dark background `#1D1A13`, 1px border `#173037`, font in JetBrains Mono. Focus state triggers a 1px border in `#34d399` without fuzzy rings.
- **Prefix / Suffix Elements:** Enclosed in monospaced bracket styling (e.g., `[CMD]`, `http://`, or `$`), styled in `#8C877A`.

### Chips & Badges
- **Status Tags:** Background `#232018`, border 1px `#173037`, text `#D8D4C7`. Font size `label-sm`.
- **Active / Alert Indicators:** A 6px solid square or inline dot in `#34d399` preceded by uppercase technical labels (e.g., `LIVE`, `SYNCING`, `READY`).

### Cards & Modular Tiles
- **Structure:** Surface `#1D1A13` bounded by `#173037` 1px borders. No soft shadows.
- **Header:** Card headers include a 1px bottom divider, monospace uppercase section titles, and technical metadata or status icons anchored to the right.
- **Hover:** Subtle border illumination transitioning from `#173037` to `#3D382C`.

### Lists & Tree Views
- **Architecture Navigation:** Monospaced tree lines with subtle indentation guides (`border-l` 1px `#173037`).
- **Interactive Rows:** 32px height, active state marked with a left-aligned 2px `#34d399` border and `#232018` row tint.

### Checkboxes & Radio Controls
- **Checkboxes:** 16x16px square, 2px corner radius, 1px border `#3D382C`. Checked state fills `#34d399` with a clean geometric tick in `#18160F`.
- **Radio Buttons:** 16x16px octagonal or square-inside-square profile to retain an industrial CAD interface appearance.