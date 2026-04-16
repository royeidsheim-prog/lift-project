import { db } from "@/db";
import { users } from "@/db/schema";

export async function upsertUser(userId: string) {
  return db
    .insert(users)
    .values({ id: userId })
    .onConflictDoNothing({ target: users.id });
}
