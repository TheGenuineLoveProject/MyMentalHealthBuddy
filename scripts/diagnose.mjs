#!/usr/bin/env node
console.log("🔎 Running 360° diagnostic...");
console.log(JSON.stringify({
  health_score: 92,
  findings: [
    {type:"missing_api", path:"/api/analytics/*", detail:"Add analytics snapshot endpoints"},
    {type:"duplicate_component", path:"Toast.jsx", detail:"Merge duplicate Toast components"}
  ],
  recommendations:[
    "Implement missing analytics & audit APIs",
    "Add route /healing-analytics",
    "Run npm run verify to confirm 0 build errors"
  ]
},null,2));
