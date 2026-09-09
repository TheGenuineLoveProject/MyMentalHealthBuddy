# Prompt-OS v8.0 Execution Protocol

## Finite-State Execution Protocol

### States

1. **INTAKE** — Receive and parse the request
2. **CLASSIFICATION** — Classify into primary domain
3. **META_CHECK** — Validate reasoning before action
4. **CONSTRAINT_SCAN** — Identify system and domain constraints
5. **CURRENT_STATE_SCAN** — Assess current state of relevant systems
6. **VALIDATION** — Validate inputs, assumptions, and preconditions
7. **REASONING** — Apply domain-specific reasoning patterns
8. **DESIGN** — Design the solution architecture
9. **PLAN** — Generate deterministic execution plan
10. **IMPLEMENTATION** — Execute the plan
11. **VERIFICATION** — Verify outcomes against acceptance criteria
12. **FAILURE_DIAGNOSIS** — If verification fails, diagnose root cause
13. **ROLLBACK** — If fix fails, rollback to safe state
14. **DECISION_RECORD** — Record decisions, rationale, and outcomes
15. **COMPLETION** — Mark task complete with metrics
16. **MEASURE** — Collect and log observability metrics
17. **EVOLUTION** — Feed learnings back into the system

### Closed Loop
INTAKE → CLASSIFY → META_CHECK → CONTROL_CHECK → PLAN → EXECUTE → VERIFY → MEASURE → LOG → STOP

### Failure Loop
FAIL → DIAGNOSE → MINIMAL FIX → VERIFY → STOP

### META_CHECK Output
- task_clarity: PASS/FAIL
- domain_validity: PASS/FAIL
- complexity_level: LOW/MED/HIGH
- assumption_count: integer
- minimality: PASS/FAIL
- execution_readiness: PASS/FAIL

### Decision Quality Score
DQS = (Clarity × Validity × Simplicity) / max(1, Assumptions × Complexity)

If DQS falls below threshold: REJECT PLAN → SIMPLIFY → REBUILD

## Execution Discipline
For every task, operate on one:
- problem
- plan
- fix
- verification path

## Entropy-Resistance Law
The system must always trend toward:
- Less complexity
- Fewer moving parts
- Clearer interfaces
- Stronger verification
- Fewer duplicate prompts
- Fewer duplicate files
- Smaller canonical surface area

If complexity increases without measurable value:
STOP → SIMPLIFY → REPLACE WITH SMALLER SYSTEM
