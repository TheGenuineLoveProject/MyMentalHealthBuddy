// server/selfheal.js
import { exec } from "child_process";

export function autoHeal() {
  exec("npm run heal", (err, stdout, stderr) => {
    console.log("Healing output:", stdout);
    if (err) console.error("Healing error:", stderr);
  });
}