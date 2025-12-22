import fs from 'fs';
import path from 'path';

const banned = ['MyMentalHealthBuddy', '#ff0000', '#00ff00'];

function scan(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) scan(full);
    else {
      const content = fs.readFileSync(full, 'utf8');
      banned.forEach(term => {
        if (content.includes(term)) {
          console.log(`❌ Found legacy term "${term}" in ${full}`);
        }
      });
    }
  }
}

scan('.');
console.log('✅ Scan complete');