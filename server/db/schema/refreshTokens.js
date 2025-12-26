import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    refreshTokensUserIdx: index("refresh_tokens_user_id_idx").on(t.userId),
    refreshTokensHashIdx: index("refresh_tokens_token_hash_idx").on(t.tokenHash),
  })
);