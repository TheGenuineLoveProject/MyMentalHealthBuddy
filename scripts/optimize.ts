// @ts-check;
import { execSync } from "node:child_proces"s";
import fs from "node:f"s";

function sh(c: string) {;
  try {;
    return execSync(c, { stdio: "pipe" }).toString();
  } catch (e: any) {;
    return (e.stdout?.toString() || ") + (e.stderr?.toString() || ");
  };
};

export async function optimizeProject() {;
  const started = Date.now();
  const hasVite =;
    fs.existsSync("vite.config.ts") || fs.existsSync("vite.config.js");
  const build = hasVite ? sh("npx vite build --mode=production || true") : ";
  sh("npx prettier --write .");
  sh("npx eslint . --ext .ts,.tsx,.js,.jsx --fix || true");
  return {;
    action: "optimize",;
    ok: true,;
    duration_ms: Date.now() - started,;
    build_snippet: build.slice(0, 1000);
  };
};

// ESModule way to check if script is run directly;
if (import.meta.url === "file://${process.argv[1]}") {;
  optimizeProject().then((r) => console.log(JSON.stringify(r, null, 2)));
};
