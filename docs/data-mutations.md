# Data Mutations

## Rule: Mutations Go Through `/data` Helper Functions

**ALL database mutations must go through helper functions in the `src/data/` directory.**

- Use Drizzle ORM for every insert, update, and delete — no raw SQL, ever
- Do not inline database mutations in server actions, components, or layouts
- Each helper function lives in a file that reflects its domain (e.g., `src/data/workouts.ts`, `src/data/exercises.ts`)
- Mutation helpers live alongside query helpers in the same domain files

### Example structure

```
src/
  data/
    workouts.ts      # getWorkoutsForUser(), createWorkout(), updateWorkout(), deleteWorkout(), etc.
    exercises.ts     # getExercisesForUser(), createExercise(), etc.
```

### Example helper functions

```ts
// src/data/workouts.ts
import { db } from "@/lib/db";
import { workouts } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date }).returning();
}

export async function deleteWorkout(workoutId: string, userId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

---

## Rule: Mutations Must Be Invoked via Server Actions

**ALL data mutations must be triggered via Next.js Server Actions.**

Do NOT mutate data via:
- Route handlers (`src/app/api/...`)
- Client-side `fetch` calls
- `useEffect`
- Any other mechanism

### Colocation Rule

Server actions must live in a file named `actions.ts` colocated with the route or feature that uses them.

```
src/
  app/
    dashboard/
      workouts/
        actions.ts   # server actions for the workouts feature
        page.tsx
```

---

## Rule: Server Action Parameters Must Be Typed (No `FormData`)

**Server action parameters must always use explicit TypeScript types.**

- Do NOT use `FormData` as a parameter type
- Define a typed argument object or individual typed parameters
- This makes actions predictable, refactor-safe, and easy to validate

```ts
// CORRECT
export async function createWorkoutAction(params: { name: string; date: Date }) { ... }

// WRONG
export async function createWorkoutAction(formData: FormData) { ... }
```

---

## Rule: All Server Actions Must Validate Arguments with Zod

**Every server action must validate its arguments using Zod before touching the database.**

- Define a Zod schema for the action's input
- Call `.parse()` at the top of the action body, before any other logic
- Never trust the shape or content of arguments passed to a server action

---

## Rule: Always Scope Mutations to the Logged-In User

The same user-scoping rule that applies to queries applies to mutations.

- The `userId` used in any insert, update, or delete must always come from the server-side Clerk session (`auth()` from `@clerk/nextjs/server`), never from action arguments, URL params, or any client-supplied input
- Always include a `userId` ownership check on updates and deletes to prevent one user from modifying another user's data
- If `userId` is `null`, the user is not authenticated — throw or return early before touching the database

```ts
// CORRECT — userId comes from the Clerk server session
const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
await deleteWorkout(workoutId, userId);

// WRONG — never trust a userId supplied by the client
await deleteWorkout(params.workoutId, params.userId);
```

---

## Rule: Never Use `redirect()` Inside Server Actions

**Do NOT call `redirect()` from `next/navigation` inside a server action. Redirects must be handled client-side after the action resolves.**

- Server actions should return a result (or throw on error) — never redirect internally
- The calling client component is responsible for navigating after a successful action, using `useRouter` from `next/navigation`

```ts
// CORRECT — action returns, client navigates
// actions.ts
export async function createWorkoutAction(params: { name: string; date: Date }) {
  ...
  return createWorkout(userId, name, date);
}

// MyForm.tsx (client component)
const router = useRouter();
await createWorkoutAction(params);
router.push("/dashboard");

// WRONG — do not redirect inside the action
export async function createWorkoutAction(params: { name: string; date: Date }) {
  ...
  await createWorkout(userId, name, date);
  redirect("/dashboard"); // never do this
}
```

---

## Full Example

```ts
// src/app/dashboard/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
});

export async function createWorkoutAction(params: { name: string; date: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { name, date } = CreateWorkoutSchema.parse(params);

  return createWorkout(userId, name, date);
}
```
