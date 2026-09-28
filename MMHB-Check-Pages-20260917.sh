bash <<'MMHB_CHECK'
set -euo pipefail
printf '%s\n' \
  '961383bf41768c5b405614c1bf8aa01644a308ec2a30f639976d831e3f24f3a6  MMHB-Page-Diagnostic-20260916.sh' |
  sha256sum --check -
bash ./MMHB-Page-Diagnostic-20260916.sh
MMHB_CHECK
