export const userPreferences = pgTable("user_preferences", {
  userId: uuid("user_id").primaryKey(),

  onboardingCompleted: boolean("onboarding_completed").default(false),

  primaryGoals: text("primary_goals"),
  focusAreas: text("focus_areas"),
  preferredToolTypes: text("preferred_tool_types"),

  dailyReminderTime: time("daily_reminder_time"),
  weeklyGoalMinutes: integer("weekly_goal_minutes"),

  notificationsEnabled: boolean("notifications_enabled").default(true),
  darkModePreference: boolean("dark_mode_preference").default(false)
});