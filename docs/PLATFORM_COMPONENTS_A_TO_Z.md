# PLATFORM COMPONENTS A TO Z

## A. App bootstrap
- server/app.mjs
- Canonical Express runtime entry

## B. Billing
- server/billing/
- subscriptions, checkout, invoices, plan enforcement

## C. Config
- config/
- environment mappings, non-secret config definitions

## D. Contracts
- contracts/
- interface contracts and lock references

## E. Database
- db/
- schema, access, persistence, migrations integration

## F. Engine
- engine/
- orchestration logic and runtime coordination

## G. Governance
- docs/
- manifests, ownership matrix, route registry, file tree

## H. Helpers
- helpers/
- non-runtime or support helpers if present

## I. Insights
- insights/
- analytics read models, dashboards, internal intelligence

## J. Journaling + healing content
- content/
- editorial source, healing modules, structured content assets

## K. Knowledge / intelligence
- intelligence/
- AI orchestration internals, inference helpers

## L. Lib / shared utils
- lib/
- shared internal utilities

## M. Memory
- memory/
- session memory, scoped retrieval helpers

## N. Middleware
- middleware/
- auth, request guards, interceptors

## O. Public assets
- public/
- static files, logos, public media

## P. Pages
- pages/
- page-level UI or page templates

## Q. Quarantine / archive
- .archive/
- retired files, never imported by runtime

## R. Routes
- routes/
- route-family definitions only

## S. Scripts
- scripts/
- operator scripts, verify, manifest, governance checks

## T. Tests
- tests/
- automated tests only

## U. Utils
- utils/
- reusable helpers

## V. Validation
- validation/
- schemas, type validation, guards

## W. Work reports
- reports/
- generated reports only

## X. External integrations
- replit_integrations/
- Replit-specific glue

## Y. Premium
- premium/
- gated premium logic

## Z. Security
- security/
- csrf, headers, request safety, auth hardening
