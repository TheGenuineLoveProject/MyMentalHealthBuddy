import fs from "node:fs";
import crypto from "node:crypto";

export function sha256File(filePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

export function sha256Text(text) {
  const hash = crypto.createHash("sha256");
  hash.update(text);
  return hash.digest("hex");
}