---
"@ai-hero/sandcastle": patch
---

Fix templates crashing with "copyToSandbox is not supported with head branch strategy" by adding explicit `branchStrategy: { type: "merge-to-head" }` to all template `run()` calls that use `copyToSandbox`.
