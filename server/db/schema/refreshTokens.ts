import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    tokenHash: text("token_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    rtUserIdx: index("rt_user_idx").on(t.userId),
    rtHashIdx: index("rt_hash_idx").on(t.tokenHash),
  })
);