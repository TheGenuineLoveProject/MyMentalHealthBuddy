#!/usr/bin/env python3
"""Exercise the R12 child runner with inert local Vite/PostCSS stubs.

Run: python3 source_review/test-frontend-runner-r12.py

Only Python's standard library and an existing Node executable are required.
No package install, network request, application startup, database connection,
or actual Vite compilation occurs. Temporary fixtures are removed on exit.
"""

import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile


RUNNER = Path(__file__).with_name("frontend-candidate-runner-r12.mjs")
ROOT_DECLARATION = "const ROOT = '/home/runner/workspace';"
EXPECTED_CODES = {
    "success": None,
    "no_css": "CSS_NOT_EMITTED",
    "bad_env": "RESOLVED_ENV_OR_CONFIG_LOADING_CHANGED",
    "bad_plugin": "ROOT_CONFIG_PLUGIN_SHAPE_CHANGED",
    "bad_output": "UNSUPPORTED_OUTPUT_PATH",
    "no_graph": "MODULE_GRAPH_UNAVAILABLE",
}

VITE_STUB = r"""
import fs from 'node:fs';
import path from 'node:path';

export async function build(config) {
  const mode = __FIXTURE_MODE__;
  // Check the child API request before simulating a resolved configuration.
  if (config.configFile !== false || config.envFile !== false || config.envDir !== false
      || config.build.emptyOutDir !== false || config.mode !== 'production'
      || config.clearScreen !== false || config.plugins.length !== 3
      || config.plugins[0].name !== 'react'
      || config.plugins[0].fixturePreserved !== true
      || config.css.postcss.plugins[0].postcssPlugin !== '@tailwindcss/postcss'
      || config.css.postcss.plugins[1].postcssPlugin !== 'autoprefixer'
      || config.plugins[1].options.open !== false
      || config.plugins[1].options.template !== 'treemap'
      || config.plugins[1].options.gzipSize !== true
      || config.plugins[1].options.brotliSize !== true
      || path.dirname(config.plugins[1].options.filename) !== path.dirname(config.build.outDir)
      || path.dirname(config.cacheDir) !== path.dirname(config.build.outDir)) {
    throw Object.assign(new Error('STUB_API_CONTRACT_MISMATCH'), { code: 'STUB_API_CONTRACT_MISMATCH' });
  }
  const plugin = config.plugins.at(-1);
  const resolved = {
    ...config,
    command: 'build', isProduction: true, configFile: undefined,
    inlineConfig: config,
    build: { ...config.build, write: true, ssr: false },
    envDir: mode === 'bad_env' ? '/invalid-env-directory' : false,
  };
  plugin.configResolved(resolved);
  const bundle = {
    'index.html': {
      fileName: 'index.html', type: 'asset',
      source: '<!doctype html><script type="module" src="/assets/a.js"></script>',
    },
    'assets/a.js': {
      fileName: 'assets/a.js', type: 'chunk', code: 'export{}', isEntry: true,
      imports: [], dynamicImports: [], referencedFiles: [],
      viteMetadata: { importedCss: new Set(['assets/a.css']), importedAssets: new Set() },
    },
  };
  if (mode !== 'no_css') {
    bundle['assets/a.css'] = {
      fileName: 'assets/a.css', type: 'asset',
      source: '.flex{display:flex}html{color:black}',
    };
  }
  if (mode === 'bad_output') {
    bundle['../bad'] = { fileName: '../bad', type: 'asset', source: 'bad' };
  }
  const context = {
    getWatchFiles: () => [config.root + '/index.html'],
    getModuleIds: () => mode === 'no_graph' ? [] : [config.root + '/main.jsx'],
    getModuleInfo: () => ({ importedIds: [], dynamicallyImportedIds: [], isEntry: true }),
  };
  plugin.generateBundle.call(context, {}, bundle);
  for (const item of Object.values(bundle)) {
    const file = path.join(config.build.outDir, item.fileName);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, item.source || item.code);
  }
  plugin.writeBundle.call(context, {}, bundle);
}
"""


def write(root, name, content):
    destination = root / name
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(content, encoding="utf-8")


def snapshot(root):
    return {
        str(p.relative_to(root)): (
            hashlib.sha256(p.read_bytes()).hexdigest(), p.stat().st_mode & 0o777
        )
        for p in root.rglob("*") if p.is_file()
    }


def run_case(source, node, mode):
    with tempfile.TemporaryDirectory(prefix="mmhb-runner-fixture-", dir="/tmp") as base, \
            tempfile.TemporaryDirectory(prefix="mmhb-runner-report-", dir="/tmp") as report_name:
        root = Path(base) / "workspace"
        root.mkdir()
        report = Path(report_name)
        report.chmod(0o700)
        write(root, "package.json", '{"type":"module"}')
        write(root, ".env.fixture", "PRIVATE_FIXTURE_CANARY=must-not-be-disclosed\n")
        original_config = {
            "plugins": [
                {"name": "react", "fixturePreserved": True},
                {"name": "bad" if mode == "bad_plugin" else "visualizer"},
            ],
            "root": str(root / "client"),
            "build": {"rollupOptions": {"input": str(root / "client/index.html")}},
            "define": {"process.env.NODE_ENV": '"production"'},
        }
        write(root, "vite.config.js", "export default " + json.dumps(original_config) + ";\n")
        modules = {
            "rollup-plugin-visualizer": "export const visualizer = options => ({name:'visualizer',options});",
            "@tailwindcss/postcss": "export default function(){return {postcssPlugin:'@tailwindcss/postcss'}}",
            "autoprefixer": "export default function(){return {postcssPlugin:'autoprefixer'}}",
            "vite": VITE_STUB.replace("__FIXTURE_MODE__", json.dumps(mode)),
        }
        for name, module in modules.items():
            write(root, "node_modules/" + name + "/package.json", '{"type":"module","main":"index.js"}')
            write(root, "node_modules/" + name + "/index.js", module)
        adapted = source.replace(ROOT_DECLARATION, "const ROOT = " + json.dumps(str(root)) + ";")
        write(root, "runner.mjs", adapted)
        before = snapshot(root)
        completed = subprocess.run(
            [node, str(root / "runner.mjs"), str(report)], cwd=root,
            env={"PATH": os.path.dirname(node) + ":/usr/bin:/bin", "NODE_ENV": "production", "LANG": "C"},
            capture_output=True, text=True, timeout=20,
        )
        expected = EXPECTED_CODES[mode]
        assert completed.returncode == (0 if expected is None else 1), (mode, completed.stdout, completed.stderr)
        assert snapshot(root) == before, (mode, "fixture workspace modified")
        assert "must-not-be-disclosed" not in completed.stdout + completed.stderr
        assert str(root) not in completed.stdout, (mode, "raw root disclosed")
        assert str(report) not in completed.stdout, (mode, "raw report path disclosed")
        if expected is None:
            assert "FRONTEND_RUNNER_STATUS=COMPILED_CANDIDATE_NOT_RELEASE" in completed.stdout
            assert not (report / "frontend-runner-error.json").exists()
            evidence = json.loads((report / "frontend-build-evidence.json").read_text())
            graph = json.loads((report / "frontend-graph.json").read_text())
            assert evidence["compilerInvocations"] == 1
            assert evidence["moduleCount"] == 1 and evidence["watchFileCount"] == 1
            assert graph["capturedAt"] == ["generateBundle", "writeBundle"]
            assert evidence["resolvedConfig"]["envDir"] is False
            assert evidence["resolvedConfig"]["configFile"] is None
            assert evidence["cssDiagnostics"][0]["hasFlexDeclaration"]
            assert evidence["cssDiagnostics"][0]["directiveResidueCandidates"] == 0
            assert {item["fileName"] for item in evidence["emitted"]} == {"index.html", "assets/a.js", "assets/a.css"}
            for filename in ["frontend-build-evidence.json", "frontend-graph.json"]:
                assert (report / filename).stat().st_mode & 0o777 == 0o600
        else:
            assert "CODE=" + expected in completed.stdout, (mode, completed.stdout)
            error_file = report / "frontend-runner-error.json"
            assert error_file.stat().st_mode & 0o777 == 0o600
            assert json.loads(error_file.read_text())["code"] == expected
            assert not (report / "frontend-build-evidence.json").exists()
        if mode == "bad_output":
            assert not (report / "bad").exists(), "Traversal output was written before rejection"
        return {"case": mode, "result": "PASS", "expectedCode": expected}


def main():
    source = RUNNER.read_text(encoding="utf-8")
    assert source.count(ROOT_DECLARATION) == 1, "Runner root declaration changed; review fixture adapter"
    node = shutil.which("node")
    assert node, "An existing Node executable is required; this suite does not install one"
    result = [run_case(source, node, mode) for mode in EXPECTED_CODES]
    print(json.dumps({
        "suite": "MMHB_R12_CHILD_RUNNER_STUB_FIXTURES",
        "runnerSha256": hashlib.sha256(source.encode()).hexdigest(),
        "cases": result,
        "totalPassed": len(result),
        "actualViteCompilation": "NOT_RUN_STUBS_ONLY",
        "packageInstall": 0, "networkRequests": 0, "applicationStarted": 0,
    }, indent=2))


if __name__ == "__main__":
    main()
