# Stratova Quant — Design System

> Version 1.0
> Lead Product Designer

---

## Table of Contents

1. [Brand Principles](#1-brand-principles)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Grid System](#4-grid-system)
5. [Spacing](#5-spacing)
6. [Button Styles](#6-button-styles)
7. [Cards](#7-cards)
8. [Borders](#8-borders)
9. [Shadows](#9-shadows)
10. [Icons](#10-icons)
11. [Charts](#11-charts)
12. [Tables](#12-tables)
13. [Forms](#13-forms)
14. [Motion](#14-motion)
15. [Accessibility](#15-accessibility)
16. [Responsive Behavior](#16-responsive-behavior)

---

## 1. Brand Principles

### 1.1 Core Identity

Stratova Quant is a quantitative investment research platform built for institutions, allocators, and serious researchers. Every design decision must reinforce the following attributes:

| Attribute | Design Implication |
|-----------|-------------------|
| **Trust** | Use established conventions. Avoid novelty for its own sake. Every element should feel deliberate and proven. |
| **Discipline** | Enforce strict consistency. No one-off styling. Every component must conform to the system. |
| **Research** | Present data with clarity and precision. Typography and layout should resemble an academic journal — not a marketing page. |
| **Long-term investing** | Avoid trends, hype patterns, or short-term visual gimmicks. The design should age gracefully over years. |
| **Institutional quality** | The bar is Bloomberg Terminal, not Robinhood. Every pixel must convey seriousness of purpose. |

### 1.2 Design Philosophy

- **Form follows function.** Every visual choice must serve clarity of information.
- **Reduce cognitive load.** Remove anything that doesn't help the user understand or act on data.
- **Precision over decoration.** Use thin borders, subtle separators, and exact spacing — not shadows, gradients, or illustrations.
- **Respect the data.** Charts and tables are the primary interface. UI chrome should recede.
- **Dark mode is default.** Financial professionals work in dark environments. Light mode is an accessibility accommodation.

### 1.3 Voice & Tone

| Context | Tone |
|---------|------|
| Dashboard UI | Neutral, informative, precise |
| Error states | Direct, actionable, no blame |
| Empty states | Informative, guiding, not promotional |
| Documentation | Technical, clear, authoritative |
| Marketing | Restrained, evidence-based, institutional |

### 1.4 Anti-Patterns (Do Not Use)

- Neon colors, gradients, or glowing effects
- Gamification elements (badges, progress bars, confetti)
- Illustrations, avatars, or decorative graphics
- Animated backgrounds or particle effects
- Rounded "pill" shapes on data elements
- Skeuomorphic textures or 3D effects
- Emoji in UI (data is not playful)
- Hamburger menus on desktop
- Auto-playing carousels or sliders
- Bright, saturated colors for primary actions

---

## 2. Color Palette

### 2.1 Philosophy

The palette is restrained, inspired by financial terminals, academic journals, and premium productivity tools. Color is used sparingly — primarily to indicate state, hierarchy, and data direction.

### 2.2 Neutral Palette (90% of all UI)

The neutral palette does the heavy lifting. It provides structure, hierarchy, and readability.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--neutral-50` | `#FAFAF8` | `#1A1A1A` | Page background |
| `--neutral-100` | `#F0EFED` | `#222222` | Card background, surface |
| `--neutral-150` | `#E8E7E4` | `#2A2A2A` | Hover state on surfaces |
| `--neutral-200` | `#DCDAD6` | `#333333` | Border, divider |
| `--neutral-300` | `#C5C3BE` | `#444444` | Disabled, muted |
| `--neutral-400` | `#A8A6A1` | `#666666` | Placeholder text |
| `--neutral-500` | `#8A8883` | `#888888` | Secondary text |
| `--neutral-600` | `#6B6A66` | `#A0A0A0` | Body text (dark mode) |
| `--neutral-700` | `#4D4C49` | `#B8B8B8` | Body text (light mode) |
| `--neutral-800` | `#333230` | `#D0D0D0` | Heading text (dark mode) |
| `--neutral-900` | `#1A1A18` | `#E8E8E8` | Heading text (light mode) |
| `--neutral-950` | `#111111` | `#FAFAF8` | Primary text |

### 2.3 Accent Palette (5% of all UI)

Used sparingly for data direction, status indicators, and the brand mark.

| Token | Color | Hex | Usage |
|-------|-------|-----|-------|
| `--accent-blue` | Blue | `#3B82F6` | Links, selected state, interactive elements |
| `--accent-indigo` | Indigo | `#4F46E5` | Brand mark, primary buttons |
| `--accent-green` | Green | `#059669` | Positive returns, up direction, success |
| `--accent-red` | Red | `#DC2626` | Negative returns, down direction, error |
| `--accent-amber` | Amber | `#D97706` | Warning, caution, neutral signal |
| `--accent-purple` | Purple | `#7C3AED` | Alternative data source indicator |

### 2.4 Semantic Tokens

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--bg-page` | `#FAFAF8` | `#1A1A1A` | Page background |
| `--bg-surface` | `#FFFFFF` | `#222222` | Card, panel, dropdown |
| `--bg-surface-hover` | `#F5F4F2` | `#2A2A2A` | Hover state on surfaces |
| `--bg-surface-active` | `#EBEAE7` | `#333333` | Active/pressed state |
| `--border-default` | `#E5E4E0` | `#333333` | Default border |
| `--border-strong` | `#D1CFCB` | `#444444` | High-emphasis border |
| `--text-primary` | `#111111` | `#FAFAF8` | Primary text |
| `--text-secondary` | `#6B6A66` | `#A0A0A0` | Secondary text |
| `--text-tertiary` | `#A8A6A1` | `#666666` | Disabled, placeholder |

### 2.5 Color Usage Rules

1. **Never use accent colors for backgrounds** — only for text, borders, and small indicators.
2. **Never use green/red outside of data context** — they are reserved for return direction.
3. **Accent colors should cover no more than 5% of any screen** — the rest is neutral.
4. **Data visualization colors are a separate palette** (see Section 11).
5. **Always check contrast ratios** — all text must meet WCAG AA minimum.

---

## 3. Typography

### 3.1 Typeface Selection

| Usage | Font | Fallback | Weight Range |
|-------|------|----------|--------------|
| UI text | Inter | system-ui, sans-serif | 300–700 |
| Data / tabular | Inter (tabular nums) | system-ui, sans-serif | 400–600 |
| Monospace (code) | JetBrains Mono | ui-monospace, monospace | 400–500 |

**Rationale:** Inter was designed for screens, has excellent readability at small sizes, and includes tabular figures — essential for financial data. JetBrains Mono is used only for code blocks, raw queries, and terminal output.

### 3.2 Type Scale

Use a modular scale with a ratio of 1.25 (major third). All sizes are in rem units.

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-xs` | 0.75rem (12px) | 1.4 (16.8px) | 400 | Caption, metadata, table cell |
| `--text-sm` | 0.875rem (14px) | 1.5 (21px) | 400 | Body text, form labels, nav |
| `--text-base` | 1rem (16px) | 1.5 (24px) | 400 | Default body |
| `--text-lg` | 1.125rem (18px) | 1.5 (27px) | 500 | Large body, introduction |
| `--text-xl` | 1.25rem (20px) | 1.4 (28px) | 600 | Section heading |
| `--text-2xl` | 1.5rem (24px) | 1.3 (31.2px) | 600 | Subsection heading |
| `--text-3xl` | 1.875rem (30px) | 1.25 (37.5px) | 600 | Page heading |
| `--text-4xl` | 2.25rem (36px) | 1.2 (43.2px) | 600 | Hero heading |
| `--text-5xl` | 3rem (48px) | 1.15 (55.2px) | 600 | Display heading |

### 3.3 Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `--font-light` | 300 | Large display text only |
| `--font-normal` | 400 | Body, labels, table cells |
| `--font-medium` | 500 | Navigation, buttons, emphasis |
| `--font-semibold` | 600 | Headings, important data points |
| `--font-bold` | 700 | Rarely — only for emphasis in headings |

### 3.4 Letter Spacing

| Size | Tracking | Usage |
|------|----------|-------|
| xs | 0.02em | Caption, uppercase labels |
| sm | 0.01em | Small text, tabular data |
| base | 0em | Default body |
| lg | -0.01em | Large headings (24px+) |
| xl | -0.02em | Display headings (36px+) |

### 3.5 Tabular Figures

For all financial data, use Inter's tabular figures (tnum) to ensure numbers align vertically regardless of width. This is critical for comparing values in tables and lists.

```css
/* Enable tabular figures for data */
.data-text {
  font-variant-numeric: tabular-nums;
}
```

### 3.6 Typography Rules

1. **Maximum line length:** 75 characters for body text. 120 characters for data tables.
2. **Minimum font size:** 12px (--text-xs). Never go below.
3. **Headings should never be bold (700).** Use 600 at most.
4. **All-caps should be reserved for labels only** — use `font-medium` with `tracking-wide`.
5. **Avoid justified text.** Always left-align for readability.
6. **Link text should use accent-blue** with underline on hover only.

---

## 4. Grid System

### 4.1 Philosophy

The grid is a tool for establishing order, not a rigid cage. It provides structure while allowing flexibility for data-dense layouts.

### 4.2 Base Grid

| Property | Value |
|----------|-------|
| Columns | 12 |
| Column width | Fluid (fractional) |
| Gutter | 24px |
| Margin (desktop) | 48px |
| Margin (tablet) | 32px |
| Margin (mobile) | 16px |
| Max content width | 1440px |

### 4.3 Column Distribution

Common column splits for data layouts:

| Use Case | Layout |
|----------|--------|
| Single content | 12 columns |
| Sidebar + main | 3 + 9 |
| Equal panels | 6 + 6 |
| Three equal | 4 + 4 + 4 |
| Main + sidebar + detail | 6 + 3 + 3 |
| Metrics row | 3 + 3 + 3 + 3 |

### 4.4 Grid Usage Rules

1. **Use CSS Grid for page-level layouts** — never for component internals.
2. **Components should be agnostic to their grid position** — they fill the space they're given.
3. **Nested grids are allowed** but should be used sparingly.
4. **Avoid fixed-width columns** — use fractional units (`fr`) or percentage-based widths.
5. **The grid is for layout only** — not for alignment within components.

---

## 5. Spacing

### 5.1 Base Unit

The spacing scale is based on a 4px base unit. All spacing values should conform to this scale.

| Token | Pixels | Rem | Usage |
|-------|--------|-----|-------|
| `--space-1` | 4px | 0.25rem | Micro spacing, icon padding |
| `--space-2` | 8px | 0.5rem | Tight spacing, small gaps |
| `--space-3` | 12px | 0.75rem | Related items, label gaps |
| `--space-4` | 16px | 1rem | Default spacing, card padding |
| `--space-5` | 20px | 1.25rem | Section spacing |
| `--space-6` | 24px | 1.5rem | Grid gutter, panel padding |
| `--space-8` | 32px | 2rem | Section margins |
| `--space-10` | 40px | 2.5rem | Large section gaps |
| `--space-12` | 48px | 3rem | Page section spacing |
| `--space-16` | 64px | 4rem | Major page sections |
| `--space-20` | 80px | 5rem | Maximum spacing |

### 5.2 Spacing Rules

1. **Always use the spacing scale.** Never use arbitrary values.
2. **Prefer 4px increments.** 8px, 12px, 16px, 24px, 32px, etc.
3. **Card padding:** 24px (--space-6) in all directions.
4. **Between related elements:** 8px (--space-2).
5. **Between sections:** 24px (--space-6) minimum.
6. **Page margins:** 48px desktop, 32px tablet, 16px mobile.
7. **Stack spacing:** 16px (--space-4) between stacked cards.

---

## 6. Button Styles

### 6.1 Button Hierarchy

| Level | Token | Usage |
|-------|-------|-------|
| Primary | `--btn-primary` | Single primary action per view |
| Secondary | `--btn-secondary` | Most common action |
| Tertiary | `--btn-tertiary` | Low emphasis, secondary actions |
| Ghost | `--btn-ghost` | Toolbar, inline actions |
| Danger | `--btn-danger` | Destructive actions |

### 6.2 Primary Button

| Property | Value |
|----------|-------|
| Background | `--accent-indigo` (`#4F46E5`) |
| Text | White (`#FFFFFF`) |
| Border | None |
| Hover | `#4338CA` |
| Active | `#3730A3` |
| Disabled | `--neutral-300` background |
| Height | 40px |
| Horizontal padding | 20px left + 20px right |
| Border radius | 6px |
| Font | Inter, 14px, 500 weight |
| Icon spacing | 8px between icon and label |

### 6.3 Secondary Button

| Property | Value |
|----------|-------|
| Background | Transparent |
| Text | `--text-primary` |
| Border | 1px solid `--border-default` |
| Hover | `--bg-surface-hover` |
| Active | `--bg-surface-active` |
| Disabled | `--text-tertiary`, `--border-default` |
| Height | 40px |
| Horizontal padding | 20px left + 20px right |
| Border radius | 6px |
| Font | Inter, 14px, 500 weight |

### 6.4 Tertiary Button

| Property | Value |
|----------|-------|
| Background | Transparent |
| Text | `--text-secondary` |
| Border | None |
| Hover | `--text-primary` |
| Disabled | `--text-tertiary` |
| Height | 40px |
| Horizontal padding | 12px left + 12px right |
| Border radius | 6px |
| Font | Inter, 14px, 400 weight |

### 6.5 Ghost Button

| Property | Value |
|----------|-------|
| Background | Transparent |
| Text | `--text-secondary` |
| Border | None |
| Hover | `--bg-surface-hover` |
| Height | 32px |
| Horizontal padding | 8px left + 8px right |
| Border radius | 4px |
| Font | Inter, 13px, 400 weight |

### 6.6 Danger Button

Same as primary button, but with `--accent-red` (`#DC2626`) as the background color.

### 6.7 Button Sizes

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| sm | 32px | 12px horizontal | 13px | 14px |
| md (default) | 40px | 20px horizontal | 14px | 16px |
| lg | 48px | 24px horizontal | 16px | 18px |

### 6.8 Button States

All buttons must support the following states:
- **Default** — as specified above
- **Hover** — cursor: pointer, background darkens slightly
- **Active/Pressed** — background darkens further
- **Focus** — 2px outline with 2px offset using `--accent-blue`
- **Disabled** — cursor: not-allowed, reduced opacity
- **Loading** — spinner replaces icon, button remains sized

### 6.9 Button Groups

Buttons in a group should be separated by a 1px border, with no border radius on middle items. The group container has border radius on the first and last child.

---

## 7. Cards

### 7.1 Card Anatomy

```
┌─────────────────────────────────────┐
│  Header / Title        [Action]      │  <- 24px padding top
│─────────────────────────────────────│  <- 1px border separator
│                                       │
│  Content area                         │  <- 24px padding sides
│  (flexible height)                   │
│                                       │
│  Footer / Metadata    [Link]          │  <- optional
└─────────────────────────────────────┘
```

### 7.2 Card Styles

| Property | Value |
|----------|-------|
| Background | `--bg-surface` |
| Border | 1px solid `--border-default` |
| Border radius | 8px |
| Padding | 24px |
| Shadow | None (see Section 9) |
| Header bottom margin | 16px |
| Separator | 1px solid `--border-default` |

### 7.3 Card Types

| Type | Style | Usage |
|------|-------|-------|
| Default | White background, thin border | Most content panels |
| Bordered | White background, `--border-strong` | High-emphasis content |
| Elevated | White background, subtle shadow | Dropdowns, modals, overlays (see 9.3) |
| Active | `--bg-surface-active` | Selected state |
| Nested | No background, no border | Metrics inside a card |

### 7.4 Card Rules

1. **Cards should not have hover effects.** Data is not interactive by default.
2. **Only clickable cards should have hover states** — and only the entire card, not internal elements.
3. **Avoid card shadows in page layouts.** Shadows are reserved for overlays.
4. **Card header should be visually distinct** but not heavy — use `--text-secondary` for the header label.
5. **Cards should not have rounded corners larger than 8px.**

---

## 8. Borders

### 8.1 Border Weights

| Token | Width | Usage |
|-------|-------|-------|
| `--border-thin` | 0.5px | Hairline dividers (data tables) |
| `--border-default` | 1px | Standard borders, cards, inputs |
| `--border-thick` | 2px | Active state, selected rows |

### 8.2 Border Radius

| Token | Radius | Usage |
|-------|--------|-------|
| `--radius-sm` | 4px | Inputs, small components |
| `--radius-md` | 6px | Buttons, dropdowns |
| `--radius-lg` | 8px | Cards, modals, panels |
| `--radius-xl` | 12px | Large modals (rare) |
| `--radius-full` | 9999px | Badges, tags only |

### 8.3 Border Usage Rules

1. **Use borders sparingly.** Prefer spacing and background color to separate content.
2. **Data tables use horizontal borders only** — no vertical lines.
3. **Active borders should be 2px** using `--accent-blue`.
4. **Never use border-radius on data elements** (tables, charts, cells).
5. **Input fields use 1px border with `--border-default`** — focus state uses 2px `--accent-blue`.

---

## 9. Shadows

### 9.1 Philosophy

Shadows are used only to create elevation hierarchy for floating elements. They are never used for decoration or to add depth to page-level elements.

### 9.2 Shadow Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Tooltip, small popover |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.06)` | Dropdown, date picker |
| `--shadow-lg` | `0 8px 16px rgba(0,0,0,0.08)` | Modal, dialog |
| `--shadow-xl` | `0 12px 24px rgba(0,0,0,0.10)` | Full-screen overlay |

### 9.3 Shadow Rules

1. **Cards on a page should never use shadows.** Use borders instead.
2. **Shadows are for floating elements only** — anything that appears above the page.
3. **Dark mode shadows should use lighter values** (e.g., `rgba(255,255,255,0.04)`).
4. **Never use colored shadows** (e.g., blue glow on buttons).
5. **Never use inset shadows** on surfaces.

---

## 10. Icons

### 10.1 Icon Set

Use Lucide Icons as the primary icon library. Lucide provides a consistent, minimal, and functional set of line icons that align with the design philosophy.

### 10.2 Icon Properties

| Property | Value |
|----------|-------|
| Stroke width | 1.5px (default Lucide) |
| Size | 16px, 20px, 24px |
| Corner style | Square (round="none" or default) |
| Fill | None (line icons only) |

### 10.3 Icon Sizes

| Context | Size |
|---------|------|
| Inline with text (13–14px) | 14px |
| Inline with text (16px) | 16px |
| Button icon (sm) | 14px |
| Button icon (md) | 16px |
| Button icon (lg) | 18px |
| Section header icon | 20px |
| Empty state icon | 48px |
| Navigation icon | 20px |

### 10.4 Icon Rules

1. **Never use filled icons** — only outlined/line icons.
2. **Icons should always have a text label** — never standalone (except in toolbars).
3. **Icon color should match the surrounding text color** — never use accent colors for icons.
4. **Data direction icons** (up/down arrows) use `--accent-green` or `--accent-red`.
5. **Avoid custom icon sets.** Lucide provides sufficient coverage.
6. **Icons should be SVG** — never icon fonts.

---

## 11. Charts

### 11.1 Chart Philosophy

Charts are the primary interface for data analysis. They must be precise, readable, and functional. Decoration is counterproductive.

### 11.2 Chart Types

| Chart Type | Usage | When to Use |
|------------|-------|-------------|
| Line chart | Time series | Continuous data over time |
| Area chart | Cumulative returns | Emphasizing magnitude |
| Bar chart | Comparisons | Discrete categories |
| Histogram | Distribution | Statistical distribution |
| Scatter plot | Correlation | Two-variable relationships |
| Heatmap | Correlation matrix | Multi-variable relationships |
| Candle chart | OHLC data | Financial price data |
| Treemap | Portfolio allocation | Hierarchical proportions |

### 11.3 Chart Color Palette (Data Visualization)

| Token | Color | Hex | Usage |
|-------|-------|-----|-------|
| `--viz-1` | Blue | `#3B82F6` | Primary series |
| `--viz-2` | Indigo | `#6366F1` | Secondary series |
| `--viz-3` | Teal | `#14B8A6` | Tertiary series |
| `--viz-4` | Orange | `#F97316` | Quaternary series |
| `--viz-5` | Purple | `#A855F7` | Fifth series |
| `--viz-6` | Pink | `#EC4899` | Sixth series |
| `--viz-positive` | Green | `#059669` | Positive return |
| `--viz-negative` | Red | `#DC2626` | Negative return |
| `--viz-neutral` | Gray | `#6B7280` | Benchmark, baseline |

### 11.4 Chart Grid & Axes

| Element | Specification |
|---------|---------------|
| Grid lines | Horizontal only, 1px, `--border-default` opacity 0.5 |
| Vertical grid lines | Never |
| Axis labels | Inter, 12px, `--text-tertiary` |
| Axis title | Inter, 12px, `--text-secondary`, medium weight |
| Tick marks | None |
| Zero line | 1px solid `--border-strong` |

### 11.5 Chart Typography

| Element | Spec |
|---------|------|
| Chart title | 14px, 500 weight, `--text-primary` |
| Axis labels | 12px, 400 weight, `--text-tertiary` |
| Data labels | 12px, 500 weight, `--text-secondary` |
| Tooltip title | 13px, 600 weight, `--text-primary` |
| Tooltip value | 13px, 500 weight, `--text-primary` |
| Tooltip label | 13px, 400 weight, `--text-secondary` |

### 11.6 Chart Dimensions

| Element | Specification |
|---------|---------------|
| Minimum height | 200px |
| Default height | 320px |
| Line width | 1.5px |
| Dot radius | 3px (hover: 5px) |
| Bar corner radius | 0px (flat) |
| Area fill opacity | 0.1 |
| Tooltip background | `--bg-surface` with `--shadow-lg` |

### 11.7 Chart Interactivity

| Interaction | Behavior |
|-------------|----------|
| Hover | Crosshair + data point highlight |
| Click | Select data point / series |
| Drag | Pan (time series) |
| Scroll wheel | Zoom (time series) |
| Double-click | Reset zoom |

### 11.8 Chart Rules

1. **Never use 3D charts.** Ever.
2. **Never use pie charts or donut charts.** Use treemaps or bar charts instead.
3. **Never use gradient fills** on bars or areas.
4. **Always include a zero baseline** for bar charts.
5. **Always show the full time range** — never truncate the y-axis to exaggerate movements.
6. **Tooltips should be simple** — no decorative elements.
7. **Chart animations should be immediate** — no easing or duration for data updates.

---

## 12. Tables

### 12.1 Table Philosophy

Tables are the backbone of quantitative research. They must be dense, readable, and precise. Every pixel is optimized for scanning and comparing data.

### 12.2 Table Structure

```
┌─────────┬──────────┬──────────┬──────────┐
│ Header  │ Header   │ Header   │ Header   │  <- 32px height, bottom border
├─────────┼──────────┼──────────┼──────────┤
│ Cell    │ 1,234.56 │  +2.34%  │  $12.5B  │  <- 28px height, hover highlight
├─────────┼──────────┼──────────┼──────────┤
│ Cell    │ 5,678.90 │  -1.23%  │  $8.9B   │  <- zebra stripe optional
└─────────┴──────────┴──────────┴──────────┘
```

### 12.3 Table Dimensions

| Element | Specification |
|---------|---------------|
| Header height | 32px |
| Row height | 28px (compact) / 36px (default) / 44px (comfortable) |
| Cell horizontal padding | 8px left + 8px right |
| Cell vertical padding | Centered |
| Border | Horizontal only, 1px `--border-default` |

### 12.4 Table Typography

| Element | Spec |
|---------|------|
| Header text | 12px, 500 weight, `--text-secondary`, uppercase |
| Cell text | 13px, 400 weight, `--text-primary` |
| Numeric cell | 13px, 400 weight, tabular-nums, right-aligned |
| Text cell | 13px, 400 weight, left-aligned |
| Selected row | 500 weight |

### 12.5 Table States

| State | Visual |
|-------|--------|
| Default | White background |
| Hover | `--bg-surface-hover` on row |
| Selected | `--accent-blue` at 8% opacity on row |
| Sorting indicator | Arrow in header, `--accent-blue` |
| Empty | `--text-tertiary`, italic "No data" |

### 12.6 Table Interaction

| Interaction | Behavior |
|-------------|----------|
| Click header | Sort column (toggle asc/desc) |
| Click row | Select row |
| Click row + meta | Multi-select |
| Resize | Column width handle on header edge |
| Reorder | Drag header to reorder columns |
| Context menu | Right-click on row |

### 12.7 Table Rules

1. **No vertical borders** — only horizontal.
2. **No row striping by default** — use hover highlight only.
3. **Numbers are right-aligned** — text is left-aligned.
4. **Always use tabular figures** for numeric columns.
5. **Sortable columns show an indicator** — active sort is `--accent-blue`.
6. **Column widths should be meaningful** — don't distribute evenly.
7. **Long text truncates with ellipsis** — tooltip on hover.
8. **Sticky headers** on scroll (top).
9. **Sticky first column** (row label) for wide tables.

---

## 13. Forms

### 13.1 Form Philosophy

Forms are functional interfaces for data input. They should be clear, forgiving, and efficient. Every form should follow established patterns.

### 13.2 Input Fields

| Property | Value |
|----------|-------|
| Height | 40px |
| Width | Full (or constrained by content) |
| Padding | 12px left + 12px right |
| Border | 1px solid `--border-default` |
| Border radius | 6px |
| Background | `--bg-surface` |
| Text | 14px, 400 weight, `--text-primary` |
| Placeholder | 14px, 400 weight, `--text-tertiary` |

### 13.3 Input States

| State | Visual |
|-------|--------|
| Default | 1px `--border-default` |
| Hover | 1px `--border-strong` |
| Focus | 2px `--accent-blue`, no shadow |
| Error | 2px `--accent-red` |
| Disabled | `--bg-surface-hover`, `--text-tertiary` |
| Read-only | `--bg-surface-hover`, default border |

### 13.4 Form Labels

| Property | Value |
|----------|-------|
| Position | Above input (stacked) |
| Font | 13px, 500 weight, `--text-secondary` |
| Margin bottom | 6px |
| Required indicator | Asterisk in `--accent-red` |

### 13.5 Form Validation

| State | Indicator | Message |
|-------|-----------|---------|
| Error | Red border + icon | Below input, 12px, `--accent-red` |
| Success | Green border (optional) | Below input, 12px, `--accent-green` |
| Warning | Amber border | Below input, 12px, `--accent-amber` |

### 13.6 Form Elements

| Element | Spec |
|---------|------|
| Text input | As above |
| Textarea | Same as input, 120px default height, resizable vertical |
| Select | Same as input, custom dropdown chevron |
| Checkbox | 16px × 16px, square, 4px border radius |
| Radio | 16px × 16px, circle |
| Toggle | 36px × 20px, 10px circle |
| Date picker | Input + calendar dropdown |
| Search | Input + search icon, clearable |

### 13.7 Form Layout

| Pattern | Usage |
|---------|-------|
| Single column | Most forms (best for readability) |
| Two columns | Related short fields (name, date ranges) |
| Inline | Search filters, toolbar controls |

### 13.8 Form Rules

1. **Labels go above inputs** — never placeholder-only labels.
2. **Group related fields** with subtle spacing (24px between groups).
3. **Submit button is left-aligned** — not centered or right-aligned.
4. **Error messages should be specific** — not "Invalid input" but "Enter a valid ISIN."
5. **Autofocus the first field** on form load.
6. **Support keyboard navigation** with Tab in logical order.
7. **Never disable the submit button** for validation — show errors on submit.

---

## 14. Motion

### 14.1 Motion Philosophy

Motion is functional, not decorative. It serves to orient the user, provide feedback, and maintain context during state changes. If motion doesn't serve one of these purposes, it doesn't exist.

### 14.2 Duration

| Token | Duration | Usage |
|-------|----------|-------|
| `--motion-fast` | 100ms | Micro-interactions: hover, focus |
| `--motion-base` | 200ms | Transitions: panel open, dropdown |
| `--motion-slow` | 300ms | Page transitions, modals |

### 14.3 Easing

| Token | Curve | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Elements entering, appearing |
| `--ease-in` | `cubic-bezier(0.4, 0, 0.68, 0.06)` | Elements exiting, disappearing |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Continuous transitions |

### 14.4 Allowed Animations

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Fade in | 200ms | ease-out | Panels, modals, overlays |
| Slide up | 200ms | ease-out | Dropdown, tooltip |
| Scale in | 200ms | ease-out | Modal backdrop |
| Height expand | 200ms | ease-out | Accordion, expandable |
| Color change | 100ms | ease-out | Hover, focus |
| Data update | 0ms | none | Chart data, table values |

### 14.5 Motion Rules

1. **Data should never animate.** Values update instantly. No counting-up numbers.
2. **Chart transitions should be instant** — no animation when data changes.
3. **Page transitions should be instant** — no loading spinners for navigation.
4. **Hover effects should be 100ms** — immediate feedback.
5. **Reduce motion** — respect `prefers-reduced-motion` by disabling all animations.
6. **No parallax, no scroll-triggered animations, no entrance animations.**
7. **Loading states should be skeleton screens** — not spinners (except for actions).

---

## 15. Accessibility

### 15.1 Standards

Stratova Quant must meet **WCAG 2.2 Level AA** as a minimum. Level AAA is the target where feasible.

### 15.2 Color Contrast

| Element | Minimum Ratio | Target Ratio |
|---------|---------------|--------------|
| Body text | 4.5:1 | 7:1 |
| Large text (18px+ / 14px bold+) | 3:1 | 4.5:1 |
| UI components (borders, icons) | 3:1 | 4.5:1 |
| Disabled text | 3:1 (non-conforming) | — |

### 15.3 Focus Indicators

| Element | Specification |
|---------|---------------|
| Default | 2px solid `--accent-blue`, 2px offset |
| Force visible | Never use `outline: none` without replacement |
| Custom focus | Use `:focus-visible` for keyboard-only focus |

### 15.4 Keyboard Navigation

| Feature | Requirement |
|---------|-------------|
| Tab order | Logical, follows visual order |
| Skip links | "Skip to content" link on page load |
| Focus trap | Modals, dropdowns trap focus |
| Arrow keys | Supported in lists, tables, trees |
| Escape | Closes modals, dropdowns, menus |
| Enter/Space | Activates focused element |

### 15.5 Screen Reader Support

| Element | Requirement |
|---------|-------------|
| Images | `alt` text on all images |
| Icons | `aria-hidden="true"` on decorative icons |
| Buttons | Visible text label or `aria-label` |
| Forms | Label associated with input via `for`/`id` |
| Tables | `<th>` scope, `caption` or `aria-label` |
| Charts | `aria-label` with summary of data |
| Dynamic content | `aria-live` regions for updates |

### 15.6 Accessibility Rules

1. **Never rely on color alone** to convey information — use icons, patterns, or text in addition.
2. **Green/red must be distinguishable** by non-color means (position, icon, or text label).
3. **All interactive elements must be keyboard accessible.**
4. **Touch targets must be at least 44px × 44px.**
5. **Test with a screen reader** before releasing any feature.
6. **Support text zoom up to 200%** without breaking layout.

---

## 16. Responsive Behavior

### 16.1 Breakpoints

| Name | Min Width | Target Devices |
|------|-----------|----------------|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets (portrait) |
| `lg` | 1024px | Tablets (landscape), small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### 16.2 Responsive Behavior by Component

| Component | Desktop (xl+) | Tablet (md–lg) | Mobile (sm) |
|-----------|---------------|----------------|--------------|
| Sidebar | Fixed, 280px | Collapsible overlay | Hidden (drawer) |
| Table | Full width | Horizontal scroll | Horizontal scroll |
| Cards | Multi-column | 2-column | 1-column |
| Charts | Full width | Full width | 100% width, 200px min height |
| Navigation | Top bar + sidebar | Top bar + hamburger | Bottom nav (optional) |
| Forms | Multi-column | 2-column | Single column |
| Modals | Centered, 640px max | 90% width | Full screen |

### 16.3 Responsive Typography

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Display heading | 48px | 36px | 28px |
| Page heading | 30px | 24px | 20px |
| Body text | 16px | 16px | 15px |
| Table text | 13px | 13px | 12px |

### 16.4 Responsive Rules

1. **Mobile is not a secondary concern** — test all views at all breakpoints.
2. **Data-dense views (tables, charts) should scroll horizontally** on small screens — never truncate or hide data.
3. **Touch targets on mobile must be 44px minimum.**
4. **Avoid hover-dependent interactions** — they don't work on touch.
5. **Sidebar collapses to overlay on tablet** — never force a narrow sidebar.
6. **Forms stack to single column** on mobile.
7. **Test on actual devices** — not just browser resize.

---

## Appendix A: Figma Setup

### A.1 Libraries

- **Fonts:** Inter (Google Fonts), JetBrains Mono (Google Fonts)
- **Icons:** Lucide Icons (Figma plugin)
- **Color styles:** All tokens from Section 2
- **Text styles:** All tokens from Section 3
- **Effect styles:** All shadow tokens from Section 9
- **Grid templates:** 12-column grid from Section 4

### A.2 Component Naming Convention

```
[Category]/[Component]/[Variant]/[State]
```

Examples:
- `Button/Primary/Default`
- `Button/Primary/Hover`
- `Card/Default/Default`
- `Table/Row/Selected`
- `Input/Text/Focus`

### A.3 Auto Layout

All components should use Auto Layout with:
- Horizontal padding: 12px, 16px, 20px, 24px
- Vertical padding: 8px, 12px, 16px, 24px
- Gap: 4px, 8px, 12px, 16px, 24px
- All values from the spacing scale (Section 5)

---

## Appendix B: Design Review Checklist

Before any component is considered complete:

- [ ] Follows the spacing scale (no arbitrary values)
- [ ] Uses the correct color token (not a raw hex)
- [ ] Uses the correct text style (not a raw size/weight)
- [ ] Supports all interactive states (hover, active, focus, disabled)
- [ ] Has keyboard accessibility
- [ ] Has screen reader support
- [ ] Is responsive (tested at all breakpoints)
- [ ] Uses the correct border radius token
- [ ] Icon is properly sized and positioned
- [ ] No decorative elements without purpose
- [ ] Contrast ratios meet WCAG AA
- [ ] Reviewed by another designer