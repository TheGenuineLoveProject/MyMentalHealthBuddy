# UX Contracts — The Genuine Love Project
Version: v2.0  
Scope: Mental Health UX • AI Behavior • UI Copy • Safety • Prompts

This document defines **UX CONTRACTS**.
UX contracts are non-negotiable rules that bind:
- UI components
- AI system prompts
- UX copy
- Automation
- Future contributors

If a feature violates these contracts, it is considered **broken**, even if it “works.”

---

## 1) UX CONTRACT: NON-CLINICAL BOUNDARY

### RULE
The platform must never present itself as therapy, treatment, diagnosis, or crisis support.

### REQUIRED
- Clear disclaimers in:
  - Onboarding
  - Footer
  - AI chat entry
- Language framed as reflection and support only

### FORBIDDEN
- Diagnosing conditions
- Naming disorders
- Recommending medication
- Providing treatment plans
- Acting as crisis response

---

## 2) UX CONTRACT: VALIDATION FIRST

### RULE
Every interaction must validate before asking questions or offering steps.

### REQUIRED LANGUAGE PATTERNS
- “It makes sense…”
- “Given what you’re facing…”
- “That’s understandable…”

### FORBIDDEN
- “You should…”
- “Why didn’t you…”
- “The problem is…”

---

## 3) UX CONTRACT: USER AGENCY

### RULE
The user is always in control of depth, pace, and participation.

### REQUIRED
- Optional steps clearly marked
- Skip buttons available
- No forced journaling or prompts

### FORBIDDEN
- Mandatory emotional disclosure
- Emotional pressure
- Urgency framing

---

## 4) UX CONTRACT: TINY NEXT STEPS ONLY

### RULE
Any suggested action must be:
- Optional
- Small (1–5 minutes)
- Non-invasive

### ACCEPTABLE EXAMPLES
- Take one slow breath
- Write one sentence
- Pause for 60 seconds
- Name one feeling

### FORBIDDEN
- “Change your mindset”
- “Fix the situation”
- “Confront someone”
- “Make a big decision”

---

## 5) UX CONTRACT: LANGUAGE SAFETY

### REQUIRED
- Plain language (~6th grade)
- Short sentences
- Neutral emotional tone
- Trauma-aware phrasing

### FORBIDDEN
- Absolutes (“always”, “never”)
- Moral judgment
- Toxic positivity
- Clinical terminology

---

## 6) UX CONTRACT: AI BEHAVIOR CONSISTENCY

### RULE
AI behavior must match documented UX flows and prompt libraries.

### REQUIRED
- AI must use:
  - Validation
  - Curiosity
  - Clarity
  - Safety
  - Direction
- AI must follow `mental-health-ux.txt` exactly

### FORBIDDEN
- Independent advice generation
- Deviating tone
- Escalation language

---

## 7) UX CONTRACT: SINGLE SOURCE OF TRUTH

### RULE
UX truth lives in:
- `/ux/mental-health/*.md`
- `/server/ai/system-prompts/mental-health-ux.txt`

Code must **consume**, not reinterpret, UX.

---

## 8) ENFORCEMENT

Any PR or change that violates these contracts must:
- Be rejected
- Or refactored to comply

UX safety overrides feature velocity.

---

## 9) OWNERSHIP

UX Contracts are owned by:
**The Genuine Love Project**

They protect:
- Users
- Brand trust
- Legal safety
- Long-term integrity