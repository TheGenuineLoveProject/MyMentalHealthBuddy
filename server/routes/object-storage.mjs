import { Router } from 'express';
import { randomUUID } from 'crypto';
import { logger } from "../utils/logger.mjs";

const router = Router();

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

function getPrivateObjectDir() {
  const dir = process.env.PRIVATE_OBJECT_DIR || "";
  if (!dir) {
    throw new Error(
      "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
        "tool and set PRIVATE_OBJECT_DIR env var."
    );
  }
  return dir;
}

function parseObjectPath(path) {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");

  return { bucketName, objectName };
}

async function signObjectURL({ bucketName, objectName, method, ttlSec }) {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  };
  
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );
  
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, ` +
        `make sure you're running on Replit`
    );
  }

  const { signed_url: signedURL } = await response.json();
  return signedURL;
}

async function getObjectEntityUploadURL() {
  const privateObjectDir = getPrivateObjectDir();
  const objectId = randomUUID();
  const fullPath = `${privateObjectDir}/uploads/${objectId}`;
  const { bucketName, objectName } = parseObjectPath(fullPath);

  return signObjectURL({
    bucketName,
    objectName,
    method: "PUT",
    ttlSec: 900,
  });
}

function normalizeObjectEntityPath(rawPath) {
  if (!rawPath.startsWith("https://storage.googleapis.com/")) {
    return rawPath;
  }

  const url = new URL(rawPath);
  const rawObjectPath = url.pathname;

  let objectEntityDir = getPrivateObjectDir();
  if (!objectEntityDir.endsWith("/")) {
    objectEntityDir = `${objectEntityDir}/`;
  }

  if (!rawObjectPath.startsWith(objectEntityDir)) {
    return rawObjectPath;
  }

  const entityId = rawObjectPath.slice(objectEntityDir.length);
  return `/objects/${entityId}`;
}

router.post("/request-url", async (req, res) => {
  try {
    const { name, size, contentType } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Missing required field: name",
      });
    }

    const uploadURL = await getObjectEntityUploadURL();
    const objectPath = normalizeObjectEntityPath(uploadURL);

    res.json({
      uploadURL,
      objectPath,
      metadata: { name, size, contentType },
    });
  } catch (error) {
    logger.error("Error generating upload URL", { error: error?.message || error });
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

export default router;
