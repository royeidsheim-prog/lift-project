# Auth Coding Standards

## Provider: Clerk

**This app uses Clerk exclusively for authentication. Do NOT use any other auth library or mechanism.**

- Do NOT use NextAuth, Auth.js, Lucia, Supabase Auth, custom JWT logic, or any other auth solution
- Do NOT store passwords, sessions, or tokens manually
- Do NOT build custom login/signup UI — use Clerk's prebuilt components
- All auth is handled by Clerk — trust it and use its APIs consistently

---

## ClerkProvider

`<ClerkProvider>` must wrap the entire app. It is already set up in `src/app/layout.tsx` and must remain there. Do not add additional `<ClerkProvider>` instances in nested layouts or pages.

---

## Middleware (`src/middleware.ts`)

Clerk middleware runs on every request via `src/middleware.ts`.

The current setup:

```ts
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

To protect specific routes, extend the middleware using `createRouteMatcher`:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/workout(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

- Add new protected route patterns to the `createRouteMatcher` list
- Do NOT manually redirect to `/sign-in` inside page components — use `auth().protect()` in the middleware

---

## Getting the Current User (Server-Side)

**Always use Clerk's `auth()` helper from `@clerk/nextjs/server` in Server Components and server-side code.**

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
```

- `userId` is `null` if the user is not signed in
- Never derive the current user from URL params, cookies, or request bodies
- Never trust a `userId` that comes from the client
- Always destructure `userId` — do not pass the whole `auth` object around

```tsx
// src/app/dashboard/page.tsx (Server Component)
import { auth } from "@clerk/nextjs/server";
import { getWorkoutsForUser } from "@/data/workouts";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) return null; // middleware should have already redirected

  const workouts = await getWorkoutsForUser(userId);
  return <WorkoutList workouts={workouts} />;
}
```

See `data-fetching.md` for the full pattern on passing `userId` into `/data` helper functions.

---

## Clerk Components

Use Clerk's prebuilt components for all auth-related UI.

### Conditional rendering

Use the `<Show>` component to conditionally render content based on auth state:

```tsx
import { Show } from "@clerk/nextjs";

<Show when="signed-in">
  <UserButton />
</Show>

<Show when="signed-out">
  <SignInButton mode="modal">...</SignInButton>
</Show>
```

### Sign-in / Sign-up buttons

Use `mode="modal"` for `SignInButton` and `SignUpButton`. Pass a styled child element as the trigger — do not rely on default button rendering:

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";

<SignInButton mode="modal">
  <button className="...">Sign In</button>
</SignInButton>

<SignUpButton mode="modal">
  <button className="...">Sign Up</button>
</SignUpButton>
```

### Component reference

| Need | Use |
|------|-----|
| Show content when signed in | `<Show when="signed-in">` from `@clerk/nextjs` |
| Show content when signed out | `<Show when="signed-out">` from `@clerk/nextjs` |
| Sign in trigger | `<SignInButton mode="modal">` from `@clerk/nextjs` |
| Sign up trigger | `<SignUpButton mode="modal">` from `@clerk/nextjs` |
| User avatar / account menu | `<UserButton />` from `@clerk/nextjs` |

Do NOT build custom versions of any of these.

---

## Database User Sync

The `users` table in the database uses the **Clerk user ID as the primary key**:

```ts
// src/db/schema.ts
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Clerk user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

- All other tables that are user-owned reference `users.id`, which is the Clerk `userId` string
- When a new user signs up via Clerk, they must be synced into the `users` table before any data can be written for them
- Never generate or invent user IDs — always use the `userId` returned by `auth()`

---

## Environment Variables

Clerk requires the following environment variables in `.env.local`. These must never be committed to source control:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is safe to expose to the browser
- `CLERK_SECRET_KEY` is server-only — never reference it in client components or expose it publicly
