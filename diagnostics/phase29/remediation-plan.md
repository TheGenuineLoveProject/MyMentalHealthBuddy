# Phase 29 Security Remediation Plan

## Current audit count
{
  "info": 0,
  "low": 0,
  "moderate": 16,
  "high": 3,
  "critical": 0,
  "total": 19
}

## Rule
- No `npm audit fix --force` until each breaking dependency path is isolated and tested.
- Fix one dependency class at a time.
- Build, health, ready, and git status must pass after each change.

## Vulnerabilities
- @esbuild-kit/core-utils: moderate; direct=false; fix={"name":"drizzle-kit","version":"0.18.1","isSemVerMajor":true}
- @esbuild-kit/esm-loader: moderate; direct=false; fix={"name":"drizzle-kit","version":"0.18.1","isSemVerMajor":true}
- @google-cloud/storage: moderate; direct=true; fix={"name":"@google-cloud/storage","version":"5.20.4","isSemVerMajor":true}
- bhttp: moderate; direct=false; fix={"name":"broken-link-checker","version":"0.6.7","isSemVerMajor":true}
- broken-link-checker: high; direct=true; fix={"name":"broken-link-checker","version":"0.6.7","isSemVerMajor":true}
- drizzle-kit: moderate; direct=true; fix={"name":"drizzle-kit","version":"0.18.1","isSemVerMajor":true}
- esbuild: moderate; direct=false; fix={"name":"drizzle-kit","version":"0.18.1","isSemVerMajor":true}
- form-data2: moderate; direct=false; fix=true
- gaxios: moderate; direct=false; fix=true
- pm2: moderate; direct=true; fix={"name":"pm2","version":"6.0.14","isSemVerMajor":true}
- retry-request: moderate; direct=false; fix={"name":"@google-cloud/storage","version":"5.20.4","isSemVerMajor":true}
- robot-directives: moderate; direct=false; fix=true
- robots-txt-guard: high; direct=false; fix={"name":"broken-link-checker","version":"0.6.7","isSemVerMajor":true}
- teeny-request: moderate; direct=false; fix={"name":"@google-cloud/storage","version":"5.20.4","isSemVerMajor":true}
- tmp: high; direct=false; fix=true
- tough-cookie: moderate; direct=false; fix={"name":"broken-link-checker","version":"0.6.7","isSemVerMajor":true}
- useragent: moderate; direct=false; fix=true
- uuid: moderate; direct=false; fix={"name":"@google-cloud/storage","version":"5.20.4","isSemVerMajor":true}
- ws: moderate; direct=false; fix={"name":"pm2","version":"6.0.14","isSemVerMajor":true}
