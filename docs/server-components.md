# Server Components

## Rule: Params and SearchParams Must Be Awaited

**This project uses Next.js 15, where `params` and `searchParams` are Promises. You MUST `await` them before accessing any property.**

- Do NOT destructure `params` or `searchParams` directly from the function signature
- Do NOT access properties on `params` or `searchParams` before awaiting
- Always `await` the full object first, then destructure

```tsx
// CORRECT
export default async function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  ...
}

// WRONG — params is a Promise, not a plain object
export default async function WorkoutPage({ params }: { params: { id: string } }) {
  const { id } = params; // runtime error in Next.js 15
  ...
}
```

The same rule applies to `searchParams`:

```tsx
// CORRECT
export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  ...
}
```

---

## Rule: Server Components Are Async Functions

All Server Components that fetch data or access params must be declared as `async` functions.

- Do NOT use `use()` from React to unwrap promises in server components — `await` directly instead
- Async server components work at the page, layout, and individual component level

```tsx
// CORRECT
export default async function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return null;

  const workout = await getWorkoutById(id, userId);
  return <WorkoutDetail workout={workout} />;
}
```

---

## Rule: Data Fetching Belongs in Server Components

See `data-fetching.md` for the full rules. In summary:

- Fetch all data in the Server Component, then pass it as props to any client components
- Never fetch data inside client components (`"use client"`)
- `userId` must always come from `auth()` — never from `params` or any client-supplied value

---

## Type Reference

| Prop | Next.js 15 Type |
|------|-----------------|
| `params` | `Promise<{ [key: string]: string }>` |
| `searchParams` | `Promise<{ [key: string]: string \| string[] \| undefined }>` |

Always type these as Promises. Typing them as plain objects will compile but fail at runtime.
