---
"@ai-hero/sandcastle": patch
---

Parameterize sequential-reviewer, blank, and parallel-planner templates with backlog manager placeholders (`{{LIST_TASKS_COMMAND}}`, `{{VIEW_TASK_COMMAND}}`, `{{CLOSE_TASK_COMMAND}}`). Parallel-planner `main.mts` now uses `{ id: string }` instead of `{ number: number }` in the plan JSON type, `TASK_ID` instead of `ISSUE_NUMBER` in prompt args, and raw IDs without `#` prefix in log output and the `ISSUES` list.
