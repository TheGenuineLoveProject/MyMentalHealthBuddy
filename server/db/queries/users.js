import { db } from "../client.mjs";
import { users } from "../schema.mjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function createUser(email, passwordHash) {
  const user = {
    id: nanoid(),
    email,
    passwordHash,
  };

  await db.insert(users).values(user);
  return user;
}

export async function findUserByEmail(email) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  return result[0] || null;
}