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

const ALLOWED_REQUEST_HEADERS = new Set([
  "accept",
  "accept-language",
  "authorization",
  "content-type",
  "idempotency-key",
  "if-match",
  "if-none-match",
  "origin",
  "referer",
  "user-agent",
  "x-requested-with",
]);
const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]);
const REQUEST_TIMEOUT_MS = 15000;

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
    if (!ALLOWED_REQUEST_HEADERS.has(lowerKey)) {
      continue;
    }
    filtered[lowerKey] = value;
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

function rewriteBodyBackendOrigin(rawBody, backendOrigin, requestHost) {
  const body = String(rawBody || "");
  if (!body || !requestHost) return body;
  const frontendOrigin = `https://${requestHost}`;
  return body.split(backendOrigin).join(frontendOrigin);
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
          message: "Unsupported HTTP method.",
        },
      }),
    };
  }

  const fallbackSplat = (event.path || "").replace(/^\/\.netlify\/functions\/api-proxy\/?/, "");
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
          message: "Invalid API path.",
        },
      }),
    };
  }
  if (!(splat === "v1" || splat.startsWith("v1/"))) {
    return {
      statusCode: 404,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
      body: JSON.stringify({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Not found.",
        },
      }),
    };
  }

  const rawQuery =
    typeof event.rawQuery === "string"
      ? event.rawQuery
      : new URLSearchParams(event.queryStringParameters || {}).toString();
  const targetUrl = new URL(`/api/${splat}`, backendOrigin);
  if (rawQuery) {
    targetUrl.search = rawQuery;
  }

  const requestHeaders = sanitizeRequestHeaderEntries(Object.entries(event.headers || {}));
  requestHeaders["x-forwarded-proto"] = "https";
  if (event.headers?.host) {
    requestHeaders["x-forwarded-host"] = event.headers.host;
  }

  const hasBody = method !== "GET" && method !== "HEAD";
  const requestBody = hasBody
    ? event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64")
      : event.body
    : undefined;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let upstreamResponse;
  try {
    upstreamResponse = await fetch(targetUrl, {
      method,
      headers: requestHeaders,
      body: requestBody,
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
          message: "API upstream is unavailable.",
        },
      }),
    };
  } finally {
    clearTimeout(timeout);
  }

  const responseHeaders = sanitizeResponseHeaderEntries(upstreamResponse.headers.entries());
  responseHeaders["cache-control"] = "no-store";
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
    const rawBody = await upstreamResponse.text();
    return {
      statusCode: upstreamResponse.status,
      headers: responseHeaders,
      body: rewriteBodyBackendOrigin(rawBody, backendOrigin, event.headers?.host),
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
