import fs from "fs";
import path from "path";

const root = process.cwd();
const exts = [".ts", ".js", ".tsx"];

function scan(dir: string) {
  for (const file of fs.readdirSync(dir)) {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) scan(p);
    else if (exts.some(e => file.endsWith(e))) {
      let code = fs.readFileSync(p, "utf8");
      code = code
        .replace(/\.j\.js\"s\"/g, ".js\"")
        .replace(/child_proces\"s\"/g, "child_process\"")
        .replace(/node:f\"s\"/g, "node:fs\"")
        .replace(/@jest\/global\"s\"/g, "@jest/globals\"")
        .replace(/"\$\{([^}]*)\}"/g, "`\${$1}`")
        .replace(/\{/g, "{")
        .replace(/;\}/g, "}")
        .replace(/;0\./g, "*0.");
      fs.writeFileSync(p, code);
      console.log("✅ Repaired:", p);
    }
  }
}
scan(root);