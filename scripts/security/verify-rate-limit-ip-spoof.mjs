import fs from "fs";

function assert(x,msg){
  if(!x) throw new Error(msg);
}

const src =
  fs.readFileSync(
    "server/middleware/rateLimit.mjs",
    "utf8"
  );

assert(
  src.includes("return (req.ip || \"unknown\").toString();"),
  "req.ip protection missing"
);

assert(
  !src.includes("x-forwarded-for"),
  "raw x-forwarded-for trust still present"
);

console.log(
  "PASS req.ip only"
);

console.log(
  "PASS xff spoof prevention"
);

console.log(
  "RATE_LIMIT_VERIFY_PASS"
);
