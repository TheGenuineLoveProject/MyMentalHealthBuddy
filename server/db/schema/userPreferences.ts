import { pgTable, uuid, boolean } from "drizzle-orm/pg-core";

export const userPreferences = pgTable("user_preferences", {
  userId: uuid("user_id").primaryKey(),
  onboardingCompleted: boolean("onboarding_completed").default(false),
});