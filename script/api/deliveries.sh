#!/usr/bin/env bash
# Delivery operations.
#
# Usage:
#   ./deliveries.sh list [transactionId] [customerId]
#   ./deliveries.sh get <id>
#   ./deliveries.sh create '{"customerId":1,"transactionId":1}'
#   ./deliveries.sh create '{"customerId":1,"transactionId":1,"customerAddressId":2}'

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

CMD="${1:-list}"

case "$CMD" in
  list)
    TRANSACTION_ID="${2:-}"
    CUSTOMER_ID="${3:-}"
    URL="$BASE_URL/deliveries"
    QUERY=""
    [ -n "$TRANSACTION_ID" ] && QUERY="transactionId=$TRANSACTION_ID"
    [ -n "$CUSTOMER_ID" ] && QUERY="${QUERY:+$QUERY&}customerId=$CUSTOMER_ID"
    [ -n "$QUERY" ] && URL="$URL?$QUERY"
    echo "GET $URL"
    _curl "$URL" | _pretty
    ;;

  get)
    ID="${2:?Usage: $0 get <id>}"
    echo "GET $BASE_URL/deliveries/$ID"
    _curl "$BASE_URL/deliveries/$ID" | _pretty
    ;;

  create)
    BODY="${2:?Usage: $0 create '<json>'}"
    echo "POST $BASE_URL/deliveries"
    _curl -X POST -d "$BODY" "$BASE_URL/deliveries" | _pretty
    ;;

  *)
    echo "Unknown command: $CMD"
    echo "Commands: list [transactionId] [customerId] | get <id> | create '<json>'"
    exit 1
    ;;
esac
