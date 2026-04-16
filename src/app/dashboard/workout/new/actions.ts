"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/workouts";
import { upsertUser } from "@/data/users";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  performedAt: z.coerce.date(),
  mood: z.coerce.number().int().min(1).max(5).optional(),
});

export async function createWorkoutAction(params: {
  name: string;
  performedAt: Date;
  mood?: number;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { name, performedAt, mood } = CreateWorkoutSchema.parse(params);

  await upsertUser(userId);
  return createWorkout(userId, name, performedAt, mood);
}
