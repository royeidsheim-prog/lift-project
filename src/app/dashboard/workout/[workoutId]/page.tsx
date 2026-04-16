import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./_components/EditWorkoutForm";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workoutId } = await params;
  const id = Number(workoutId);
  if (isNaN(id)) notFound();

  const workout = await getWorkoutById(id, userId);
  if (!workout) notFound();

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit workout</CardTitle>
        </CardHeader>
        <CardContent>
          <EditWorkoutForm
            workoutId={workout.id}
            initialName={workout.name ?? ""}
            initialPerformedAt={workout.performedAt}
            initialMood={workout.mood}
          />
        </CardContent>
      </Card>
    </div>
  );
}
