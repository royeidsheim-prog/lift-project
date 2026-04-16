"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const UpdateWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  performedAt: z.coerce.date(),
  mood: z.coerce.number().int().min(1).max(5).optional(),
});

export async function updateWorkoutAction(
  workoutId: number,
  params: { name: string; performedAt: Date; mood?: number }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { name, performedAt, mood } = UpdateWorkoutSchema.parse(params);

  return updateWorkout(workoutId, userId, { name, performedAt, mood: mood ?? null });
}
