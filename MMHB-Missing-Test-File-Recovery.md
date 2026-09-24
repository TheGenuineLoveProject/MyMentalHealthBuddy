# MMHB missing test file: recovery handoff

The returned Replit output reports `ENOENT` for `/home/runner/mmhb-step16-readable/webhook-postgres.mjs`. The Step 2 installer reached that prerequisite check before invoking the database qualification runner. This execution produced no new database test result.

`MMHB-Restore-Test-File-and-Resume.sh` restores the exact previously prepared harness and invokes the already saved runner. Paste its entire contents once into Replit Shell, then return the full output. No rerun of the long Step 2 installation command is needed.

The command checks project identity, the private installation directory, the saved runner hash, and the harness hash. It preserves existing files whose contents differ and stops. Harness and runner code are unchanged from the prepared PostgreSQL qualification. Files are staged outside the application checkout.

Local verification reproduced the reported missing-harness failure, restored the original harness bytes, preserved the runner bytes and modification time, and reached runner invocation. A separate missing-runner control stopped before harness installation. Bash and harness syntax checks passed. Delivery locations were redirected for these controls; the embedded test and runner code were not changed.

The local environment does not contain the Replit checkout. The actual runner therefore stopped at its identity gate before database initialization in the local recovery control. Real PostgreSQL tests still require execution in Replit. These checks do not qualify the application for release.

```text
COMMAND_ID=MMHB-MISSING-HARNESS-RECOVERY-20260924-18
ISSUE_ID=MMHB-POSTGRES-QUALIFICATION-MISSING-HARNESS
PRIMARY_DOMAIN=TESTING
AFFECTED_DOMAINS=DELIVERY,DATABASE_QUALIFICATION
BASELINE=REPORTED_ENOENT_REPRODUCED_IN_LOCAL_DELIVERY_CONTROL
ROOT_CAUSE=REQUIRED_HARNESS_ABSENT_AT_INSTALLATION_PATH
CAUSAL_OWNER=QUALIFICATION_PREREQUISITE_DELIVERY
REACHABILITY=BEFORE_RUNNER_INVOCATION
IMPACT=DATABASE_QUALIFICATION_CANNOT_START
REPAIR_SELECTED=RESTORE_EXACT_HARNESS_AND_RESUME_SAVED_RUNNER
AUTHORIZED_SCOPE=PREPARED_TEST_FILES_AND_ISOLATED_QUALIFICATION
QUALIFICATION=PASS:LOCAL_DELIVERY_CONTROLS_ONLY
BACKUP=EXISTING_FILES_PRESERVED_BY_EXCLUSIVE_COPY_AND_HASH_CHECKS
MUTATION=RECOVERY_COMMAND_PREPARED;REPLIT_EXECUTION_PENDING
EXPECTED_DIFF=HARNESS_DELIVERY_AND_RUNNER_LAUNCH_WRAPPER_ONLY
UNEXPECTED_DIFF=0:PREPARED_HARNESS_AND_RUNNER_BYTES_UNCHANGED
SECURITY=HASH_AND_PRIVATE_DIRECTORY_CHECKS_VERIFIED
TYPECHECK=NOT_RUN:UNCHANGED_FROM_PRIOR_REPORTED_GATE
LINT=NOT_RUN:DELIVERY_RECOVERY_ONLY
TEST=LOCAL_DELIVERY_CONTROLS_PASS;REAL_POSTGRES_PENDING
BUILD=NOT_RUN:UNCHANGED_FROM_PRIOR_REPORTED_GATE
RUNTIME=RUNNER_HANDOFF_VERIFIED;APPLICATION_RUNTIME_NOT_RUN
ACCESSIBILITY=NOT_RUN:NO_UI_CHANGE
SAFETY=NOT_RUN:NO_APPLICATION_BEHAVIOR_CHANGE
PRIVACY=QUALIFICATION_RETAINS_SYNTHETIC_DATA_SCOPE
PERFORMANCE=NOT_RUN:NO_PERFORMANCE_CHANGE
COMMIT=NOT_RUN:DELIVERY_RECOVERY_ONLY
REMOTE_SYNC=NOT_RUN:DELIVERY_RECOVERY_ONLY
CI=NOT_RUN:RELEASE_PENDING
DEPLOYMENT=NOT_RUN:RELEASE_PENDING
PRODUCTION=NOT_VERIFIED
ROLLBACK=NO_APPLICATION_CHANGE_TO_REVERSE
RESIDUAL_RISK=REAL_DATABASE_AND_RELEASE_GATES_REMAIN_UNQUALIFIED
STATUS=RECOVERY_COMMAND_READY_FOR_REPLIT_EXECUTION
NEXT_REQUIRED_ACTION=RUN_RECOVERY_COMMAND_AND_RETURN_FULL_OUTPUT
NEXT_ACTION=STOP
RELEASE_QUALIFIED=false
```
