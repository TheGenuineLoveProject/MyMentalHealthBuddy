from pathlib import Path
import json,subprocess,shutil,os
p=Path(__file__).resolve().parent
proc=subprocess.run([shutil.which("node"),str(p/"behavior-checks.cjs")], input=json.dumps({"before":(p/"storage.before.mjs").read_text(),"after":(p/"storage.after.mjs").read_text()}).encode(),env={"PATH":os.environ.get("PATH","/usr/bin:/bin")},check=True)
