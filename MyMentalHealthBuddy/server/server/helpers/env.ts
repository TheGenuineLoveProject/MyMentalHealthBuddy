import dotenv from "dotenv";
export function loadEnv() {
  dotenv.config();
  if (!process.env.PORT) process.env.PORT = "5000";
  if (!process.env.SESSION_SECRET) process.env.SESSION_SECRET = "mhb-default-secret";
  console.log("✅ Environment variables loaded")
}