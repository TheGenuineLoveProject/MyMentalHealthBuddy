import fs from 'fs';
import path from 'path';

const banned = ['MyMentalHealthBuddy', '#ff0000', '#00ff00'];
const SKIP_DIRS = ['node_modules', 'dist', '.git', '_quarantine', '_chatgpt_bundle', '.quarantine', '.local'];
const SKIP_FILES = ['brand-config.mjs', 'legacy-purge.mjs', 'scan-project.mjs', 'brand-rename.mjs'];

function scan(dir) {
  for (const file of fs.readdirSync(dir)) {
    if (SKIP_DIRS.includes(file)) continue;
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scan(full);
    } else {
      if (SKIP_FILES.includes(path.basename(full))) continue;
      try {
        const content = fs.readFileSync(full, 'utf8');
        banned.forEach(term => {
          if (content.includes(term)) {
            console.log(`❌ Found legacy term "${term}" in ${full}`);
          }
        });
      } catch (e) {
        // Skip binary files
      }
    }
  }
}

scan('.');
console.log('✅ Scan complete');