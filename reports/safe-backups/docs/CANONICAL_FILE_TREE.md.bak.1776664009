# CANONICAL FILE TREE

## Rule

Every active platform concern must live in one exact location.

---

## Canonical top-level tree

```text
.
├── content/                      # editorial/source content systems
├── docs/                         # governance + canonical operational docs
│   ├── API_CONTRACT_LOCK.json
│   ├── CANONICAL_FILE_TREE.md
│   ├── OWNERSHIP_MATRIX.md
│   ├── ROUTE_MANIFEST.json
│   └── ROUTE_REGISTRY.md
├── public/                       # public static assets
├── reports/                      # generated reports only
├── tests/                        # automated tests
├── .archive/                     # retired non-runtime files only
└── server/
		├── app.mjs                   # canonical express entry
		├── billing/                  # billing-only logic
		├── middleware/               # reusable middleware only
		├── premium/                  # premium-tier logic only
		├── routes/                   # all route registration
		├── security/                 # security logic only
		├── services/                 # internal orchestration only
		├── utils/                    # pure helpers only
		└── validation/               # schemas/guards only