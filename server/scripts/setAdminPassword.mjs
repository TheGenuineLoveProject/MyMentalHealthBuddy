#!/usr/bin/env node
/**
 * Admin Password Reset Script
 * 
 * Sets a bcrypt password hash and role=admin for a given email.
 * Does NOT extract or display passwords.
 * 
 * Usage: node server/scripts/setAdminPassword.mjs <email> <new-password>
 */

import 'dotenv/config';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.mjs';
import { users } from '../../shared/schema.mjs';

const BCRYPT_ROUNDS = 10;

async function setAdminPassword(email, newPassword) {
  if (!email || !newPassword) {
    console.error('Usage: node server/scripts/setAdminPassword.mjs <email> <new-password>');
    console.error('');
    console.error('This script sets the password and role=admin for a user.');
    console.error('Minimum password length: 8 characters');
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error('Error: Password must be at least 8 characters');
    process.exit(1);
  }

  try {
    const userRows = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userRows.length === 0) {
      console.error(`Error: No user found with email: ${email}`);
      process.exit(1);
    }

    const user = userRows[0];
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await db
      .update(users)
      .set({
        passwordHash,
        role: 'admin',
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    console.log(`Success: User ${email} updated`);
    console.log(`  - Password hash set (bcrypt, ${BCRYPT_ROUNDS} rounds)`);
    console.log(`  - Role set to: admin`);
    console.log('');
    console.log('The user can now log in with the new password.');
    
    process.exit(0);
  } catch (error) {
    console.error('Database error:', error.message);
    process.exit(1);
  }
}

const [,, email, newPassword] = process.argv;
setAdminPassword(email, newPassword);
