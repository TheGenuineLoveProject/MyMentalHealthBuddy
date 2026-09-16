/**
 * Auth Storage Operations
 * Integration: blueprint:javascript_log_in_with_replit
 */

import { users } from "../../../shared/schema.mjs";
import db from "../../db/client.mjs";
import { eq } from "drizzle-orm";
import { logger } from "../../utils/logger.mjs";

class AuthStorage {
  async getUserByReplitId(replitId) {
    const [user] = await db.select().from(users).where(eq(users.replitId, replitId));
    return user;
  }

  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData) {
    const existingUser = await this.getUserByReplitId(userData.id);
    
    const fullName = userData.firstName 
      ? `${userData.firstName}${userData.lastName ? ' ' + userData.lastName : ''}`
      : 'Replit User';
    
    if (existingUser) {
      const [user] = await db
        .update(users)
        .set({
          email: userData.email || existingUser.email,
          name: fullName !== 'Replit User' ? fullName : existingUser.name,
          profileImageUrl: userData.profileImageUrl || existingUser.profileImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.replitId, userData.id))
        .returning();
      return user;
    } else {
      const email = userData.email || `user_${userData.id}@Replit.auth`;
      
      const existingByEmail = userData.email 
        ? await db.select().from(users).where(eq(users.email, userData.email))
        : [];
      
      if (existingByEmail.length > 0) {
        // Matching email is not proof of ownership of an existing account.
        const error = new Error("Account linking requires explicit verification");
        error.code = "AUTH_ACCOUNT_LINK_REQUIRED";
        throw error;
      }

      // Public sign-in never grants administrator privileges.
      const [user] = await db
        .insert(users)
        .values({
          replitId: userData.id,
          email: email,
          name: fullName,
          profileImageUrl: userData.profileImageUrl,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      logger.info("[Auth] New user created", { email, role: user.role });
      return { ...user, isNewUser: true };
    }
  }
}

export const authStorage = new AuthStorage();
