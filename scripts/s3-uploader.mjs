import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const endpoint = process.env.S3_ENDPOINT?.trim();
const region = process.env.S3_REGION?.trim() || 'us-east-1';
const bucket = process.env.S3_BUCKET?.trim();
const accessKeyId = process.env.S3_ACCESS_KEY?.trim();
const secretAccessKey = process.env.S3_SECRET_KEY?.trim();

function fail(msg){ console.error("❌", msg); process.exit(1); }

if(!endpoint) fail("Missing S3_ENDPOINT");
if(!bucket)   fail("Missing S3_BUCKET");
if(!accessKeyId || !secretAccessKey) fail("Missing S3_ACCESS_KEY / S3_SECRET_KEY");

const s3 = new S3Client({
  endpoint, region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true
});

const folder = 'public/analytics/covers';

async function main(){
  const files = fs.readdirSync(folder).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
  if(files.length === 0){ console.log("ℹ️ No cover images found in", folder); return; }
  for(const f of files){
    const Body = fs.readFileSync(path.join(folder,f));
    const Key = `covers/${f}`;
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key, Body, ACL: 'public-read', ContentType: f.endsWith('.png')?'image/png':'image/jpeg' }));
    const host = endpoint.replace(/^https?:\/\//,'').replace(/\/$/,'');
    // Works for Spaces (path style) and MinIO; adjust if needed for AWS virtual host style
    const url = `${endpoint.replace(/\/$/,'')}/${bucket}/${Key}`;
    console.log(`✅ Uploaded: ${url}`);
  }
}
main().catch(e=>{ console.error(e); process.exit(1); });
