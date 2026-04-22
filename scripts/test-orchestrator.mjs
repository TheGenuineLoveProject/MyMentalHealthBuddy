// scripts/test-orchestrator.mjs
//
// Smoke test for server/ai/orchestrator.mjs — guards against the regression
// pattern where Express snippets get pasted into this pure orchestration
// function. Run with: node scripts/test-orchestrator.mjs
//
// Asserts:
//   1. Empty message  → {ok:false, status:400, stage:"validation"}
//   2. Crisis message → {ok:true,  stage:"safety", outcome:"crisis", isCrisis:true}
//   3. Normal message → {ok:true,  stage:"ai",     outcome:"success"} (with mocked openai)
//   4. No `req`/`res` identifiers leaked into the source

import fs from "node:fs";
import path from "node:path";
import { orchestrateAIRequest } from "../server/ai/orchestrator.mjs";

let failed = 0;
function assert(cond, name) {
        if (cond) {
                console.log(`  ok   ${name}`);
        } else {
                console.log(`  FAIL ${name}`);
                failed++;
        }
}

// ---------- Test 1: empty input ----------
console.log("Test 1: empty message");
{
        const res = await orchestrateAIRequest({ message: "" });
        assert(res.ok === false, "ok === false");
        assert(res.status === 400, "status === 400");
        assert(res.stage === "validation", "stage === 'validation'");
}

// ---------- Test 2: crisis short-circuit (keyword path, no openai needed) ----------
console.log("Test 2: crisis message");
{
        const res = await orchestrateAIRequest({
                message: "I want to kill myself",
                userKey: "smoketest_crisis",
        });
        assert(res.ok === true, "ok === true (crisis is a successful safety response)");
        assert(res.stage === "safety", "stage === 'safety'");
        assert(res.outcome === "crisis", "outcome === 'crisis'");
        assert(res.response?.isCrisis === true, "response.isCrisis === true");
        assert(res.response?.action === "escalate_immediately", "action === 'escalate_immediately'");
        // Crisis path must NOT create memory or summary files
        const memFile = `data/memory/smoketest_crisis.json`;
        const sumFile = `data/memory-summary/smoketest_crisis.txt`;
        assert(!fs.existsSync(memFile), "no memory file written for crisis user");
        assert(!fs.existsSync(sumFile), "no summary file written for crisis user");
}

// ---------- Test 3: normal message with mocked openai ----------
console.log("Test 3: normal message (mocked provider)");
{
        const fakeOpenai = {
                chat: {
                        completions: {
                                create: async () => ({
                                        choices: [{ message: { content: "mocked reply" } }],
                                        usage: { prompt_tokens: 10, completion_tokens: 5 },
                                }),
                        },
                },
        };
        const res = await orchestrateAIRequest({
                message: "I had a quiet morning",
                openai: fakeOpenai,
                userKey: `smoketest_normal_${Date.now()}`,
        });
        assert(res.ok === true, "ok === true");
        assert(res.stage === "ai", "stage === 'ai'");
        assert(res.outcome === "success", "outcome === 'success'");
        assert(res.response?.reply === "mocked reply", "reply matches mocked content");
        assert(res.response?.source === "openai", "source === 'openai'");
        assert(typeof res.response?.modelUsed === "string", "modelUsed is a string");
        assert(typeof res.response?.latencyMs === "number", "latencyMs is a number");
}

// ---------- Test 4: source-level grep guards ----------
console.log("Test 4: source-level guards");
{
        const src = fs.readFileSync(
                path.resolve("server/ai/orchestrator.mjs"),
                "utf-8",
        );
        // Strip the contract comment block so its mentions of `req`/`res` don't trip the guard
        const code = src.replace(/^\/\/[^\n]*$/gm, "");
        assert(!/\breq\b/.test(code), "no `req` identifier in orchestrator code");
        assert(!/\bres\b/.test(code), "no `res` identifier in orchestrator code");
        assert(!/\bnext\b\s*\(/.test(code), "no Express `next()` call in orchestrator code");
}

if (failed > 0) {
        console.error(`\n${failed} assertion(s) failed`);
        process.exit(1);
} else {
        console.log("\nAll smoke assertions passed");
}
