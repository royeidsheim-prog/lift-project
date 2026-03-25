# UI Coding Standards

## Component Library

**ONLY shadcn/ui components may be used for UI in this project. ABSOLUTELY NO custom components.**

- Do NOT create custom UI components of any kind — no buttons, inputs, cards, modals, badges, tables, dialogs, dropdowns, or any other UI element
- Do NOT use any other component library (MUI, Chakra, Radix directly, Headless UI, etc.)
- Do NOT build UI primitives from scratch using raw HTML elements styled with Tailwind
- All UI must be composed exclusively from shadcn/ui components
- If a shadcn/ui component does not exist for a specific use case, compose the closest available shadcn/ui components together — never build from scratch

### Adding shadcn/ui Components

Before writing any UI, check whether the required shadcn/ui component has already been added to the project under `src/components/ui/`. If it hasn't, add it:

```bash
npx shadcn@latest add <component-name>
```

Components are installed to `src/components/ui/`. Do not modify these generated files.

### Examples

| Need | Do | Do NOT |
|------|----|--------|
| A button | `<Button>` from shadcn/ui | `<button className="...">` |
| A text input | `<Input>` from shadcn/ui | `<input className="...">` |
| A container/panel | `<Card>` from shadcn/ui | `<div className="rounded-lg border ...">` |
| A dropdown | `<DropdownMenu>` from shadcn/ui | Custom dropdown built with `useState` + absolute positioning |
| A modal | `<Dialog>` from shadcn/ui | Custom overlay built from scratch |

---

## Date Formatting

All dates must be formatted using **date-fns**. No exceptions.

### Required Format

Dates are displayed as: `{ordinal day} {abbreviated month} {full year}`

| Date | Display |
|------|---------|
| 2025-09-01 | 1st Sep 2025 |
| 2025-08-02 | 2nd Aug 2025 |
| 2026-01-03 | 3rd Jan 2026 |
| 2024-06-04 | 4th Jun 2024 |

### Implementation

```ts
import { format } from "date-fns";

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = d.getDate();

  const ordinal =
    day % 10 === 1 && day !== 11 ? "st"
    : day % 10 === 2 && day !== 12 ? "nd"
    : day % 10 === 3 && day !== 13 ? "rd"
    : "th";

  return `${day}${ordinal} ${format(d, "MMM yyyy")}`;
}
```

Use this utility wherever dates are displayed. Do NOT use `toLocaleDateString`, `Intl.DateTimeFormat`, `.toString()`, or any other date formatting method.
