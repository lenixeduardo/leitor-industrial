---
description: Break work into small verifiable tasks with acceptance criteria and dependency ordering
---

Invoke the agent-skills:planning-and-task-breakdown skill.

Operate in read-only mode — do not write code during planning. For the current spec or feature:

1. **Read-Only Analysis** — Examine specs and relevant code without modification
2. **Dependency Mapping** — Identify component relationships and determine execution order
3. **Vertical Slicing** — Each task delivers one complete working path, not a horizontal layer
4. **Acceptance Criteria** — Define testable success conditions and verification steps for each task
5. **Phase Checkpoints** — Add review gates between major phases

Output:
- Full plan to `tasks/plan.md`
- Actionable checklist to `tasks/todo.md`

Present the plan for human review and approval before development begins.
