import {
  listBiometricRetryCandidates,
  getBiometricRetryPolicy
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

console.log(
"BIOMETRIC_RETRY_VERIFY_PASS"
);

}catch(err){

console.error(err);

process.exit(1);

}
