# Data Fetching

## Rule: Server Components Only

**ALL data fetching must be done exclusively via React Server Components.**

Do NOT fetch data via:
- Route handlers (`src/app/api/...`)
- Client components (`"use client"`)
- `useEffect` + `fetch`
- SWR, React Query, or any client-side fetching library
- Any other mechanism

If you need data in a client component, fetch it in a parent server component and pass it down as props.

## Rule: Drizzle ORM via `/data` Helper Functions

**ALL database queries must go through helper functions in the `/data` directory.**

- Use Drizzle ORM for every query — no raw SQL, ever
- Do not inline database queries in components or layouts
- Each helper function lives in a file that reflects its domain (e.g., `/data/workouts.ts`, `/data/exercises.ts`)

### Example structure

```
src/
  data/
    workouts.ts      # getWorkoutsForUser(), getWorkoutById(), etc.
    exercises.ts     # getExercisesForUser(), etc.
```

### Example helper function

```ts
// src/data/workouts.ts
import { db } from "@/lib/db";
import { workouts } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

```tsx
// src/app/dashboard/page.tsx (Server Component)
import { getWorkoutsForUser } from "@/data/workouts";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);
  return <WorkoutList workouts={workouts} />;
}
```

## Rule: Always Scope Queries to the Logged-In User

**A logged-in user must NEVER be able to access another user's data.**

Every helper function that returns user-owned data must:

1. Accept a `userId` parameter
2. Include a `where eq(table.userId, userId)` clause in every query
3. Never expose a version of the function that fetches all rows without a user filter

The `userId` must always come from the server-side session (e.g., `auth()`), never from user-supplied input such as URL params or request bodies. Trusting client-supplied IDs is a critical security vulnerability.

```ts
// CORRECT — userId comes from the server session
const session = await auth();
const data = await getWorkoutsForUser(session.user.id);

// WRONG — never do this
const data = await getWorkoutsForUser(params.userId); // user-controlled!
```

Do not add any admin bypass or "fetch all" variant unless it is explicitly behind a server-side role check.
