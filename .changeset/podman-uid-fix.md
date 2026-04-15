---
"@ai-hero/sandcastle": patch
---

Fix Podman container crashes: rename base image's `node` user (UID 1000) to `agent` instead of creating a new user, so `--userns=keep-id` maps to the correct home directory owner. Override entrypoint in `podman run` to avoid double-sleep when the image already defines `ENTRYPOINT ["sleep", "infinity"]`.
