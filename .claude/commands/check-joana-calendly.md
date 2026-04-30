---
description: Poll Joana Faria's Calendly for May 2026 openings and notify via ntfy
---

Run `bash scripts/check-joana-calendly.sh` from the repo root. Report in one
line: either "no slots", "slots unchanged, already notified", or the dates
that triggered a notification. Do not elaborate, do not retry on failure —
`/loop` will run again in 15 min.
