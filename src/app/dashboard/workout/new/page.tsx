import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewWorkoutForm } from "./_components/NewWorkoutForm";

export default async function NewWorkoutPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>New workout</CardTitle>
        </CardHeader>
        <CardContent>
          <NewWorkoutForm />
        </CardContent>
      </Card>
    </div>
  );
}
