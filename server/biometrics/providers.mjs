// server/biometrics/providers.mjs
//
// Real OAuth + REST clients for Oura, Google Fit, Whoop. NO MOCK
// RESPONSES. If client credentials are missing, providers throw
// `NotConfiguredError` and the route returns 501 with an actionable
// message. Apple HealthKit has no public web API and is handled
// instead by the webhook receiver in routes/biometrics.mjs.
//
// Required env vars (all optional — only the ones for connectors you
// want to enable):
//   OURA_CLIENT_ID, OURA_CLIENT_SECRET
//   GOOGLE_FIT_CLIENT_ID, GOOGLE_FIT_CLIENT_SECRET
//   WHOOP_CLIENT_ID, WHOOP_CLIENT_SECRET
//   BIOMETRICS_OAUTH_REDIRECT_BASE  (e.g. https://yourapp.replit.app)

export class NotConfiguredError extends Error {
  constructor(deviceSource, missing) {
    super(`provider_not_configured:${deviceSource}:${missing.join(",")}`);
    this.deviceSource = deviceSource;
    this.missing = missing;
    this.statusCode = 501;
  }
}

export class ProviderError extends Error {
  constructor(deviceSource, message, status = 502) {
    super(`provider_error:${deviceSource}:${message}`);
    this.deviceSource = deviceSource;
    this.statusCode = status;
  }
}

function redirectUri(deviceSource) {
  const base = process.env.BIOMETRICS_OAUTH_REDIRECT_BASE
    || process.env.PUBLIC_BASE_URL
    || `${process.env.REPLIT_DEV_DOMAIN ? "https://" + process.env.REPLIT_DEV_DOMAIN : "http://localhost:5000"}`;
  return `${base.replace(/\/$/, "")}/api/biometrics/callback/${deviceSource}`;
}

async function safeFetch(url, opts = {}, deviceSource) {
  let res;
  try {
    res = await fetch(url, opts);
  } catch (err) {
    throw new ProviderError(deviceSource, `network: ${err.message}`, 502);
  }
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) {
    throw new ProviderError(deviceSource, `http_${res.status}`, res.status >= 500 ? 502 : 400);
  }
  return json;
}

/* ============================================================
 * OURA  —  https://cloud.ouraring.com/v2/docs
 * ============================================================ */
function ouraConfig() {
  const id = process.env.OURA_CLIENT_ID;
  const secret = process.env.OURA_CLIENT_SECRET;
  const missing = [];
  if (!id) missing.push("OURA_CLIENT_ID");
  if (!secret) missing.push("OURA_CLIENT_SECRET");
  if (missing.length) throw new NotConfiguredError("oura", missing);
  return { id, secret, redirect: redirectUri("oura") };
}

export const oura = {
  buildAuthUrl(state) {
    const c = ouraConfig();
    const u = new URL("https://cloud.ouraring.com/oauth/authorize");
    u.searchParams.set("client_id", c.id);
    u.searchParams.set("response_type", "code");
    u.searchParams.set("redirect_uri", c.redirect);
    u.searchParams.set("scope", "daily personal heartrate");
    u.searchParams.set("state", state);
    return u.toString();
  },
  async exchangeCode(code) {
    const c = ouraConfig();
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: c.redirect,
      client_id: c.id,
      client_secret: c.secret,
    });
    return safeFetch("https://api.ouraring.com/oauth/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }, "oura");
  },
  async refresh(refreshToken) {
    const c = ouraConfig();
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: c.id,
      client_secret: c.secret,
    });
    return safeFetch("https://api.ouraring.com/oauth/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }, "oura");
  },
  async fetchRecent(accessToken, sinceISO) {
    ouraConfig();
    const start = sinceISO?.slice(0, 10) || new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
    const end = new Date().toISOString().slice(0, 10);
    const headers = { authorization: `Bearer ${accessToken}` };
    const [sleep, sleepDetail, activity, readiness] = await Promise.all([
      safeFetch(`https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${start}&end_date=${end}`, { headers }, "oura"),
      safeFetch(`https://api.ouraring.com/v2/usercollection/sleep?start_date=${start}&end_date=${end}`, { headers }, "oura"),
      safeFetch(`https://api.ouraring.com/v2/usercollection/daily_activity?start_date=${start}&end_date=${end}`, { headers }, "oura"),
      safeFetch(`https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=${start}&end_date=${end}`, { headers }, "oura"),
    ]);
    return {
      dailySleep: sleep?.data || [],
      sleepDetail: sleepDetail?.data || [],
      dailyActivity: activity?.data || [],
      dailyReadiness: readiness?.data || [],
    };
  },
  async fetchProfile(accessToken) {
    return safeFetch("https://api.ouraring.com/v2/usercollection/personal_info", {
      headers: { authorization: `Bearer ${accessToken}` },
    }, "oura");
  },
};

/* ============================================================
 * GOOGLE FIT  —  https://developers.google.com/fit/rest
 * ============================================================ */
function gfitConfig() {
  const id = process.env.GOOGLE_FIT_CLIENT_ID;
  const secret = process.env.GOOGLE_FIT_CLIENT_SECRET;
  const missing = [];
  if (!id) missing.push("GOOGLE_FIT_CLIENT_ID");
  if (!secret) missing.push("GOOGLE_FIT_CLIENT_SECRET");
  if (missing.length) throw new NotConfiguredError("google_fit", missing);
  return { id, secret, redirect: redirectUri("google_fit") };
}

const GFIT_SCOPES = [
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.oxygen_saturation.read",
].join(" ");

export const googleFit = {
  buildAuthUrl(state) {
    const c = gfitConfig();
    const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    u.searchParams.set("client_id", c.id);
    u.searchParams.set("redirect_uri", c.redirect);
    u.searchParams.set("response_type", "code");
    u.searchParams.set("scope", GFIT_SCOPES);
    u.searchParams.set("access_type", "offline");
    u.searchParams.set("prompt", "consent");
    u.searchParams.set("state", state);
    return u.toString();
  },
  async exchangeCode(code) {
    const c = gfitConfig();
    const body = new URLSearchParams({
      code,
      client_id: c.id,
      client_secret: c.secret,
      redirect_uri: c.redirect,
      grant_type: "authorization_code",
    });
    return safeFetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }, "google_fit");
  },
  async refresh(refreshToken) {
    const c = gfitConfig();
    const body = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: c.id,
      client_secret: c.secret,
      grant_type: "refresh_token",
    });
    return safeFetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }, "google_fit");
  },
  async fetchRecent(accessToken, sinceISO) {
    gfitConfig();
    const since = sinceISO ? new Date(sinceISO) : new Date(Date.now() - 7 * 86400000);
    const startNs = String(since.getTime() * 1e6);
    const endNs = String(Date.now() * 1e6);
    const headers = { authorization: `Bearer ${accessToken}` };
    const dataTypes = [
      "com.google.heart_rate.bpm",
      "com.google.step_count.delta",
      "com.google.calories.expended",
      "com.google.distance.delta",
      "com.google.oxygen_saturation",
    ];
    const out = {};
    for (const dt of dataTypes) {
      try {
        const sources = await safeFetch(
          `https://www.googleapis.com/fitness/v1/users/me/dataSources?dataTypeName=${encodeURIComponent(dt)}`,
          { headers }, "google_fit",
        );
        const source = sources?.dataSource?.[0];
        if (!source?.dataStreamId) { out[dt] = []; continue; }
        const ds = await safeFetch(
          `https://www.googleapis.com/fitness/v1/users/me/dataSources/${encodeURIComponent(source.dataStreamId)}/datasets/${startNs}-${endNs}`,
          { headers }, "google_fit",
        );
        out[dt] = ds?.point || [];
      } catch (err) {
        out[dt] = [];
        out[`${dt}__error`] = err.message;
      }
    }
    return out;
  },
};

/* ============================================================
 * WHOOP  —  https://developer.whoop.com/api
 * ============================================================ */
function whoopConfig() {
  const id = process.env.WHOOP_CLIENT_ID;
  const secret = process.env.WHOOP_CLIENT_SECRET;
  const missing = [];
  if (!id) missing.push("WHOOP_CLIENT_ID");
  if (!secret) missing.push("WHOOP_CLIENT_SECRET");
  if (missing.length) throw new NotConfiguredError("whoop", missing);
  return { id, secret, redirect: redirectUri("whoop") };
}

export const whoop = {
  buildAuthUrl(state) {
    const c = whoopConfig();
    const u = new URL("https://api.prod.whoop.com/oauth/oauth2/auth");
    u.searchParams.set("client_id", c.id);
    u.searchParams.set("redirect_uri", c.redirect);
    u.searchParams.set("response_type", "code");
    u.searchParams.set("scope", "read:recovery read:sleep read:cycles read:profile offline");
    u.searchParams.set("state", state);
    return u.toString();
  },
  async exchangeCode(code) {
    const c = whoopConfig();
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: c.id,
      client_secret: c.secret,
      redirect_uri: c.redirect,
    });
    return safeFetch("https://api.prod.whoop.com/oauth/oauth2/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }, "whoop");
  },
  async refresh(refreshToken) {
    const c = whoopConfig();
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: c.id,
      client_secret: c.secret,
      scope: "offline",
    });
    return safeFetch("https://api.prod.whoop.com/oauth/oauth2/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }, "whoop");
  },
  async fetchRecent(accessToken, sinceISO) {
    whoopConfig();
    const start = sinceISO || new Date(Date.now() - 7 * 86400000).toISOString();
    const headers = { authorization: `Bearer ${accessToken}` };
    const [recovery, sleep] = await Promise.all([
      safeFetch(`https://api.prod.whoop.com/developer/v1/recovery?start=${encodeURIComponent(start)}&limit=25`, { headers }, "whoop"),
      safeFetch(`https://api.prod.whoop.com/developer/v1/activity/sleep?start=${encodeURIComponent(start)}&limit=25`, { headers }, "whoop"),
    ]);
    return {
      recovery: recovery?.records || [],
      sleep: sleep?.records || [],
    };
  },
};

export function getProvider(deviceSource) {
  switch (deviceSource) {
    case "oura": return oura;
    case "google_fit": return googleFit;
    case "whoop": return whoop;
    default: return null;
  }
}
