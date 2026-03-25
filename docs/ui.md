# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do NOT create custom UI components (buttons, inputs, cards, modals, badges, etc.)
- Do NOT use any other component library (MUI, Chakra, Radix directly, etc.)
- All UI must be composed exclusively from shadcn/ui components
- If a shadcn/ui component does not exist for a use case, use the closest available component and compose with it — do not build from scratch

### Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

Components are added to `src/components/ui/`. Do not modify these generated files.

---

## Date Formatting

All dates must be formatted using **date-fns**.

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

Use this utility wherever dates are displayed. Do not use `toLocaleDateString`, `Intl.DateTimeFormat`, or any other date formatting method.
