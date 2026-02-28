const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

const ALLOWED_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const REQUEST_TIMEOUT_MS = 20000;
const BROWSER_MEDIA_CACHE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const EDGE_MEDIA_CACHE_SECONDS = 60 * 60 * 24 * 365; // 1 year
const STALE_WHILE_REVALIDATE_SECONDS = 60 * 60 * 24; // 1 day

function normalizeBackendOrigin(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return "";
  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return "";
  }
}

function sanitizeSplat(rawValue) {
  const cleaned = String(rawValue || "").replace(/^\/+/, "");
  if (!cleaned) return "";

  const normalized = cleaned.replace(/\/{2,}/g, "/");
  let decoded = normalized;
  try {
    decoded = decodeURIComponent(normalized);
  } catch {
    decoded = normalized;
  }

  if (decoded.includes("..")) return null;
  return normalized;
}

function resolveSplat(event) {
  const fromPathParam = String(event.pathParameters?.splat || "").trim();
  if (fromPathParam) {
    return fromPathParam;
  }

  const rawPath = String(event.path || "").replace(/^\/+/, "");
  if (!rawPath) {
    return "";
  }

  const functionPrefix = ".netlify/functions/media-proxy/";
  const mediaPrefix = "media/";

  if (rawPath.startsWith(functionPrefix)) {
    return rawPath.slice(functionPrefix.length);
  }
  if (rawPath === ".netlify/functions/media-proxy") {
    return "";
  }
  if (rawPath.startsWith(mediaPrefix)) {
    return rawPath.slice(mediaPrefix.length);
  }
  if (rawPath === "media") {
    return "";
  }

  return rawPath;
}

function sanitizeRequestHeaderEntries(entries) {
  const filtered = {};
  for (const [key, value] of entries) {
    const lowerKey = key.toLowerCase();
    if (!value) continue;
    if (HOP_BY_HOP_HEADERS.has(lowerKey)) {
      continue;
    }
    if (lowerKey === "accept" || lowerKey === "if-none-match" || lowerKey === "if-modified-since") {
      filtered[lowerKey] = value;
    }
  }
  return filtered;
}

function sanitizeResponseHeaderEntries(entries) {
  const filtered = {};
  for (const [key, value] of entries) {
    const lowerKey = key.toLowerCase();
    if (!value) continue;
    if (HOP_BY_HOP_HEADERS.has(lowerKey)) {
      continue;
    }
    filtered[lowerKey] = value;
  }
  return filtered;
}

function isCacheableMediaResponse(statusCode, contentType) {
  if (statusCode < 200 || statusCode >= 300) return false;
  const normalizedType = String(contentType || "").toLowerCase();
  return (
    normalizedType.startsWith("image/")
    || normalizedType.startsWith("video/")
    || normalizedType.startsWith("audio/")
    || normalizedType.includes("font/")
  );
}

function applyMediaCacheHeaders(headers) {
  const browserPolicy =
    `public, max-age=${BROWSER_MEDIA_CACHE_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`;
  const edgePolicy =
    `public, max-age=${EDGE_MEDIA_CACHE_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`;
  headers["cache-control"] = browserPolicy;
  headers["cdn-cache-control"] = edgePolicy;
  headers["netlify-cdn-cache-control"] = edgePolicy;
}

function rewriteLocationHeader(rawLocation, backendOrigin, requestHost) {
  if (!rawLocation) return "";
  try {
    const backendUrl = new URL(backendOrigin);
    const locationUrl = new URL(rawLocation, backendUrl);
    if (locationUrl.origin !== backendUrl.origin) {
      return rawLocation;
    }
    if (!requestHost) {
      return `${locationUrl.pathname}${locationUrl.search}${locationUrl.hash}`;
    }
    return `https://${requestHost}${locationUrl.pathname}${locationUrl.search}${locationUrl.hash}`;
  } catch {
    return rawLocation;
  }
}

export async function handler(event) {
  const backendOrigin = normalizeBackendOrigin(process.env.BACKEND_ORIGIN);
  if (!backendOrigin) {
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
      body: JSON.stringify({
        success: false,
        error: {
          code: "BACKEND_ORIGIN_NOT_SET",
          message: "BACKEND_ORIGIN is not configured in Netlify environment variables.",
        },
      }),
    };
  }

  const method = (event.httpMethod || "GET").toUpperCase();
  if (!ALLOWED_METHODS.has(method)) {
    return {
      statusCode: 405,
      headers: {
        "content-type": "application/json",
        allow: Array.from(ALLOWED_METHODS).join(", "),
        "cache-control": "no-store",
      },
      body: JSON.stringify({
        success: false,
        error: {
          code: "METHOD_NOT_ALLOWED",
          message: "Unsupported HTTP method for media proxy.",
        },
      }),
    };
  }

  const rawSplat = resolveSplat(event);
  const splat = sanitizeSplat(rawSplat);
  if (splat === null) {
    return {
      statusCode: 400,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
      body: JSON.stringify({
        success: false,
        error: {
          code: "INVALID_PATH",
          message: "Invalid media path.",
        },
      }),
    };
  }

  const rawQuery =
    typeof event.rawQuery === "string"
      ? event.rawQuery
      : new URLSearchParams(event.queryStringParameters || {}).toString();
  const targetUrl = new URL(`/media/${splat}`, backendOrigin);
  if (rawQuery) {
    targetUrl.search = rawQuery;
  }

  const requestHeaders = sanitizeRequestHeaderEntries(Object.entries(event.headers || {}));
  requestHeaders["x-forwarded-proto"] = "https";
  if (event.headers?.host) {
    requestHeaders["x-forwarded-host"] = event.headers.host;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let upstreamResponse;
  try {
    upstreamResponse = await fetch(targetUrl, {
      method,
      headers: requestHeaders,
      redirect: "manual",
      signal: controller.signal,
    });
  } catch {
    return {
      statusCode: 502,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
      body: JSON.stringify({
        success: false,
        error: {
          code: "UPSTREAM_UNAVAILABLE",
          message: "Media upstream is unavailable.",
        },
      }),
    };
  } finally {
    clearTimeout(timeout);
  }

  const responseHeaders = sanitizeResponseHeaderEntries(upstreamResponse.headers.entries());
  if (responseHeaders.location) {
    responseHeaders.location = rewriteLocationHeader(
      responseHeaders.location,
      backendOrigin,
      event.headers?.host,
    );
  }
  const responseType = upstreamResponse.headers.get("content-type") || "";
  if (isCacheableMediaResponse(upstreamResponse.status, responseType)) {
    applyMediaCacheHeaders(responseHeaders);
  } else if (upstreamResponse.status >= 400) {
    responseHeaders["cache-control"] = "no-store";
  }

  if (
    responseType.startsWith("text/") ||
    responseType.includes("application/json") ||
    responseType.includes("application/javascript") ||
    responseType.includes("application/xml")
  ) {
    return {
      statusCode: upstreamResponse.status,
      headers: responseHeaders,
      body: await upstreamResponse.text(),
    };
  }

  const rawBody = Buffer.from(await upstreamResponse.arrayBuffer());
  return {
    statusCode: upstreamResponse.status,
    headers: responseHeaders,
    body: rawBody.toString("base64"),
    isBase64Encoded: true,
  };
}
