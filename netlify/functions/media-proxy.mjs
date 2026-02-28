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

  const fallbackSplat = (event.path || "").replace(/^\/\.netlify\/functions\/media-proxy\/?/, "");
  const rawSplat = event.pathParameters?.splat || fallbackSplat;
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
