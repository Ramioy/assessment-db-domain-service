#!/usr/bin/env bash
# Transaction operations.
#
# Usage:
#   ./transactions.sh list [customerId]
#   ./transactions.sh get <id>
#   ./transactions.sh create '{"customerId":1,"transactionStatusId":1,"cut":"CUT-001"}'
#   ./transactions.sh update <id> '{"transactionStatusId":2}'

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

CMD="${1:-list}"

case "$CMD" in
  list)
    CUSTOMER_ID="${2:-}"
    if [ -n "$CUSTOMER_ID" ]; then
      URL="$BASE_URL/transactions?customerId=$CUSTOMER_ID"
    else
      URL="$BASE_URL/transactions"
    fi
    echo "GET $URL"
    _curl "$URL" | _pretty
    ;;

  get)
    ID="${2:?Usage: $0 get <id>}"
    echo "GET $BASE_URL/transactions/$ID"
    _curl "$BASE_URL/transactions/$ID" | _pretty
    ;;

  create)
    BODY="${2:?Usage: $0 create '<json>'}"
    echo "POST $BASE_URL/transactions"
    _curl -X POST -d "$BODY" "$BASE_URL/transactions" | _pretty
    ;;

  update)
    ID="${2:?Usage: $0 update <id> '<json>'}"
    BODY="${3:?Usage: $0 update <id> '<json>'}"
    echo "PATCH $BASE_URL/transactions/$ID"
    _curl -X PATCH -d "$BODY" "$BASE_URL/transactions/$ID" | _pretty
    ;;

  *)
    echo "Unknown command: $CMD"
    echo "Commands: list [customerId] | get <id> | create '<json>' | update <id> '<json>'"
    exit 1
    ;;
esac
