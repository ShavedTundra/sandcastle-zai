---
"@ai-hero/sandcastle": patch
---

Add backlog manager selection to `sandcastle init` (GitHub Issues or Beads). All templates use placeholders (`{{LIST_TASKS_COMMAND}}`, `{{VIEW_TASK_COMMAND}}`, `{{CLOSE_TASK_COMMAND}}`) replaced at scaffold time with the correct commands for the chosen manager. Parallel-planner uses `{ id: string }` instead of `{ number: number }` in plan JSON, `TASK_ID` instead of `ISSUE_NUMBER` in prompt args, and raw IDs in log output. Selecting Beads skips the "Create Sandcastle label" step.
