#!/usr/bin/env bash
# Payment Transaction operations.
#
# Usage:
#   ./payment-transactions.sh list
#   ./payment-transactions.sh get <uuid>
#   ./payment-transactions.sh get-by-reference <reference>
#   ./payment-transactions.sh get-by-provider-id <providerId>
#   ./payment-transactions.sh create '{"id":"...","reference":"ref-001","amountInCents":10000,"currency":"COP","paymentMethod":"CARD","customerEmail":"c@example.com","signature":"sig"}'
#   ./payment-transactions.sh update-status <uuid> '{"status":"APPROVED","providerId":"prov-123"}'

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

CMD="${1:-list}"

case "$CMD" in
  list)
    echo "GET $BASE_URL/payment-transactions"
    _curl "$BASE_URL/payment-transactions" | _pretty
    ;;

  get)
    ID="${2:?Usage: $0 get <uuid>}"
    echo "GET $BASE_URL/payment-transactions/$ID"
    _curl "$BASE_URL/payment-transactions/$ID" | _pretty
    ;;

  get-by-reference)
    REF="${2:?Usage: $0 get-by-reference <reference>}"
    echo "GET $BASE_URL/payment-transactions/by-reference/$REF"
    _curl "$BASE_URL/payment-transactions/by-reference/$REF" | _pretty
    ;;

  get-by-provider-id)
    PROV_ID="${2:?Usage: $0 get-by-provider-id <providerId>}"
    echo "GET $BASE_URL/payment-transactions/by-provider-id/$PROV_ID"
    _curl "$BASE_URL/payment-transactions/by-provider-id/$PROV_ID" | _pretty
    ;;

  create)
    BODY="${2:?Usage: $0 create '<json>'}"
    echo "POST $BASE_URL/payment-transactions"
    _curl -X POST -d "$BODY" "$BASE_URL/payment-transactions" | _pretty
    ;;

  update-status)
    ID="${2:?Usage: $0 update-status <uuid> '<json>'}"
    BODY="${3:?Usage: $0 update-status <uuid> '<json>'}"
    echo "PATCH $BASE_URL/payment-transactions/$ID/status"
    _curl -X PATCH -d "$BODY" "$BASE_URL/payment-transactions/$ID/status" | _pretty
    ;;

  *)
    echo "Unknown command: $CMD"
    echo "Commands: list | get <uuid> | get-by-reference <ref> | get-by-provider-id <id> | create '<json>' | update-status <uuid> '<json>'"
    exit 1
    ;;
esac
