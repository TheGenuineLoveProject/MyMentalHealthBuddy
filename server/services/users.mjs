import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/client.mjs";
import { users } from "../../shared/schema.mjs";

export async function findUserByEmail(email) {
  const result = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  return result[0] || null;
}

export async function findUserById(id) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}
