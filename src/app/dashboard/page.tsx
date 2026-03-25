import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutsForUserOnDate } from "@/data/workouts";
import { DatePicker } from "./_components/DatePicker";

function formatDate(date: Date): string {
  const day = date.getDate();
  const ordinal =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${day}${ordinal} ${format(date, "MMM yyyy")}`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { date: dateParam } = await searchParams;
  const date = dateParam ? new Date(dateParam) : new Date();

  const workouts = await getWorkoutsForUserOnDate(userId, date);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8">
        <DatePicker initialDate={date} />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Workouts for {formatDate(date)}
        </h2>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Dumbbell className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No workouts logged for this date.
              </p>
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) =>
            workout.workoutExercises.length === 0 ? (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {workout.name ?? "Workout"}
                  </CardTitle>
                  <CardDescription>No exercises logged.</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              workout.workoutExercises.map((we) => (
                <Card key={we.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{we.exercise.name}</CardTitle>
                    <CardDescription>
                      {we.sets.length} {we.sets.length === 1 ? "set" : "sets"}
                      {we.sets.length > 0 && we.sets[0].reps != null && (
                        <> &times; {we.sets[0].reps} reps</>
                      )}
                      {we.sets.length > 0 && we.sets[0].weightKg != null && (
                        <> &middot; {we.sets[0].weightKg} kg</>
                      )}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            )
          )
        )}
      </div>
    </div>
  );
}
