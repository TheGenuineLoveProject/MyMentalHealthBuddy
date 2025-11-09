"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = void 0;
const health = () => ({
    status: "ok",
    uptime: process.uptime(),
    ts: new Date().toISOString()
});
exports.health = health;
