import express from "express";
import { signToken } from "../auth/jwt.mjs";
import loginRoutes from "./routes/login.mjs";
app.use("/api", loginRoutes);
const router = express.Router();

router.post("/login", (req, res) => {
  // TEMP DEV ADMIN
  const token = signToken({
    id: "admin-1",
    role: "admin",
  });

  res.json({ token });
});

export default router;