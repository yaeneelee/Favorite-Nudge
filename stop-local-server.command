#!/bin/zsh
set -e

PORT=5173
PID="$(lsof -tiTCP:${PORT} -sTCP:LISTEN || true)"

if [[ -z "$PID" ]]; then
  echo "No server is running on port ${PORT}."
  exit 0
fi

echo "Stopping server on port ${PORT}: ${PID}"
kill $PID
echo "Stopped."
