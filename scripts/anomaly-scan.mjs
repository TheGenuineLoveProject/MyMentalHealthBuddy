#!/usr/bin/env node
import { execSync } from "child_process";
execSync("node scripts/analytics-build.mjs", {stdio:"inherit"});
