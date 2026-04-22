---
description: Gather requirements and create SPEC.md before writing any code
---

Invoke the agent-skills:spec-driven-development skill.

Before writing any code, ask the user about three areas:

1. **Project Vision** — What problem does this solve? Who are the intended users?
2. **Feature Definition** — What are the essential capabilities? What does success look like?
3. **Technical Parameters** — What's the preferred technology stack? Are there any constraints?

Create a `SPEC.md` document in the project root covering:

- **Objective** — The purpose of the project and its user focus
- **Commands** — Runnable commands for building, testing, and development
- **Project Structure** — How files and folders are organized
- **Code Style** — Conventions and formatting (with real code examples)
- **Testing Strategy** — Framework, test locations, coverage expectations
- **Boundaries** — Always do / Ask first / Never do

Share the spec draft for human review. Confirm approval before any implementation begins.
