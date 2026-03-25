"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createWorkoutAction } from "../actions";

export function NewWorkoutForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [mood, setMood] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await createWorkoutAction({
        name,
        performedAt: new Date(date),
        mood: mood ? Number(mood) : undefined,
      });
      router.push("/dashboard");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Workout name</Label>
        <Input
          id="name"
          placeholder="e.g. Push day"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mood">Mood (optional)</Label>
        <Select value={mood} onValueChange={setMood}>
          <SelectTrigger id="mood">
            <SelectValue placeholder="How did you feel?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 – Terrible</SelectItem>
            <SelectItem value="2">2 – Bad</SelectItem>
            <SelectItem value="3">3 – Okay</SelectItem>
            <SelectItem value="4">4 – Good</SelectItem>
            <SelectItem value="5">5 – Great</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : "Create workout"}
      </Button>
    </form>
  );
}
