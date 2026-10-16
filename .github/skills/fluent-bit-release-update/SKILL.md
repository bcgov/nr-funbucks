---
name: fluent-bit-release-update
description: 'Use when checking the official Fluent Bit releases for the latest version and opening a PR to update the pinned base release in nr-funbucks.'
---

# Fluent Bit Base Release Update

Use this skill to check the official [fluent/fluent-bit](https://github.com/fluent/fluent-bit) releases and open a PR when the pinned base release is older than the latest stable release. The version is never supplied by a person: automation resolves it. The skill never merges or deploys.

The single source of truth for the pinned version is `fluentBitRelease` in `config/base.json`. Per-server files in `config/server/` may override it; this skill updates only the base release and leaves those overrides alone.

## Automated path

The **Update Fluent Bit base release** workflow (`.github/workflows/update-fluent-bit.yml`) runs weekly and can be started manually with no inputs. It:

1. Reads the current pin from `config/base.json`.
2. Resolves the latest stable (non-draft, non-prerelease) release from `fluent/fluent-bit`.
3. Does nothing if the pin is already equal to or newer than the latest release (it never downgrades).
4. Otherwise updates only the `fluentBitRelease` line and opens or updates the PR on branch `automation/fluent-bit-update`.

PRs created with the default `GITHUB_TOKEN` do not trigger other workflows (such as CI). Close and reopen the PR to run checks before merging.

## Manual procedure

1. Read the pin: `jq -r .fluentBitRelease config/base.json`.
2. Latest stable release: `gh release view --repo fluent/fluent-bit --json tagName,url` (strip the leading `v`).
3. Stop if the pin is already equal or newer.
4. Review the release notes for breaking changes. Flag major version jumps in the PR.
5. Check for an existing PR: `gh pr list --head automation/fluent-bit-update`.
6. Edit only the `fluentBitRelease` line, run `npm run lint` and `npm test`, optionally validate with the `local-fluentbit-testing` skill.
7. Commit `Update Fluent Bit to <version>`, push, and open the PR with `gh pr create`.
