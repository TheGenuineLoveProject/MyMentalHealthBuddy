# CHANGE GATE RULES

All changes MUST pass before implementation:

1. Domain classification
   - ENGINEERING
   - BUSINESS
   - CONTENT
   - HEALING
   - DESIGN

2. Impact scope
   - LOW
   - MEDIUM
   - HIGH

3. Risk check
   - Does it affect auth?
   - Does it affect routes?
   - Does it affect schema?
   - Does it affect billing?
   - Does it affect telemetry?
   - Does it affect production entrypoints?

4. Required implementation package
   - exact files changed
   - exact shell commands
   - verification steps
   - rollback steps

5. Stop conditions
   - if build fails, stop
   - if auth regresses, stop
   - if route contract changes unintentionally, stop
   - if system metrics disappear, stop

6. Default rule
   - prefer the smallest safe patch
   - do not refactor unrelated code
   - do not merge legacy inventory into active code without explicit migration plan
