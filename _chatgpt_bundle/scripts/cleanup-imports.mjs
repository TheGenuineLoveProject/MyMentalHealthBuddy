import { execSync } from "child_process";

execSync("npx depcheck", { stdio: "inherit" });