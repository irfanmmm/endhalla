#!/usr/bin/env bash
#
# dev.sh — start the whole Endhalla stack with one command.
#
# Usage:
#   ./dev.sh                      backend + admin panel + generic Metro bundler
#   ./dev.sh --install            npm install in every package first, then start
#   ./dev.sh --no-metro           skip the React Native Metro bundler
#   ./dev.sh --no-admin           skip the admin panel (Vite) dev server
#   ./dev.sh --no-backend         skip the backend APIs
#
#   App targets (mirrors the package.json "<platform>:<role>:testing" scripts —
#   starts Metro for that role AND builds/installs/launches the app once):
#   ./dev.sh --android-client
#   ./dev.sh --android-counsellor
#   ./dev.sh --ios-client
#   ./dev.sh --ios-counsellor
#
# Services:
#   backend      client API      http://localhost:5002
#                counsellor API  http://localhost:5001
#                admin API       http://localhost:5003
#   admin-panel  Vite SPA        http://localhost:5173
#   metro        RN bundler      http://localhost:8081
#
# Press Ctrl+C once to stop everything.

set -uo pipefail
set -m                       # job control: each service gets its own process group
cd "$(dirname "$0")"
ROOT="$(pwd)"

RUN_INSTALL=0
RUN_METRO=1
RUN_ADMIN=1
RUN_BACKEND=1
APP_PLATFORM=""               # "" | android | ios
APP_ROLE=""                   # "" | client | counsellor

usage() { awk 'NR>1{ if ($0 !~ /^#/) exit; sub(/^# ?/, ""); print }' "$0"; }

for arg in "$@"; do
  case "$arg" in
    --install)             RUN_INSTALL=1 ;;
    --no-metro)            RUN_METRO=0 ;;
    --no-admin)            RUN_ADMIN=0 ;;
    --no-backend)          RUN_BACKEND=0 ;;
    --android-client)      APP_PLATFORM=android; APP_ROLE=client ;;
    --android-counsellor)  APP_PLATFORM=android; APP_ROLE=counsellor ;;
    --ios-client)          APP_PLATFORM=ios;     APP_ROLE=client ;;
    --ios-counsellor)      APP_PLATFORM=ios;     APP_ROLE=counsellor ;;
    -h|--help)             usage; exit 0 ;;
    *) echo "unknown option: $arg" >&2; usage; exit 1 ;;
  esac
done

# ----------------------------------------------------------------------------
# shutdown: kill every service's whole process group, then SIGKILL stragglers
# ----------------------------------------------------------------------------
PGIDS=()
_cleaning=0
cleanup() {
  trap '' INT TERM         # ignore further Ctrl+C while we shut down
  trap - EXIT
  [ "$_cleaning" = "1" ] && return
  _cleaning=1
  echo ""
  echo "==> stopping all services..."
  local pgid
  # polite first: SIGTERM the whole process group of each service
  for pgid in "${PGIDS[@]:-}"; do
    [ -n "$pgid" ] || continue
    kill -TERM "-$pgid" 2>/dev/null || kill -TERM "$pgid" 2>/dev/null || true
  done
  sleep 1
  # then force-kill anything that ignored it
  for pgid in "${PGIDS[@]:-}"; do
    [ -n "$pgid" ] || continue
    kill -KILL "-$pgid" 2>/dev/null || kill -KILL "$pgid" 2>/dev/null || true
  done
  echo "==> done."
  exit 0
}
trap cleanup EXIT INT TERM

# ----------------------------------------------------------------------------
# optional install
# ----------------------------------------------------------------------------
if [ "$RUN_INSTALL" = "1" ]; then
  echo "==> installing dependencies (root, backend, admin-panel)..."
  npm install
  (cd backend && npm install)
  (cd admin-panel && npm install)
fi

# ----------------------------------------------------------------------------
# preflight
# ----------------------------------------------------------------------------
if [ "$RUN_BACKEND" = "1" ] && ! nc -z localhost 27017 2>/dev/null; then
  echo "!!  MongoDB not detected on localhost:27017 (backend APIs need it)."
  echo "    Start it with:  brew services start mongodb-community"
fi

# start <label> <dir> <command...>  — runs in its own process group,
# output prefixed with [label]; records the group-leader PID for shutdown.
start() {
  local label="$1" dir="$2"; shift 2
  ( cd "$dir" && exec "$@" ) > >(sed "s/^/[$label] /") 2>&1 &
  PGIDS+=("$!")
}

echo "==> starting Endhalla stack"

[ "$RUN_BACKEND" = "1" ] && start backend "$ROOT/backend" npm run dev
[ "$RUN_ADMIN" = "1" ]   && start admin   "$ROOT/admin-panel" npm run dev

if [ -n "$APP_ROLE" ]; then
  # Metro for the chosen role (package.json: start:client / start:counsellor)
  [ "$RUN_METRO" = "1" ] && start metro "$ROOT" npm run "start:${APP_ROLE}"

  # Build + install + launch the app once (package.json: <platform>:<role>:testing).
  # Give Metro a moment to bind :8081 first so react-native reuses it instead
  # of spawning its own bundler.
  [ "$RUN_METRO" = "1" ] && sleep 3
  echo "==> building ${APP_PLATFORM} app for '${APP_ROLE}' (npm run ${APP_PLATFORM}:${APP_ROLE}:testing)"
  start "app" "$ROOT" npm run "${APP_PLATFORM}:${APP_ROLE}:testing"
elif [ "$RUN_METRO" = "1" ]; then
  start metro "$ROOT" npm start
fi

echo "==> all services launched. Ctrl+C to stop."

# Block here until Ctrl+C. `wait` is a shell builtin, so the script stays the
# terminal's foreground process group and receives SIGINT directly — the trap
# then fires and `wait` returns. (A `sleep` loop would NOT work under `set -m`:
# each `sleep` becomes its own foreground group and Ctrl+C would never reach
# the script.) A trapped signal makes `wait` return before all children exit.
wait
