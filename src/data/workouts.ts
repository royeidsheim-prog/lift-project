import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export async function createWorkout(
  userId: string,
  name: string,
  performedAt: Date,
  mood?: number
) {
  return db
    .insert(workouts)
    .values({ userId, name, performedAt, mood })
    .returning();
}

export async function getWorkoutsForUserOnDate(userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.performedAt, start),
      lt(workouts.performedAt, end)
    ),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.orderIndex)],
        with: {
          exercise: true,
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
    },
  });
}
