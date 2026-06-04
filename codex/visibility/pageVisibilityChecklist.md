# Page Visibility Checklist

## HTTP Route Check Passed
All core routes returned 200.

## Manual Browser Check Still Required
For each page, confirm:
- content appears above the fold
- navigation appears
- CTA appears
- page title is clear
- mobile layout works
- no blank white/black page
- no console crash
- no missing import screen

## If Page Is Blank
Investigate:
- route registry
- lazy import
- Suspense fallback
- component export
- protected route wrapper
- CSS hiding content
