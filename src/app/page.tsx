import { SignUpButton, Show } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white">
        Track your lifts.
      </h1>
      <p className="mt-4 max-w-md text-lg text-zinc-500 dark:text-zinc-400">
        Log workouts, track progress, and hit new PRs. Simple and fast.
      </p>
      <div className="mt-8 flex gap-4">
        <Show when="signed-out">
          <SignUpButton mode="modal">
            <button className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors">
              Get Started
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
          >
            Go to Dashboard
          </Link>
        </Show>
      </div>
    </main>
  );
}
