#!/usr/bin/env node
import fs from "fs"; import OpenAI from "openai";
import fetch from "node-fetch"; const ai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const qFile="content/social/queue.json";
if(!fs.existsSync(qFile)){console.log("⚠️ No queue.json found");process.exit(0);}
const queue=JSON.parse(fs.readFileSync(qFile,"utf8"));
const approved=queue.filter(q=>q.status==="approved");

const wp=process.env.WORDPRESS_URL, wpTok=process.env.WORDPRESS_TOKEN;
const mediumTok=process.env.MEDIUM_TOKEN, linkedTok=process.env.LINKEDIN_ACCESS_TOKEN, ytKey=process.env.YOUTUBE_API_KEY;
if(!approved.length){console.log("🕊 No approved posts to publish.");process.exit(0);}

for(const post of approved){
  const slug=post.id||`post-${Date.now()}`;
  const lang=post.lang||"en";
  const md=`content/blog/published/${slug}.md`;
  if(!fs.existsSync(md)) continue;
  const text=fs.readFileSync(md,"utf8");

  // AI caption summary
  let caption=""; try{
    const res=await ai.chat.completions.create({
      model:"gpt-4o-mini",
      messages:[{role:"user",content:`Summarize this healing post in <280 chars for social caption (${lang}):\n${text}`}],
      max_tokens:120
    });
    caption=res.choices?.[0]?.message?.content?.trim()||"";
  }catch{caption="Healing insights of the week 🌿";}

  // Post to WordPress
  if(wp&&wpTok){
    await fetch(`${wp}/wp-json/wp/v2/posts`,{
      method:"POST",
      headers:{Authorization:`Bearer ${wpTok}`,"Content-Type":"application/json"},
      body:JSON.stringify({title:slug,content:text,status:"publish"})
    }).then(r=>console.log("📰 WordPress:",r.status));
  }

  // Post to Medium
  if(mediumTok){
    await fetch("https://api.medium.com/v1/users/me/posts",{
      method:"POST",
      headers:{Authorization:`Bearer ${mediumTok}`,"Content-Type":"application/json"},
      body:JSON.stringify({title:slug,contentFormat:"markdown",content:text,publishStatus:"public"})
    }).then(r=>console.log("✍️ Medium:",r.status));
  }

  // Post to LinkedIn
  if(linkedTok){
    await fetch("https://api.linkedin.com/v2/ugcPosts",{
      method:"POST",
      headers:{Authorization:`Bearer ${linkedTok}`,"Content-Type":"application/json"},
      body:JSON.stringify({
        author:`urn:li:person:${process.env.LINKEDIN_PERSON_ID||"me"}`,
        lifecycleState:"PUBLISHED",
        specificContent:{"com.linkedin.ugc.ShareContent":{
          shareCommentary:{text:caption},shareMediaCategory:"NONE"}}
      })
    }).then(r=>console.log("💼 LinkedIn:",r.status));
  }

  // YouTube Community post stub
  if(ytKey){
    fs.appendFileSync("public/analytics/youtube_posts.log",`[${new Date().toISOString()}] ${caption}\n`);
    console.log("🎬 YouTube log written (stub OK).");
  }

  post.status="published"; post.published_at=new Date().toISOString();
}
fs.writeFileSync(qFile,JSON.stringify(queue,null,2));
console.log("✅ Cross-platform publishing done.");
