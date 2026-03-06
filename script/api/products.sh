#!/usr/bin/env bash
# Product CRUD operations.
#
# Usage:
#   ./products.sh list [categoryId]
#   ./products.sh get <id>
#   ./products.sh create '{"name":"Laptop","categoryId":1}'
#   ./products.sh update <id> '{"name":"Gaming Laptop"}'
#   ./products.sh delete <id>

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

CMD="${1:-list}"

case "$CMD" in
  list)
    CATEGORY_ID="${2:-}"
    if [ -n "$CATEGORY_ID" ]; then
      URL="$BASE_URL/products?categoryId=$CATEGORY_ID"
    else
      URL="$BASE_URL/products"
    fi
    echo "GET $URL"
    _curl "$URL" | _pretty
    ;;

  get)
    ID="${2:?Usage: $0 get <id>}"
    echo "GET $BASE_URL/products/$ID"
    _curl "$BASE_URL/products/$ID" | _pretty
    ;;

  create)
    BODY="${2:?Usage: $0 create '<json>'}"
    echo "POST $BASE_URL/products"
    _curl -X POST -d "$BODY" "$BASE_URL/products" | _pretty
    ;;

  update)
    ID="${2:?Usage: $0 update <id> '<json>'}"
    BODY="${3:?Usage: $0 update <id> '<json>'}"
    echo "PATCH $BASE_URL/products/$ID"
    _curl -X PATCH -d "$BODY" "$BASE_URL/products/$ID" | _pretty
    ;;

  delete)
    ID="${2:?Usage: $0 delete <id>}"
    echo "DELETE $BASE_URL/products/$ID"
    _curl -X DELETE -w "\nHTTP %{http_code}\n" "$BASE_URL/products/$ID"
    ;;

  *)
    echo "Unknown command: $CMD"
    echo "Commands: list [categoryId] | get <id> | create '<json>' | update <id> '<json>' | delete <id>"
    exit 1
    ;;
esac
