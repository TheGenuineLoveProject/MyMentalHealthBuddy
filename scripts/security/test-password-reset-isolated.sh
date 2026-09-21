#!/usr/bin/env bash
set -euo pipefail
# Run with env -i PATH="$PATH" HOME=/tmp ...; no existing database or dotenv.
if [[ -n "${DATABASE_URL:-}" || -n "${RESEND_API_KEY:-}" ]]; then
  echo "Refusing non-isolated environment" >&2
  exit 1
fi
root="$(mktemp -d /tmp/mmhb-reset-XXXXXX)"
chmod 700 "$root"
cleanup() {
  pg_ctl -D "$root/data" -m immediate stop >/dev/null 2>&1 || true
  rm -rf -- "$root"
}
trap cleanup EXIT
initdb -D "$root/data" -U reset_fixture --auth=trust --no-locale >/dev/null
pg_ctl -D "$root/data" -l "$root/postgres.log" \
  -o "-k $root -c listen_addresses='' -c unix_socket_permissions=0700" -w start >/dev/null
createdb -h "$root" -U reset_fixture reset_fixture
export RESET_TEST_SOCKET="$root" NODE_ENV=test TZ=UTC
export JWT_SECRET=synthetic-fixture-only-secret-32-characters
export PUBLIC_APP_URL=https://reset.example.invalid
exec_status=0
if [[ "${1:-}" == "--restart-timezones" ]]; then
  node --experimental-test-module-mocks tests/auth/password-reset-process.mjs || exec_status=$?
else
  node node_modules/vitest/vitest.mjs run tests/auth/password-reset-isolated.test.mjs \
    --reporter=verbose || exec_status=$?
fi
exit "$exec_status"