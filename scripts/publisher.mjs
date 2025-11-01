import fs from "fs";
import fetch from "node-fetch";
import path from "path";

const approvedDir = "content/social/approved";
const logFile = "logs/publisher.log";

const WP = process.env.WP_TOKEN;
const MEDIUM = process.env.MEDIUM_TOKEN;
const LINKEDIN = process.env.LINKEDIN_TOKEN;
const YOUTUBE = process.env.YOUTUBE_API_KEY;

function log(msg) {
  console.log("🧩 [Publisher]", msg);
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
}

async function publishToWordPress(post) {
  if (!WP) return log("⚠️ WordPress token missing");
  const res = await fetch("https://yourwordpress.com/wp-json/wp/v2/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WP}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: post.title, content: post.content, status: "publish" })
  });
  log("📘 WordPress: " + res.status);
}

async function publishToMedium(post) {
  if (!MEDIUM) return log("⚠️ Medium token missing");
  const res = await fetch("https://api.medium.com/v1/users/me/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MEDIUM}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: post.title,
      contentFormat: "html",
      content: post.content,
      publishStatus: "public"
    })
  });
  log("📰 Medium: " + res.status);
}

async function publishToLinkedIn(post) {
  if (!LINKEDIN) return log("⚠️ LinkedIn credentials missing");
  log(`💼 LinkedIn draft: ${post.title}`);
}

async function publishToYouTube(post) {
  if (!YOUTUBE) return log("⚠️ YouTube API key missing");
  log(`📺 YouTube Community: ${post.title}`);
}

async function main() {
  log("🚀 Starting Cross-Platform Publisher v14.0...");
  if (!fs.existsSync(approvedDir)) return log("❌ No approved directory found");

  const files = fs.readdirSync(approvedDir).filter(f => f.endsWith(".json"));
  for (const file of files) {
    const post = JSON.parse(fs.readFileSync(path.join(approvedDir, file), "utf8"));
    log(`🪶 Publishing: ${post.title}`);
    await publishToWordPress(post);
    await publishToMedium(post);
    await publishToLinkedIn(post);
    await publishToYouTube(post);
  }
  log("✅ Cross-Platform Publishing complete.");
}
main();
