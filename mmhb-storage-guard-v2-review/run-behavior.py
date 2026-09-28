from pathlib import Path
import importlib.util, json
p = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("guard", p / "MMHB_AUTH_STORAGE_GUARD_V2.py")
g = importlib.util.module_from_spec(spec)
spec.loader.exec_module(g)
b = (p / "storage.before.mjs").read_bytes()
result = g.check_node(b, g.transform(b))
print(json.dumps(result, indent=2))
