import 'dotenv/config';

const env = (k, d='') => process.env[k]?.trim() || d;

// Pull what your connector already writes
const AUTH_URL   = env('CANVA_AUTH_URL',   'https://<your-tunnel>.loca.lt/');
const TOKEN_URL  = env('CANVA_TOKEN_URL',  'https://<your-tunnel>.loca.lt/api/canva/callback');
const DEV_URL    = env('CANVA_DEV_URL',    'http://localhost:5189/canva-app.js');  // your bridge prints this
const APP_ID     = env('CANVA_APP_ID',     'APP_ID_FROM_CANVA_SECURITY_PAGE');
const APP_ORIGIN = env('CANVA_APP_ORIGIN', 'https://app-XXXXXXXX.canva-apps.com');

const pad = s => s.replace(/^\n|\n$/g,'');
const hr  = () => console.log('\n' + '─'.repeat(72) + '\n');

console.log('\n✅ Canva Console Completion Kit\n');

hr();
console.log('A) AUTHENTICATION → Add provider (Custom)\n');
console.log(pad(`
Provider: Custom
Identifier: genuinelove.dev.client
Client ID: genuinelove.dev.client
Client secret: genuinelove.dev.secret
Credential transfer mode: Headers (default)
Authorization server URL: ${AUTH_URL}
Token exchange URL: ${TOKEN_URL}
Redirect URL: (auto-filled by Canva)  https://www.canva.com/apps/oauth/authorized
`));

hr();
console.log('B) CODE UPLOAD → Development URL\n');
console.log(pad(`
Development URL: ${DEV_URL}
`));

hr();
console.log('C) SECURITY → .env identifiers (already in your project)\n');
console.log(pad(`
CANVA_APP_ID=${APP_ID}
CANVA_APP_ORIGIN=${APP_ORIGIN}
CANVA_ENABLE_HMR=TRUE
`));

hr();
console.log('D) SCOPES (start minimal, you can add later):\n');
console.log(pad(`
[ ] canva.design:content   (Read)    → check ONLY if you need to read a user's design
[ ] canva.design:content   (Write)   → check ONLY if your app writes back into a design
[ ] canva.asset:private    (Read)    → check ONLY if you load user's private assets
[ ] canva.asset:private    (Write)   → check ONLY if you upload assets for the user
[ ] canva.brandkit         (Read)    → check ONLY if you read Brand Kit (fonts/colors/logos)

Recommended now (safe/minimal for dev):
  • leave ALL unchecked unless you know you use that API.
`));

hr();
console.log('E) SUBMISSION → Testing instructions (paste this block):\n');
console.log(pad(`
Login details: Sign in with a standard Canva account (no extra credentials).
Steps to test:
1) Open the app inside Canva (Apps → "The Genuine Love Project").
2) Click "Connect". You will be redirected to the Authorization server URL (${AUTH_URL}) and back via the Token exchange URL (${TOKEN_URL}).
3) After OAuth completes, the app loads "canva-app.js" from ${DEV_URL}.
4) No additional roles or paid features required. If the tunnel has expired, re-run:
   \`node scripts/run-canva.mjs\` and use the NEW Authorization/Token URLs the console prints.
Expected result:
- The app panel renders without errors.
- Any buttons in the panel respond and fetch from the local backend at http://localhost:5173 (proxied internally).
`));

hr();
console.log('F) APP LISTING DETAILS → Text (paste these)\n');
console.log(pad(`
App name: The Genuine Love Project — Design Companion
Short description (≤50): Self-love design companion for calm, clarity, and creative flow.
Tagline (≤50): Live in Genuine Love.
Description (≤200):
Guided, gentle tools that help you design with intention. Add prompts, affirmations,
and calming structures into your Canva workflow. Build consistent visuals while
staying grounded in self-love and clarity.
`));

hr();
console.log('G) APP LISTING DETAILS → Links (until your site is live)\n');
console.log(pad(`
Company or website URL: https://genuineloveproject.com   (or https://thegenuineloveproject.com)
Terms & Conditions URL: https://genuineloveproject.com/terms
Privacy Policy URL:     https://genuineloveproject.com/privacy
Support URL:            mailto:positivetalkspace@gmail.com
`));

hr();
console.log('H) WEBHOOKS (optional for now)\n');
console.log('Leave empty. You can add later if you need uninstall callbacks.\n');

hr();
console.log('I) COLLABORATORS\n');
console.log('You are already listed as Owner. Add reviewers ONLY if Canva requests.\n');

hr();
console.log('Done. Copy each section into the Canva Developer Console as indicated above.\n');
