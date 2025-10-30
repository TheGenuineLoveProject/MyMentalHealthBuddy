#!/usr/bin/env node
/**
 * Reads content/social/queue.json
 * For items: { id, type:"carousel", status:"approved", lang:"en", images:[...paths], caption_path:"...md", scheduled_at:"ISO" }
 * Posts to Instagram (Business), X, and Threads when tokens exist.
 * All APIs are best-effort; if a token is missing, we log to /public/analytics/social.log
 */
import fs from "fs"; import path from "path"; import FormData from "form-data";

const queuePath="content/social/queue.json";
const logFile="public/analytics/social.log";
const now=new Date();

function log(...a){fs.appendFileSync(logFile,`[${new Date().toISOString()}] ${a.join(" ")}\n`); console.log(...a);}

if(!fs.existsSync(queuePath)){ log("⚠️ queue.json missing."); process.exit(0); }
const q=JSON.parse(fs.readFileSync(queuePath,"utf8"));

const approved=q.filter(p=>p.status==="approved" && p.type==="carousel")
                .filter(p=>!p.scheduled_at || new Date(p.scheduled_at)<=now);

const CAPTION_LANGS=(process.env.CAPTION_LANGS||"en").split(",").map(s=>s.trim()).filter(Boolean);

async function readCaption(file){ try{ return fs.readFileSync(file,"utf8"); }catch{ return ""; } }

// === Platform helpers ===

// X (Twitter) — simple text post plus first image (API v2 media upload would need OAuth 1.0a or v2 media endpoints; we log stub)
async function postToX(caption){
  const token=process.env.X_BEARER;
  if(!token){ log("🕊 X: missing token → logged only."); return; }
  // Minimal text-only placeholder (media upload flow omitted in this stub)
  const res = await fetch("https://api.twitter.com/2/tweets",{
    method:"POST",
    headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},
    body:JSON.stringify({text:caption})
  });
  log("🕊 X status:",res.status);
}

// Instagram Business via Graph API: create media containers then publish a carousel
async function postToInstagram(images, caption){
  const token=process.env.IG_ACCESS_TOKEN;
  const igId=process.env.IG_IG_BUSINESS_ID;
  if(!token||!igId){ log("📸 IG: missing token or business id → logged only."); return; }

  // You must host images at public URLs. If local, you’ll first upload them to S3/static CDN.
  // Here we reject local paths and log:
  const urls=images.filter(u=>/^https?:\/\//.test(u));
  if(!urls.length){ log("📸 IG: no public URLs provided for images."); return; }

  // Create containers
  const containerIds=[];
  for(const url of urls){
    const r=await fetch(`https://graph.facebook.com/v19.0/${igId}/media?image_url=${encodeURIComponent(url)}&is_carousel_item=true&access_token=${token}`,{method:"POST"});
    const j=await r.json(); if(j.id) containerIds.push(j.id);
  }
  if(!containerIds.length){ log("📸 IG: failed to create containers."); return; }

  // Create carousel & publish
  const create = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`,{
    method:"POST",
    headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body:new URLSearchParams({ media_type:"CAROUSEL", children:containerIds.join(","), caption, access_token:token })
  });
  const j=await create.json();
  if(!j.id){ log("📸 IG: carousel create failed."); return; }
  const publish=await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${j.id}&access_token=${token}`,{method:"POST"});
  log("📸 IG publish status:",publish.status);
}

// Threads (Meta) — public API availability varies; we provide a safe logging stub
async function postToThreads(caption){
  if(!process.env.THREADS_ACCESS_TOKEN||!process.env.THREADS_USER_ID){
    log("🧵 Threads: missing credential → logged only."); return;
  }
  // Replace with official endpoint when available to you.
  log("🧵 Threads: (stub) would post:", caption.slice(0,120));
}

async function main(){
  if(!approved.length){ log("✅ No scheduled carousels ready."); return; }
  for(const item of approved){
    const captionRaw = await readCaption(item.caption_path||"");
    // Pick caption by lang; if caption file has front-matter or sections, you can extend. For now we reuse same.
    const caption=captionRaw || `Weekly insights (${item.lang||"en"})`;
    await postToX(caption);
    await postToInstagram(item.images||[], caption);
    await postToThreads(caption);
    item.status="published"; item.published_at=new Date().toISOString();
    log("✅ Published carousel:", item.id);
  }
  fs.writeFileSync(queuePath, JSON.stringify(q,null,2));
}
await main();
