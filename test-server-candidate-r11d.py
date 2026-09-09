"""R11D full-driver controls using a pinned, inert compiler stand-in.

No MMHB code or native bindings execute. These fixtures qualify orchestration,
input provenance and refusal behavior, not esbuild or application runtime.
All driver adaptations occur in a temporary copy only.
"""
from pathlib import Path
import hashlib
import json
import os
import re
import subprocess
import tempfile

HERE = Path(__file__).resolve().parent
DRIVER = HERE / "server-candidate-driver-r11d.mjs"
NODE_VERSION = subprocess.check_output(["node", "--version"], text=True).strip()
SENTINEL = "MMHB_FIXTURE_INHERITED_SECRET_MUST_NOT_REACH_CHILD"


def hash_sources(base):
    """Read the exact reviewed public # paths from the driver, never widen them."""
    paths = sorted(set(re.findall(r"[\"'](node_modules/es5-ext/[^\"'\n]*#[^\"'\n]*\.js)[\"']", base)))
    assert len(paths) == 4, ("expected four reviewed # source literals", paths)
    return paths



def sha(data):
    return hashlib.sha256(data).hexdigest()


def git(root, *args):
    return subprocess.check_output(
        ["git", *args], cwd=root, text=True, stderr=subprocess.DEVNULL
    ).strip()


def write(root, name, content, mode=0o644):
    target = root / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content)
    target.chmod(mode)


def snapshot(root):
    """Raw byte/mode snapshot; never invoke Git filters or app code."""
    result = {}
    for target in sorted(root.rglob("*")):
        if ".git" in target.relative_to(root).parts:
            continue
        if target.is_symlink():
            result[str(target.relative_to(root))] = ("link", os.readlink(target))
        elif target.is_file():
            result[str(target.relative_to(root))] = (
                sha(target.read_bytes()), target.stat().st_mode & 0o777
            )
    return result


def compiler_stub(mode="success", sources=()):
    """Executable stand-in accepts esbuild CLI flags and writes a real metafile."""
    return "#!/usr/bin/python3\n" + r'''
import json, os, pathlib, sys, subprocess
MODE = __MODE__
HASH_SOURCES = __HASH_SOURCES__
if any("MMHB_FIXTURE_INHERITED_SECRET_MUST_NOT_REACH_CHILD" in v for v in os.environ.values()):
    print("FIXTURE_CHILD_SECRET_LEAK", file=sys.stderr)
    sys.exit(97)
if "--version" in sys.argv:
    print("0.28.2")
    sys.exit(0)
def arg(name):
    for i, value in enumerate(sys.argv):
        if value.startswith(name + "="):
            return value[len(name) + 1:]
        if value == name and i + 1 < len(sys.argv):
            return sys.argv[i + 1]
    return None
if MODE == "build_failure":
    print("SYNTHETIC_COMPILER_FAILURE", file=sys.stderr)
    sys.exit(3)
metafile = arg("--metafile")
outfile = arg("--outfile")
assert metafile and outfile, "fixture expected esbuild output and metafile flags"
counter = pathlib.Path(metafile).parent / "fixture-build-count.json"
pass_number = (int(counter.read_text()) if counter.exists() else 0) + 1
counter.write_text(str(pass_number))
counter.chmod(0o600)
root = pathlib.Path.cwd()
inputs = {
    str(p.relative_to(root)): {"bytes": p.stat().st_size, "imports": []}
    for p in sorted((root / "server").rglob("*.mjs"))
}
for name in (HASH_SOURCES[:1] if MODE == "hash_subset" else HASH_SOURCES):
    p = root / name
    inputs[name] = {"bytes": p.stat().st_size, "imports": []}
if MODE == "hash_source_drift" and pass_number == 2:
    p = root / HASH_SOURCES[0]
    p.write_text(p.read_text() + "// SYNTHETIC_CONCURRENT_HASH_SOURCE_EDIT\n")
if MODE == "unrelated_drift" and pass_number == 2:
    p = root / "untracked.txt"
    p.write_text(p.read_text() + "SYNTHETIC_CONCURRENT_UNRELATED_EDIT\n")
if MODE == "new_input" and pass_number == 2:
    inputs["node_modules/fixture-new-input.js"] = {"bytes": 1, "imports": []}
if MODE == "raw_index_drift" and pass_number == 2:
    p = root / "server/app.mjs"
    stat = p.stat()
    os.utime(p, (stat.st_atime, stat.st_mtime + 5))
    subprocess.run(["/usr/bin/git", "update-index", "--refresh"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
if MODE == "unsupported_hash":
    inputs["node_modules/elsewhere/#/unreviewed.js"] = {"bytes": 1, "imports": []}
if MODE == "private":
    inputs[".env.fixture"] = {"bytes": 1, "imports": []}
if MODE == "missing_r9":
    inputs.pop("server/security/csrf.mjs", None)
if MODE == "escape":
    inputs["/etc/passwd"] = {"bytes": 1, "imports": []}
if MODE == "private_resolution":
    inputs["node_modules/fixture-private-link.js"] = {"bytes": 1, "imports": []}
if MODE == "source_drift" and pass_number == 2:
    p = root / "server/security/csrf.mjs"
    p.write_text(p.read_text() + "// SYNTHETIC_CONCURRENT_EDIT\n")
output = pathlib.Path(outfile)
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text("// SYNTHETIC_UNEXECUTED_SERVER_BUNDLE\n")
if MODE == "nonrepeatable" and pass_number == 2:
    output.write_text("// SYNTHETIC_DIFFERENT_SECOND_BUNDLE\n")
meta = {
    "inputs": inputs,
    "outputs": {
        str(output): {
            "bytes": output.stat().st_size,
            "entryPoint": "server/app.mjs",
            "imports": [],
            "exports": [],
            "inputs": {name: {"bytesInOutput": 1} for name in inputs},
        }
    },
}
if MODE == "empty_outputs":
    meta["outputs"] = {}
pathlib.Path(metafile).write_text(json.dumps(meta))
'''.replace("__MODE__", repr(mode)).replace("__HASH_SOURCES__", repr(list(sources)))


def setup(base, mode="success"):
    match = re.search(r"const PINS = (\{.*?\n\});", base, re.S)
    assert match, "driver PINS interface changed"
    real_pins = json.loads(match.group(1))
    root = Path(tempfile.mkdtemp(prefix="mmhb-r11d-fixture-"))
    for name in real_pins:
        if name.endswith(".json"):
            content = "{}\n"
        elif name.endswith(".sql"):
            content = "-- INERT_SYNTHETIC_SQL_NOT_EXECUTED\n"
        elif name.endswith(".html"):
            content = "<html>SYNTHETIC_EXISTING_OUTPUT " + name + "</html>\n"
        else:
            content = "// SYNTHETIC_FIXTURE " + name + "\n"
        write(root, name, content)
    write(root, "package.json", json.dumps({
        "name": "mmhb-inert-fixture", "type": "module",
        "engines": {"node": ">=24 <25"},
        "scripts": {"build": "vite build", "start": "node server/app.mjs"},
        "dependencies": {"esbuild": "^0.28.0", "bcrypt": "^6.0.0"},
        "devDependencies": {"@vitejs/plugin-react": "^6.0.1"},
    }))
    packages = {
        "esbuild": "0.28.2", "bcrypt": "6.0.0", "node-gyp-build": "4.8.4",
        "@vitejs/plugin-react": "6.1.1", "typescript": "6.0.3",
    }
    lock_packages = {}
    for name, version in packages.items():
        write(root, "node_modules/" + name + "/package.json", json.dumps({
            "name": name, "version": version, "main": "index.js",
        }))
        lock_packages["node_modules/" + name] = {
            "version": "6.1.0" if name == "@vitejs/plugin-react" else version
        }
    write(root, "package-lock.json", json.dumps({
        "name": "mmhb-inert-fixture", "lockfileVersion": 3, "packages": lock_packages,
    }))
    write(root, "tsconfig.json", json.dumps({"compilerOptions": {"allowJs": True}}))
    write(root, "node_modules/esbuild/bin/esbuild", (
        "#!/mmhb-nonexistent-fixture-interpreter\n" if mode == "missing_interpreter"
        else compiler_stub(mode, hash_sources(base))), 0o755)
    write(root, "node_modules/bcrypt/index.js", "throw new Error('NATIVE_MUST_NOT_EXECUTE');\n")
    write(root, "node_modules/bcrypt/prebuilds/linux-x64/bcrypt.glibc.node", "INERT_NATIVE_FIXTURE\n")
    write(root, "node_modules/node-gyp-build/index.js", "throw new Error('NATIVE_MUST_NOT_EXECUTE');\n")
    write(root, "server/app.mjs", "throw new Error('APPLICATION_MUST_NOT_EXECUTE');\n")
    for name in hash_sources(base):
        write(root, name, "// INERT_REVIEWED_HASH_PATH_FIXTURE " + name + "\n")
    write(root, ".gitignore", "node_modules/\ndist/\nclient/dist/\nbundle-report.html\n.env*\n")
    write(root, "untracked.txt", "PRESERVE_UNRELATED_UNTRACKED_BYTES\n")
    git(root, "init", "-q", "-b", "integration")
    git(root, "add", ".")
    git(root, "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid",
        "-c", "commit.gpgsign=false", "commit", "-qm", "inert server candidate fixture")
    (root / "untracked.txt").write_text("PRESERVE_UNRELATED_UNTRACKED_BYTES_AFTER_COMMIT\n")
    return root, {name: sha((root / name).read_bytes()) for name in real_pins}


def adapted_driver(base, root, pins):
    src = re.sub(r"const PINS = \{.*?\n\};", "const PINS = " + json.dumps(pins) + ";", base, count=1, flags=re.S)
    replacements = {
        "EXPECTED_ROOT": str(root),
        "EXPECTED_HEAD": git(root, "rev-parse", "HEAD"),
        "EXPECTED_NODE": NODE_VERSION,
    }
    for name, value in replacements.items():
        src, count = re.subn(r"const " + name + r" = '[^']*';", "const " + name + " = " + json.dumps(value) + ";", src, count=1)
        assert count == 1, "driver constant changed: " + name
    return src


def run_case(label, mode="success", edit=None, expected_gate=None, allowed_changes=(),
             expected_runs=None, expected_attempts=None, intercept_private_read=False,
             intercept_native_copy=False, final_write_error=None, index_changes=False):
    base = DRIVER.read_text()
    root, pins = setup(base, mode)
    adapted = adapted_driver(base, root, pins)
    if intercept_private_read:
        # On a disposable driver copy, detect contents access before privacy refusal.
        marker = "const ROOT = fs.realpathSync('.');"
        assert adapted.count(marker) == 1
        adapted = adapted.replace(marker, marker + "\n" + r"""
const originalFixtureOpen = fs.openSync;
fs.openSync = function(file, ...args) {
  if (String(file).endsWith('/.env.fixture')) throw Object.assign(new Error('FIXTURE_PRIVATE_CONTENT_OPENED'), {gate:'FIXTURE_PRIVATE_CONTENT_OPENED'});
  return originalFixtureOpen.call(fs, file, ...args);
};
""", 1)
    if intercept_native_copy:
        marker = "const ROOT = fs.realpathSync('.');"
        assert adapted.count(marker) == 1
        adapted = adapted.replace(marker, marker + "\n" + r"""
const originalFixtureCopy = fs.copyFileSync;
let fixtureNativeCopyModified = false;
fs.copyFileSync = function(source, target, ...args) {
  const copied = originalFixtureCopy.call(fs, source, target, ...args);
  if (!fixtureNativeCopyModified && String(source).endsWith('/node_modules/bcrypt/index.js')) {
    fixtureNativeCopyModified = true;
    fs.appendFileSync(source, '// SYNTHETIC_NATIVE_SOURCE_DRIFT\n');
  }
  return copied;
};
""", 1)
    if final_write_error:
        marker = "const ROOT = fs.realpathSync('.');"
        assert adapted.count(marker) == 1
        injected = r"""
const originalFixtureWrite = fs.writeFileSync;
fs.writeFileSync = function(file, ...args) {
  if (String(file).endsWith('/server-candidate-evidence.json')) {
    throw Object.assign(new Error('MMHB_FIXTURE_INHERITED_SECRET_MUST_NOT_REACH_CHILD'),
      {code: __FINAL_WRITE_CODE__, syscall: 'open', path: String(file)});
  }
  return originalFixtureWrite.call(fs, file, ...args);
};
""".replace("__FINAL_WRITE_CODE__", json.dumps(final_write_error))
        adapted = adapted.replace(marker, marker + "\n" + injected, 1)
    if edit:
        edit(root)
    before = snapshot(root)
    env = {**os.environ, "NODE_OPTIONS": "", "NODE_DISABLE_COMPILE_CACHE": "1",
           "GIT_OPTIONAL_LOCKS": "0", "DATABASE_URL": SENTINEL,
           "OPENAI_API_KEY": SENTINEL, "MMHB_FIXTURE_SECRET": SENTINEL}
    execution = subprocess.run(
        ["node", "--input-type=module"], input=adapted, cwd=root,
        capture_output=True, text=True, timeout=30, env=env,
    )
    output = execution.stdout + execution.stderr
    assert SENTINEL not in output, (label, "parent secret disclosed")
    assert "APPLICATION_MUST_NOT_EXECUTE" not in output, (label, "app executed")
    assert "NATIVE_MUST_NOT_EXECUTE" not in output, (label, "native module executed")
    start = execution.stdout.find("\n{")
    assert start >= 0, (label, "no JSON result", output[-4000:])
    evidence, _ = json.JSONDecoder().raw_decode(execution.stdout[start + 1:])
    after = snapshot(root)
    if expected_attempts is not None:
        assert evidence["buildAttempts"] == expected_attempts, (label, evidence)
    if expected_runs is not None:
        assert evidence["buildProcessesStarted"] == expected_runs, (label, evidence)
    changed = {name for name in set(before) | set(after) if before.get(name) != after.get(name)}
    assert changed == set(allowed_changes), (label, "unexpected workspace mutation", changed)
    if expected_gate:
        assert execution.returncode == 1, (label, output[-4000:])
        assert evidence["status"] == "SERVER_CANDIDATE_FAILED", (label, evidence)
        assert evidence["failure"]["gate"] == expected_gate, (label, evidence)
    else:
        assert execution.returncode == 0, (label, output[-4000:])
        assert evidence["status"] == "SERVER_CANDIDATE_ONLY_NOT_RELEASE", (label, evidence)
        assert evidence["buildProcessesStarted"] == 2
        assert evidence["preservation"] == "OBSERVED_INPUTS_AND_GIT_STATE_PRESERVED"
        assert evidence["schema"]["sha256"] == pins["server/db/schema.canonical.sql"]
        assert evidence["requiredAuthInputs"]["server/security/csrf.mjs"] == pins["server/security/csrf.mjs"]
        assert evidence["nativeFiles"] >= 4
        assert evidence["contract"]["appExecution"] is False
        assert evidence["contract"]["nativeLoadTest"] is False
        assert evidence["frontendDependency"]["installed"] == "6.1.1"
        assert evidence["frontendDependency"]["locked"] == "6.1.0"
        reports = re.findall(r"^REPORT_DIRECTORY=(.+)$", execution.stdout, re.M)
        report = Path(reports[-1])
        manifest = json.loads((report / "inputs-before-final-build.json").read_text())
        assert manifest["records"]["server/security/csrf.mjs"]["sha256"] == pins["server/security/csrf.mjs"]
        native = json.loads((report / "native-copy-manifest.json").read_text())
        for row in native:
            assert sha((report / "candidate" / row["file"]).read_bytes()) == row["sha256"]
        assert sha((report / "candidate/schema.canonical.sql").read_bytes()) == pins["server/db/schema.canonical.sql"]
        assert not (report / "candidate/client/dist/index.html").exists()
    if not allowed_changes and not index_changes:
        assert evidence.get("preservation") == "OBSERVED_INPUTS_AND_GIT_STATE_PRESERVED", (label, evidence)
    assert not (root / "FILTER_EXECUTED").exists(), label
    reports = re.findall(r"^REPORT_DIRECTORY=(.+)$", execution.stdout, re.M)
    if reports:
        evidence["_fixture_report"] = reports[-1]
        report = Path(reports[-1])
        if final_write_error:
            assert not (report / "server-candidate-evidence.json").exists(), (label, "summary unexpectedly saved")
            assert evidence["evidenceWrite"] == "FAILED", evidence
            assert evidence["failure"]["phase"] == "FINAL_EVIDENCE_WRITE", evidence
            assert evidence["failure"]["errorCode"] == final_write_error, evidence
            assert evidence["failure"]["detail"]["syscall"] == "open", evidence
            assert evidence["failure"]["detail"]["file"] == "REPORT/server-candidate-evidence.json", evidence
        else:
            assert evidence["evidenceWrite"] == "SAVED", evidence
            assert (report / "server-candidate-evidence.json").stat().st_mode & 0o777 == 0o600
        for name in ("worktree-before.json", "worktree-after.json", "worktree-comparison.json"):
            assert (report / name).is_file(), (label, "snapshot evidence missing", name)
            assert (report / name).stat().st_mode & 0o777 == 0o600, (label, "snapshot mode", name)
        before_saved = json.loads((report / "worktree-before.json").read_text())
        after_saved = json.loads((report / "worktree-after.json").read_text())
        comparison = json.loads((report / "worktree-comparison.json").read_text())
        assert isinstance(before_saved["records"], list) and len(before_saved["records"]) > 0
        assert isinstance(after_saved["records"], list)
        assert comparison == evidence["currentPreservation"], (label, "saved vs printed difference mismatch")
        tracked_changes = {name for name in allowed_changes if not name.startswith("node_modules/")}
        assert {row["file"] for row in comparison["changes"]} == tracked_changes, (label, comparison)
        assert evidence["historicalR11APreservation"] == "UNRESOLVED_INITIAL_SNAPSHOT_NOT_RETAINED", (label, "history upgraded")
        if not allowed_changes and not index_changes:
            assert before_saved == after_saved, (label, "saved snapshots differ despite no edits")
        if index_changes:
            assert comparison["rawIndexOnly"] is True, (label, comparison)
            assert comparison["components"] == ["index"]
            assert before_saved["stagedEntriesSha256"] == after_saved["stagedEntriesSha256"]
            assert before_saved["trackedFlagsSha256"] == after_saved["trackedFlagsSha256"]
    print("CASE=" + label + " RESULT=PASS")
    return evidence


def main():
    base = DRIVER.read_text()
    assert "RETAINED_METAFILE" not in base, "old temporary report remains mandatory"
    assert "/tmp/mmhb-server-candidate-r11a-" not in base, "historical path dependency remains"
    assert "/mmhb-nonexistent-fixture-interpreter" not in os.environ.get("PATH", "")
    run_case("fresh_two_pass_build_without_retained_report", expected_runs=2, expected_attempts=2)
    run_case("subset_of_reviewed_hash_inputs_accepted", mode="hash_subset", expected_runs=2)
    run_case("baseline_drift_stops_before_compiler",
             edit=lambda root: (root / "server/app.mjs").write_text("changed baseline\n"),
             expected_gate="R10A_BASELINE_DRIFT", expected_runs=0, expected_attempts=0)
    run_case("unreviewed_hash_input_stops_after_discovery", mode="unsupported_hash",
             expected_gate="METAFILE_PRIVATE_OR_UNSUPPORTED_INPUT", expected_runs=1)
    run_case("private_input_stops_after_discovery", mode="private",
             expected_gate="METAFILE_PRIVATE_OR_UNSUPPORTED_INPUT", expected_runs=1, intercept_private_read=True)
    run_case("missing_r9_input_refused_after_discovery", mode="missing_r9",
             expected_gate="REPAIRED_AUTH_INPUT_NOT_BUNDLED", expected_runs=1)
    run_case("workspace_escape_refused_after_discovery", mode="escape",
             expected_gate="METAFILE_INPUT_OUTSIDE_WORKSPACE", expected_runs=1)
    def private_link_fixture(root):
        write(root, ".env.fixture", "INERT_PRIVATE_FIXTURE\n")
        (root / "node_modules/fixture-private-link.js").symlink_to("../.env.fixture")
    run_case("private_symlink_refused_before_contents_read", mode="private_resolution", edit=private_link_fixture,
             expected_gate="METAFILE_PRIVATE_OR_UNSUPPORTED_RESOLUTION", expected_runs=1, intercept_private_read=True)
    drift = run_case("source_changes_between_build_passes", mode="source_drift",
             expected_gate="PINNED_FILE_NOT_PRESERVED", allowed_changes=("server/security/csrf.mjs",), expected_runs=2)
    assert drift["failure"]["previousFailure"]["gate"] == "REPAIRED_AUTH_INPUT_DRIFT"
    run_case("hash_source_changes_between_build_passes", mode="hash_source_drift",
             expected_gate="BUILD_INPUT_DRIFT", allowed_changes=(hash_sources(base)[0],), expected_runs=2)
    run_case("unrelated_source_drift_saved_and_refused", mode="unrelated_drift",
             expected_gate="GIT_OR_WORKTREE_NOT_PRESERVED", allowed_changes=("untracked.txt",), expected_runs=2)
    run_case("native_symlink_refused", edit=lambda root: (root / "node_modules/bcrypt/private-link").symlink_to("/etc/passwd"),
             expected_gate="NATIVE_SYMLINK_REQUIRES_REVIEW", expected_runs=2)
    native_drift = run_case("native_source_change_during_copy_refused", intercept_native_copy=True,
             expected_gate="NATIVE_SOURCE_NOT_PRESERVED", allowed_changes=("node_modules/bcrypt/index.js",), expected_runs=2)
    assert native_drift["failure"]["previousFailure"]["gate"] == "NATIVE_SOURCE_DRIFT", native_drift
    run_case("compiler_failure_preserves_originals", mode="build_failure", expected_gate="SERVER_COMPILATION_FAILED", expected_runs=1, expected_attempts=1)
    spawn_failure = run_case("missing_interpreter_has_phase_and_truthful_process_count", mode="missing_interpreter",
             expected_gate="SERVER_COMPILATION_FAILED", expected_runs=0, expected_attempts=1)
    assert spawn_failure["failure"]["phase"] == "DISCOVERY_COMPILATION", spawn_failure
    launch_error = spawn_failure["failure"]["detail"]["launchError"]
    assert launch_error["errorCode"] == "ENOENT", spawn_failure
    assert launch_error["phase"] == "DISCOVERY_COMPILATION", spawn_failure
    assert launch_error["detail"]["syscall"] in ("spawn", "spawnSync"), spawn_failure
    assert launch_error["detail"]["file"] == "node_modules/esbuild/bin/esbuild", spawn_failure
    run_case("nonrepeatable_bundle_refused", mode="nonrepeatable", expected_gate="BUILD_REPEATABILITY_MISMATCH", expected_runs=2)
    run_case("empty_output_metafile_refused", mode="empty_outputs", expected_gate="SERVER_ENTRY_MISSING_FROM_OUTPUT_METAFILE", expected_runs=1)
    def filter_fixture(root):
        write(root, ".gitattributes", "server/app.mjs filter=review\n")
        git(root, "config", "filter.review.clean", "touch FILTER_EXECUTED; cat")
    run_case("configured_git_clean_filter_never_runs", edit=filter_fixture, expected_runs=2)
    run_case("new_input_on_second_build_refused", mode="new_input",
             edit=lambda root: write(root, "node_modules/fixture-new-input.js", "// INERT_NEW_INPUT\n"),
             expected_gate="BUILD_INPUT_CLOSURE_DRIFT", expected_runs=2)
    run_case("raw_index_change_alone_saved_and_refused", mode="raw_index_drift",
             expected_gate="GIT_OR_WORKTREE_NOT_PRESERVED", expected_runs=2, index_changes=True)
    run_case("final_summary_missing_path_remains_visible_on_stdout", final_write_error="ENOENT",
             expected_gate="EVIDENCE_WRITE_FAILED", expected_runs=2)
    summary_failure = run_case("final_summary_io_error_retains_prior_compiler_failure", mode="build_failure", final_write_error="EIO",
             expected_gate="EVIDENCE_WRITE_FAILED", expected_runs=1)
    assert summary_failure["failure"]["previousFailure"]["gate"] == "SERVER_COMPILATION_FAILED", summary_failure
    print("R11D_FIXTURE_CASES=22 RESULT=PASS")
    print("SCOPE=FULL_DRIVER_WITH_INERT_PINNED_COMPILER_NOT_ESBUILD_OR_APPLICATION_RUNTIME")


if __name__ == "__main__":
    main()
