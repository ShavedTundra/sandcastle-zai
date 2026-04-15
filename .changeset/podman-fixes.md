---
"@ai-hero/sandcastle": patch
---

Fix Podman integration: rootless mode support with `--userns=keep-id` flag (configurable via `userns` option), pre-flight image existence check, Podman Machine detection on macOS/Windows, 5s timeout on signal handler cleanup, correct `:ro,z` syntax for SELinux-labeled readonly bind mounts, and `interactiveExec` for interactive agent sessions via `podman exec -it`.
