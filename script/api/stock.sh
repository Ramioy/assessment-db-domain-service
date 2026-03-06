#!/usr/bin/env bash
# Stock operations (scoped to a product).
#
# Usage:
#   ./stock.sh get <productId>
#   ./stock.sh update <productId> '{"quantity":50}'
#   ./stock.sh update <productId> '{"quantity":50,"description":"Updated via script"}'

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

CMD="${1:-}"

case "$CMD" in
  get)
    PRODUCT_ID="${2:?Usage: $0 get <productId>}"
    echo "GET $BASE_URL/products/$PRODUCT_ID/stock"
    _curl "$BASE_URL/products/$PRODUCT_ID/stock" | _pretty
    ;;

  update)
    PRODUCT_ID="${2:?Usage: $0 update <productId> '<json>'}"
    BODY="${3:?Usage: $0 update <productId> '<json>'}"
    echo "PATCH $BASE_URL/products/$PRODUCT_ID/stock"
    _curl -X PATCH -d "$BODY" "$BASE_URL/products/$PRODUCT_ID/stock" | _pretty
    ;;

  *)
    echo "Unknown command: ${CMD:-<none>}"
    echo "Commands: get <productId> | update <productId> '<json>'"
    exit 1
    ;;
esac
