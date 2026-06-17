---
name: deployment
description: Start here to ship built-and-tested code to its target safely — release steps, rollout, smoke checks, and rollback.
context: fork
agent: release-engineer
---

<what-to-do>

Ship it safely. Take built-and-tested code to its target environment with a path forward and a path back. Decide the version, run the release, confirm it works in place, and be ready to roll back the instant it doesn't.

A release is only done when a smoke check proves the deployed version is healthy. "It deployed" is not the same as "it works."

</what-to-do>

<supporting-info>

## The release loop

1. Confirm the build and tests are green for the exact commit you are shipping.
2. Choose the version and tag it; record what changed.
3. Roll out — prefer staged/canary over big-bang where the target supports it.
4. Run smoke checks against the live target. Healthy → done. Unhealthy → roll back, don't debug in prod.

## What to get right

- **Rollback first** — know the down path (previous version, feature flag, revert) before you push the up path.
- **Config and secrets** — environment config and secrets are correct for the target; secrets never land in the artifact, logs, or VCS.
- **Versioning** — tag the release so the deployed version is traceable to a commit.
- **Smoke checks** — a minimal end-to-end probe of the live system, not just "the process started."

## What to produce

The version shipped, the rollout method used, the smoke-check result, and the exact rollback command for this release.

</supporting-info>
