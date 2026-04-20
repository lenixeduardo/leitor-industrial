---
name: spec-driven-development
description: Creates a comprehensive spec before any coding. Use when starting a new project or feature, when requirements are ambiguous, when multiple files will be changed, or when architectural decisions must be made.
---

# Spec-Driven Development

## Overview

Create a structured `SPEC.md` before writing any code. The spec surfaces assumptions, defines scope, and creates alignment before implementation begins. A 15-minute spec prevents hours of rework.

"Don't silently fill in ambiguous requirements. The spec's entire purpose is to surface misunderstandings *before* code gets written."

## When to Use

- Starting a new project or major feature
- Requirements are ambiguous or underspecified
- The change will touch multiple files
- Architectural decisions need to be made

**When NOT to use:** Single-line fixes, purely mechanical changes, unambiguous tasks.

## The Spec Process

### Phase 1: Discovery

Before writing the spec, gather information across three areas:

1. **Project Vision** — What problem does this solve? Who are the intended users?
2. **Feature Definition** — What are the essential capabilities? What does success look like?
3. **Technical Parameters** — What's the preferred tech stack? Are there constraints?

### Phase 2: Specification

Create a `SPEC.md` document covering all six areas:

#### 1. Objective
- What problem does this solve?
- Who are the users?
- What does success look like?

#### 2. Commands
Actual runnable commands for building, testing, and developing:
```
Build:  npm run build
Test:   npm test
Dev:    npm run dev
Lint:   npm run lint
```

#### 3. Project Structure
```
src/
  components/  → UI components
  services/    → Business logic
  types/       → TypeScript types
tests/         → Test files
```

#### 4. Code Style
Real code examples demonstrating conventions.

#### 5. Testing Strategy
- Test framework and test locations
- Coverage expectations: unit, integration, e2e

#### 6. Boundaries
Three-tier decision framework:
- **Always do:** Write tests before code, follow project structure
- **Ask first:** Major architectural changes, new dependencies
- **Never do:** Commit secrets, skip tests

### Phase 3: Review

- Present the spec to the human for review
- Request confirmation before implementation begins
- The spec is a living document — update it as decisions change

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I know what to build" | You know one interpretation. The spec reveals the others. |
| "It's a quick change" | Quick changes that break assumptions create slow bug hunts. |
| "We can figure it out as we go" | "As we go" means after you've built the wrong thing. |

## Red Flags

- Starting to write code before the spec is reviewed
- Spec that says "build X" without defining success criteria
- Missing boundaries section
- No runnable commands in the spec

## Verification

Before leaving the spec phase:

- [ ] All six sections are complete
- [ ] Runnable commands are verified
- [ ] Human has reviewed and approved
- [ ] SPEC.md is committed to version control
