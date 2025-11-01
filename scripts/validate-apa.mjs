#!/usr/bin/env node
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDir = "content/blog";
const reports = [];

function validateAPA(front) {
  const required = ["title","authors","source","year","apa_citation"];
  const missing = required.filter(k => !front[k]);
  return {
    valid: missing.length === 0,
    missing,
  };
}

fs.readdirSync(blogDir).filter(f => f.endsWith(".md") || f.endsWith(".mdx")).forEach(file => {
  const raw = fs.readFileSync(path.join(blogDir,file),"utf8");
  const { data:front } = matter(raw);
  const check = validateAPA(front);
  reports.push({
    file,
    valid: check.valid,
    missing: check.missing,
    title: front.title || "Untitled",
  });
});

console.log("📘 APA Validation Report:");
console.table(reports);
const validCount = reports.filter(r => r.valid).length;
console.log(`✅ ${validCount}/${reports.length} content files have complete APA metadata.`);
