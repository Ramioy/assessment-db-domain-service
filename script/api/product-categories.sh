#!/usr/bin/env bash
# Product Category CRUD operations.
#
# Usage:
#   ./product-categories.sh list
#   ./product-categories.sh get <id>
#   ./product-categories.sh create '{"name":"Electronics","description":"Electronic devices"}'
#   ./product-categories.sh update <id> '{"name":"Gadgets"}'
#   ./product-categories.sh delete <id>

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

CMD="${1:-list}"

case "$CMD" in
  list)
    echo "GET $BASE_URL/product-categories"
    _curl "$BASE_URL/product-categories" | _pretty
    ;;

  get)
    ID="${2:?Usage: $0 get <id>}"
    echo "GET $BASE_URL/product-categories/$ID"
    _curl "$BASE_URL/product-categories/$ID" | _pretty
    ;;

  create)
    BODY="${2:?Usage: $0 create '<json>'}"
    echo "POST $BASE_URL/product-categories"
    _curl -X POST -d "$BODY" "$BASE_URL/product-categories" | _pretty
    ;;

  update)
    ID="${2:?Usage: $0 update <id> '<json>'}"
    BODY="${3:?Usage: $0 update <id> '<json>'}"
    echo "PATCH $BASE_URL/product-categories/$ID"
    _curl -X PATCH -d "$BODY" "$BASE_URL/product-categories/$ID" | _pretty
    ;;

  delete)
    ID="${2:?Usage: $0 delete <id>}"
    echo "DELETE $BASE_URL/product-categories/$ID"
    _curl -X DELETE -w "\nHTTP %{http_code}\n" "$BASE_URL/product-categories/$ID"
    ;;

  *)
    echo "Unknown command: $CMD"
    echo "Commands: list | get <id> | create '<json>' | update <id> '<json>' | delete <id>"
    exit 1
    ;;
esac
