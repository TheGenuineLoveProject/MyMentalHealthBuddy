#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const required = (name) => {
  const value = process.env[name];
  if (!value || value.includes("<your-")) {
    throw new Error(`${name} is required and must not be placeholder`);
  }
  return value;
};

const backupFile = process.env.BACKUP_FILE;
if (!backupFile) throw new Error("BACKUP_FILE is required");
if (!fs.existsSync(backupFile)) throw new Error(`BACKUP_FILE not found: ${backupFile}`);

const provider = required("BACKUP_STORAGE_PROVIDER");
const bucket = required("BACKUP_BUCKET_NAME");
const region = required("BACKUP_REGION");
required("BACKUP_KMS_KEY_ID");

if (provider !== "aws-s3") throw new Error("BACKUP_STORAGE_PROVIDER must be aws-s3");

const key = `db-backups/${path.basename(backupFile)}`;

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.BACKUP_UPLOAD_SECRET_REF;

if (!accessKeyId || accessKeyId.includes("<your-")) {
  throw new Error("AWS access key is required. Set AWS_ACCESS_KEY_ID or BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY.");
}

if (!secretAccessKey || secretAccessKey.includes("<your-")) {
  throw new Error("AWS secret key is required. Set AWS_SECRET_ACCESS_KEY or BACKUP_UPLOAD_SECRET_REF.");
}

const client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

await client.send(new PutObjectCommand({
  Bucket: bucket,
  Key: key,
  Body: fs.createReadStream(backupFile),
  ServerSideEncryption: "aws:kms",
  SSEKMSKeyId: process.env.BACKUP_KMS_KEY_ID,
}));

console.log(`BACKUP_UPLOAD_S3_PASS s3://${bucket}/${key}`);
