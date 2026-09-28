#!/usr/bin/env bash
set -euo pipefail
# No ambient database, credentials or publisher services may enter this test.
if [[ -n "${DATABASE_URL:-}" || -n "${PGHOST:-}" || -n "${PGSERVICE:-}" ]]; then
  echo "Refusing ambient Postgres configuration; run with env -u DATABASE_URL -u PGHOST -u PGSERVICE" >&2
  exit 1
fi
root="$(mktemp -d /tmp/mmhb-social-XXXXXX)"
chmod 700 "$root"
cleanup() {
  pg_ctl -D "$root/data" -m immediate stop >/dev/null 2>&1 || true
  rm -rf -- "$root"
}
trap cleanup EXIT
initdb -D "$root/data" -U social_fixture --auth=trust --no-locale >/dev/null
pg_ctl -D "$root/data" -l "$root/postgres.log" \
  -o "-k $root -c listen_addresses='' -c unix_socket_permissions=0700" -w start >/dev/null
createdb -h "$root" -U social_fixture social_fixture
socket="$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "$root")"
export DATABASE_URL="postgresql://social_fixture@localhost/social_fixture?host=$socket"
export DATABASE_SSL=false NODE_ENV=test TZ=UTC
export JWT_SECRET=isolated-social-console-secret-32-characters
node node_modules/vitest/vitest.mjs run server/tests/social-enterprise-postgres.test.mjs \
  --config server/test.config.mjs