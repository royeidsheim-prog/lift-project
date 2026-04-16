# Routing

## Rule: All App Routes Live Under `/dashboard`

All user-facing application routes must be nested under `/dashboard`. Do not create top-level app routes (e.g., `/workouts`, `/profile`) — they belong under `/dashboard` instead.

Current route structure:

```
/dashboard                          → src/app/dashboard/page.tsx
/dashboard/workout/new              → src/app/dashboard/workout/new/page.tsx
/dashboard/workout/[workoutId]      → src/app/dashboard/workout/[workoutId]/page.tsx
```

---

## Rule: All `/dashboard` Routes Are Protected

Every route under `/dashboard` requires the user to be authenticated. Unauthenticated users must never be able to access any `/dashboard` page or subpage.

---

## Rule: Route Protection Is Handled by Middleware Only

Route protection must be enforced in `src/middleware.ts` using Clerk's `createRouteMatcher`. Do **not** implement redirect logic inside page components or layouts.

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

- The `/dashboard(.*)` matcher covers the dashboard root and all subpages
- When adding a new protected route prefix, add it to the `createRouteMatcher` array — do not create a separate middleware file
- Do NOT use `auth().protect()` or manual redirects inside `page.tsx` or `layout.tsx` files as a substitute for middleware protection

---

## Rule: Server Components Still Check `userId` Defensively

Even though the middleware protects `/dashboard` routes, Server Components that fetch user data must still check for `userId` from `auth()` before querying the database. This is a defence-in-depth measure, not the primary protection mechanism.

```tsx
// src/app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null; // middleware should have already redirected

  // fetch data with userId...
}
```

See `auth.md` for the full pattern and `data-fetching.md` for how `userId` flows into data helpers.

---

## Adding a New Route

1. Create the route under `src/app/dashboard/`
2. Confirm the `/dashboard(.*)` matcher in `src/proxy.ts` already covers it (it does for any path starting with `/dashboard`)
3. If you add a route **outside** `/dashboard` that also needs protection, add its pattern to `createRouteMatcher` in `src/proxy.ts`
