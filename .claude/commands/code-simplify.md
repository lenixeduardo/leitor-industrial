---
description: Simplify code for clarity and maintainability while preserving exact behavior
---

Invoke the agent-skills:code-simplification skill.

Systematically simplify the target code:

1. **Foundation** — Review CLAUDE.md for project conventions
2. **Scope** — Identify the target code (typically recent changes or current diff)
3. **Analysis** — Understand purpose, callers, edge cases, and test coverage
4. **Identification** — Look for complexity patterns:
   - Deep nesting → guard clauses or extracted helpers
   - Long functions → split by single responsibility
   - Nested ternaries → if/else or switch statements
   - Generic identifiers → descriptive names
   - Duplicated logic → consolidated helpers
   - Dead code → remove entirely
5. **Application** — Apply changes incrementally, run tests after each step
6. **Verification** — Confirm all tests pass and build succeeds

If any simplification causes test failures, revert and reassess.
After simplification, invoke the agent-skills:code-review-and-quality skill to evaluate the result.
