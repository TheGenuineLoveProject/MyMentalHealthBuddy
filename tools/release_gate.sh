#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== Release Gate: TheGenuineLoveProject =="
echo "Repo: $ROOT"
echo

have_cmd() { command -v "$1" >/dev/null 2>&1; }
have_file() { [ -f "$1" ]; }

run_if() {
  local label="$1"; shift
  echo "== $label =="
  if "$@"; then
    echo "OK: $label"
  else
    echo "FAIL: $label"
    return 1
  fi
  echo
}

detect_node_pm() {
  if have_file "pnpm-lock.yaml" && have_cmd pnpm; then echo "pnpm"; return; fi
  if have_file "yarn.lock" && have_cmd yarn; then echo "yarn"; return; fi
  if have_file "package-lock.json" && have_cmd npm; then echo "npm_ci"; return; fi
  if have_file "package.json" && have_cmd npm; then echo "npm"; return; fi
  echo ""
}

run_node_script_if_exists() {
  local script="$1"
  if node -e "const p=require('./package.json'); process.exit((p.scripts&&p.scripts['$script'])?0:1)" >/dev/null 2>&1; then
    run_if "npm run $script" npm run -s "$script"
  else
    echo "SKIP: npm run $script (script missing)"
    echo
  fi
}

run_python_if_present() {
  if have_file "pyproject.toml" || have_file "requirements.txt"; then
    echo "== Python detected =="
    if have_cmd python; then python --version; fi
    if have_file "requirements.txt"; then
      run_if "pip install -r requirements.txt" python -m pip install -r requirements.txt
    fi
    if have_cmd pytest; then
      run_if "pytest" pytest -q
    else
      echo "SKIP: pytest not installed"
      echo
    fi
  fi
}

PM="$(detect_node_pm)"

if [ -n "$PM" ]; then
  echo "== Node project detected ($PM) =="
  if [ "$PM" = "pnpm" ]; then
    run_if "pnpm install" pnpm install
    run_node_script_if_exists lint
    run_node_script_if_exists typecheck
    run_node_script_if_exists test
    run_node_script_if_exists build
  elif [ "$PM" = "yarn" ]; then
    run_if "yarn install" yarn install --frozen-lockfile || yarn install
    run_node_script_if_exists lint
    run_node_script_if_exists typecheck
    run_node_script_if_exists test
    run_node_script_if_exists build
  elif [ "$PM" = "npm_ci" ]; then
    run_if "npm ci" npm ci
    run_node_script_if_exists lint
    run_node_script_if_exists typecheck
    run_node_script_if_exists test
    run_node_script_if_exists build
  else
    run_if "npm install" npm install
    run_node_script_if_exists lint
    run_node_script_if_exists typecheck
    run_node_script_if_exists test
    run_node_script_if_exists build
  fi

  if have_file "tools/env_audit.mjs"; then
    run_if "env audit" node tools/env_audit.mjs
  fi

  if have_file "tools/link_scan.mjs"; then
    run_if "link scan" node tools/link_scan.mjs
  fi
else
  echo "== No package.json detected (skipping Node gates) =="
  echo
fi

run_python_if_present

echo "== RELEASE GATE: PASS =="
