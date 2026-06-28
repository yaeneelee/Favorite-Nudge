#!/bin/zsh
set -e

cd "$(dirname "$0")"

PORT=5173
LOG_FILE="vite.log"

EXISTING_PID="$(lsof -tiTCP:${PORT} -sTCP:LISTEN || true)"

if [[ -n "$EXISTING_PID" ]]; then
  echo "Stopping existing server on port ${PORT}: ${EXISTING_PID}"
  kill $EXISTING_PID || true
  sleep 1
fi

echo "Starting MINI Tab preview on http://localhost:${PORT}/"
nohup npm run dev -- --host localhost --port ${PORT} < /dev/null > "${LOG_FILE}" 2>&1 &

sleep 2

RUNNING_PID="$(lsof -tiTCP:${PORT} -sTCP:LISTEN || true)"

if [[ -z "$RUNNING_PID" ]]; then
  echo "Server failed to start. Recent log:"
  tail -n 80 "${LOG_FILE}" || true
  exit 1
fi

echo "Server is running."
echo "URL: http://localhost:${PORT}/"
echo "PID: ${RUNNING_PID}"
echo "Log: $(pwd)/${LOG_FILE}"
