import {
  listBiometricRetryCandidates,
  getBiometricRetryPolicy,
  executeBiometricRetries,
  calculateRetryBackoffMs,
  markRetrying,
  markRetrySuccess,
  markRetryFailure,
  markRetryExhausted
} from "../../server/biometrics/retryService.mjs";

function assert(x,msg){
  if(!x) throw new Error(msg);
}

try{

const policy=getBiometricRetryPolicy();

assert(policy,"missing policy");

assert(
typeof policy.defaultLimit==="number",
"defaultLimit missing"
);

assert(
typeof policy.maxLimit==="number",
"maxLimit missing"
);

assert(
typeof policy.defaultMaxRetryCount==="number",
"defaultMaxRetryCount missing"
);

console.log(
"PASS retry policy export"
);

assert(
policy.maxLimit>=policy.defaultLimit,
"invalid limits"
);

console.log(
"PASS retry limits"
);

assert(
policy.defaultMaxRetryCount>0,
"invalid retry count"
);

console.log(
"PASS retry configuration"
);

assert(
typeof listBiometricRetryCandidates==="function",
"candidate function missing"
);

console.log(
"PASS retry candidate query"
);

assert(
typeof executeBiometricRetries==="function",
"executor function missing"
);

const dryRun=await executeBiometricRetries({limit:1});

assert(
dryRun.executionEnabled===false,
"retry executor must be disabled by default"
);

assert(
dryRun.mode==="dry_run_executor",
"retry executor must default to dry_run_executor"
);

assert(
dryRun.executed===0,
"dry run must not execute retries"
);

console.log(
"PASS retry dry-run executor"
);

assert(
typeof calculateRetryBackoffMs==="function",
"backoff function missing"
);

assert(
calculateRetryBackoffMs(0)===60000,
"backoff attempt 0 must be 60000ms"
);

assert(
calculateRetryBackoffMs(1)===120000,
"backoff attempt 1 must be 120000ms"
);

assert(
calculateRetryBackoffMs(20)===3600000,
"backoff must cap at 3600000ms"
);

assert(
typeof markRetrying==="function",
"markRetrying missing"
);

assert(
typeof markRetrySuccess==="function",
"markRetrySuccess missing"
);

assert(
typeof markRetryFailure==="function",
"markRetryFailure missing"
);

assert(
typeof markRetryExhausted==="function",
"markRetryExhausted missing"
);

console.log(
"PASS retry lifecycle helpers"
);

console.log(
"BIOMETRIC_RETRY_VERIFY_PASS"
);

}catch(err){

console.error(err);

process.exit(1);

}
