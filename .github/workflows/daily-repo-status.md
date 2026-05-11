---
description: |
  This workflow creates a daily maintainer digest for the Expense Tracker
  repository. It reviews recent repository activity and opens a concise status
  issue with highlights, risks, and next-step recommendations tailored to this
  offline-first PWA project.

on:
  schedule: daily
  workflow_dispatch:

permissions:
  contents: read
  issues: read
  pull-requests: read

network: defaults

tools:
  github:
    lockdown: false
    min-integrity: none

safe-outputs:
  mentions: false
  allowed-github-references: []
  create-issue:
    title-prefix: "[daily-repo-status] "
    close-older-issues: true
---

# Daily Repo Status

Create a concise daily status report for the Expense Tracker repository as a GitHub issue for maintainers.

## What to include

- A short snapshot of recent repository activity, including issues, pull requests, releases, and notable code changes
- Highlights that affect the Expense Tracker app experience, such as budgeting, analytics, import/export, offline/PWA behavior, or GitHub Pages deployment
- Any risks, blockers, stale work, or notable inactivity that maintainers should be aware of
- Clear, actionable next steps for the repository maintainers

## Output format

Use these sections when relevant:

1. **Snapshot** - one short paragraph summarizing overall repo momentum
2. **Recent activity** - the most important issues, pull requests, releases, or commits
3. **Attention needed** - blockers, stale items, missing follow-up, or quiet areas worth noting
4. **Suggested next steps** - 2-4 concrete actions for maintainers

If there has been little or no activity, say that plainly and keep the report brief.

## Style

- Be positive, factual, and helpful
- Keep the report concise and easy to scan
- Address maintainers generically; do not mention teams or specific people unless the repository activity already does so
- Link only the most relevant issues, pull requests, commits, or releases

## Process

1. Gather recent repository activity
2. Review the repository context, open and recent issues, pull requests, releases, and code changes
3. Create a new GitHub issue with the report
