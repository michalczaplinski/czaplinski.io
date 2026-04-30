#!/usr/bin/env bash
set -euo pipefail

UUID="8ed440a9-50d8-4e08-9e7c-7d732310384e"
RANGE_START="2026-05-01"
RANGE_END="2026-05-31"
TOPIC="joana-faria-appointment-k9P2mL"
BOOKING_URL="https://calendly.com/drajoanafaria-xclinic/consultation-in-person?month=2026-05"
STATE_FILE="/tmp/joana-calendly-last.txt"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

API_URL="https://calendly.com/api/booking/event_types/${UUID}/calendar/range?timezone=Europe/Lisbon&range_start=${RANGE_START}&range_end=${RANGE_END}&diagnostics=false"

response=$(curl -fsS -H "User-Agent: $UA" "$API_URL")

summary=$(printf '%s' "$response" | jq -r '
  [.days[]
    | select(.status == "available" and (.spots | length) > 0)
    | {date, times: [.spots[] | select(.status == "available") | .start_time]}]
  | sort_by(.date)
  | .[] | "\(.date): \(.times | join(", "))"
')

if [ -z "$summary" ]; then
  : > "$STATE_FILE"
  echo "no slots"
  exit 0
fi

new_hash=$(printf '%s' "$summary" | sha256sum | cut -d' ' -f1)
old_hash=""
[ -f "$STATE_FILE" ] && old_hash=$(cat "$STATE_FILE")

if [ "$new_hash" = "$old_hash" ]; then
  echo "slots unchanged, already notified"
  exit 0
fi

curl -fsS \
  -H "Title: Joana Faria - May 2026 slot open" \
  -H "Priority: high" \
  -H "Tags: calendar,stethoscope" \
  -H "Click: $BOOKING_URL" \
  -d "$summary" \
  "ntfy.sh/$TOPIC" > /dev/null

printf '%s' "$new_hash" > "$STATE_FILE"
echo "notified: $(printf '%s' "$summary" | tr '\n' '; ')"
