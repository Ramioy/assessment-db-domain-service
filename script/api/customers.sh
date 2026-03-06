#!/usr/bin/env bash
# Customer CRUD operations.
#
# Usage:
#   ./customers.sh list
#   ./customers.sh get <id>
#   ./customers.sh create '{"customerDocumentTypeId":1,"documentNumber":"1234567890","email":"john@example.com"}'
#   ./customers.sh update <id> '{"contactPhone":"+57 300 000 0000","address":"Calle 1 #2-3"}'
#   ./customers.sh delete <id>

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

CMD="${1:-list}"

case "$CMD" in
  list)
    echo "GET $BASE_URL/customers"
    _curl "$BASE_URL/customers" | _pretty
    ;;

  get)
    ID="${2:?Usage: $0 get <id>}"
    echo "GET $BASE_URL/customers/$ID"
    _curl "$BASE_URL/customers/$ID" | _pretty
    ;;

  create)
    BODY="${2:?Usage: $0 create '<json>'}"
    echo "POST $BASE_URL/customers"
    _curl -X POST -d "$BODY" "$BASE_URL/customers" | _pretty
    ;;

  update)
    ID="${2:?Usage: $0 update <id> '<json>'}"
    BODY="${3:?Usage: $0 update <id> '<json>'}"
    echo "PATCH $BASE_URL/customers/$ID"
    _curl -X PATCH -d "$BODY" "$BASE_URL/customers/$ID" | _pretty
    ;;

  delete)
    ID="${2:?Usage: $0 delete <id>}"
    echo "DELETE $BASE_URL/customers/$ID"
    _curl -X DELETE -w "\nHTTP %{http_code}\n" "$BASE_URL/customers/$ID"
    ;;

  *)
    echo "Unknown command: $CMD"
    echo "Commands: list | get <id> | create '<json>' | update <id> '<json>' | delete <id>"
    exit 1
    ;;
esac
