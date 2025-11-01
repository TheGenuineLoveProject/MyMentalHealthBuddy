#!/usr/bin/env node
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const required = ["S3_BUCKET", "S3_REGION", "S3_ENDPOINT", "S3_ACCESS_KEY", "S3_SECRET_KEY"];
for (const key of required) {
  if (!process.env[key] || process.env[key].trim() === "") {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

const folder = "public/analytics/covers";
const bucket = process.env.S3_BUCKET;
const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

function detectMime(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  return {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    svg: "image/svg+xml",
  }[ext] || "application/octet-stream";
}

async function uploadAll() {
  const files = readdirSync(folder).filter(f => /\.(png|jpg|jpeg|webp|svg)$/i.test(f));
  if (files.length === 0) {
    console.log(`⚠️ No images found in ${folder}`);
    return;
  }
  console.log(`📤 Uploading ${files.length} files to bucket '${bucket}'...`);

  for (const file of files) {
    const filePath = path.join(folder, file);
    const Body = readFileSync(filePath);
    const Key = `covers/${file}`;
    try {
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key,
        Body,
        ACL: "public-read",
        ContentType: detectMime(file),
      }));
      const publicUrl = `${process.env.S3_ENDPOINT.replace(/\/$/, '')}/${bucket}/${Key}`;
      console.log(`✅ Uploaded: ${publicUrl}`);
    } catch (err) {
      console.error(`❌ Upload failed for ${file}:`, err.message);
    }
  }
  console.log("🎉 Upload complete.");
}

uploadAll().catch(err => console.error("Uploader crashed:", err));
