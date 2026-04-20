---
name: test-driven-development
description: Drives development with tests. Use when implementing any logic, fixing any bug, or changing any behavior. Use when you need to prove that code works, when a bug report arrives, or when you're about to modify existing functionality.
---

# Test-Driven Development

## Overview

Write a failing test before writing the code that makes it pass. For bug fixes, reproduce the bug with a test before attempting a fix. Tests are proof — "seems right" is not done. A codebase with good tests is an AI agent's superpower; a codebase without tests is a liability.

## When to Use

- Implementing any new logic or behavior
- Fixing any bug (the Prove-It Pattern)
- Modifying existing functionality
- Adding edge case handling
- Any change that could break existing behavior

**When NOT to use:** Pure configuration changes, documentation updates, or static content changes with no behavioral impact.

## The TDD Cycle

```
    RED                GREEN              REFACTOR
 Write a test    Write minimal code    Clean up the
 that fails  ──→  to make it pass  ──→  implementation  ──→  (repeat)
      │                  │                    │
      ▼                  ▼                    ▼
   Test FAILS        Test PASSES         Tests still PASS
```

### Step 1: RED — Write a Failing Test

Write the test first. It must fail. A test that passes immediately proves nothing.

### Step 2: GREEN — Make It Pass

Write the minimum code to make the test pass. Don't over-engineer.

### Step 3: REFACTOR — Clean Up

With tests green, improve the code without changing behavior:
- Extract shared logic
- Improve naming
- Remove duplication
- Optimize if necessary

Run tests after every refactor step to confirm nothing broke.

## The Prove-It Pattern (Bug Fixes)

When a bug is reported, **do not start by trying to fix it.** Start by writing a test that reproduces it.

```
Bug report arrives
       │
       ▼
  Write a test that demonstrates the bug
       │
       ▼
  Test FAILS (confirming the bug exists)
       │
       ▼
  Implement the fix
       │
       ▼
  Test PASSES (proving the fix works)
       │
       ▼
  Run full test suite (no regressions)
```

## The Test Pyramid

```
          ╱╲
         ╱  ╲         E2E Tests (~5%)
        ╱    ╲        Full user flows, real browser
       ╱──────╲
      ╱        ╲      Integration Tests (~15%)
     ╱          ╲     Component interactions, API boundaries
    ╱────────────╲
   ╱              ╲   Unit Tests (~80%)
  ╱                ╲  Pure logic, isolated, milliseconds each
 ╱──────────────────╲
```

**The Beyonce Rule:** If you liked it, you should have put a test on it.

## Writing Good Tests

### Test State, Not Interactions

Assert on the *outcome* of an operation, not on which methods were called internally.

### DAMP Over DRY in Tests

Tests should be **Descriptive And Meaningful Phrases** — each test should tell a complete story without requiring the reader to trace through shared helpers.

### Prefer Real Implementations Over Mocks

```
Preference order (most to least preferred):
1. Real implementation  → Highest confidence, catches real bugs
2. Fake                 → In-memory version of a dependency (e.g., fake DB)
3. Stub                 → Returns canned data, no behavior
4. Mock (interaction)   → Verifies method calls — use sparingly
```

Use mocks only when the real implementation is too slow, non-deterministic, or has side effects you can't control.

### Use Arrange-Act-Assert

```typescript
it('marks overdue tasks when deadline has passed', () => {
  // Arrange
  const task = createTask({ title: 'Test', deadline: new Date('2025-01-01') });

  // Act
  const result = checkOverdue(task, new Date('2025-01-02'));

  // Assert
  expect(result.isOverdue).toBe(true);
});
```

### Name Tests Descriptively

```typescript
// Good: Reads like a specification
describe('TaskService.completeTask', () => {
  it('sets status to completed and records timestamp', ...);
  it('throws NotFoundError for non-existent task', ...);
  it('is idempotent — completing an already-completed task is a no-op', ...);
});
```

## Test Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Testing implementation details | Tests break on refactor even if behavior is unchanged | Test inputs and outputs |
| Flaky tests | Erode trust in the test suite | Use deterministic assertions |
| Snapshot abuse | Large snapshots nobody reviews | Use sparingly, review every change |
| No test isolation | Tests pass individually but fail together | Each test sets up its own state |
| Mocking everything | Tests pass but production breaks | Prefer real implementations |

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll write tests after the code works" | You won't. And tests written after the fact test implementation, not behavior. |
| "This is too simple to test" | Simple code gets complicated. The test documents the expected behavior. |
| "Tests slow me down" | Tests slow you down now. They speed you up every time you change the code later. |
| "I tested it manually" | Manual testing doesn't persist. Tomorrow's change might break it with no way to know. |

## Red Flags

- Writing code without any corresponding tests
- Tests that pass on the first run (they may not be testing what you think)
- Bug fixes without reproduction tests
- Test names that don't describe the expected behavior
- Skipping tests to make the suite pass

## Verification

After completing any implementation:

- [ ] Every new behavior has a corresponding test
- [ ] All tests pass
- [ ] Bug fixes include a reproduction test that failed before the fix
- [ ] Test names describe the behavior being verified
- [ ] No tests were skipped or disabled
- [ ] Coverage hasn't decreased (if tracked)
