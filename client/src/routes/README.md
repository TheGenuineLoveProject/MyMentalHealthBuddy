# Route Split Plan

Purpose:
Reduce App.jsx size and loading-risk by progressively moving route groups into isolated modules.

Rules:
- No route deletion.
- No path renaming.
- No behavior change.
- Move one route group per phase.
- Build after each move.
- Preserve ProtectedRoute, WellnessRoute, ConfigRoute behavior.

Priority order:
1. Hub routes
2. Tool routes
3. SEO alias routes
4. Admin routes
5. Account routes
