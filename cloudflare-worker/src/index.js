const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";

function secureRandomState() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function textResponse(message, status = 400) {
  return new Response(message, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
    },
  });
}

function authorizationResult(status, payload, siteOrigin) {
  const nonceBytes = crypto.getRandomValues(new Uint8Array(18));
  const nonce = btoa(String.fromCharCode(...nonceBytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const safeMessage = JSON.stringify(message).replace(/</g, "\\u003c");
  const safeOrigin = JSON.stringify(siteOrigin);
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><title>GitHub sign-in</title></head><body><p>Returning to the dashboard…</p><script nonce="${nonce}">
    const allowedOrigin = ${safeOrigin};
    const authorizationMessage = ${safeMessage};
    const receiveMessage = (event) => {
      if (event.source !== window.opener || event.origin !== allowedOrigin) return;
      window.removeEventListener('message', receiveMessage);
      window.opener.postMessage(authorizationMessage, allowedOrigin);
      window.close();
    };
    window.addEventListener('message', receiveMessage);
    if (window.opener) window.opener.postMessage('authorizing:github', allowedOrigin);
  </script></body></html>`;
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "content-security-policy": `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'`,
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
    },
  });
}

async function handleAuth(request, env) {
  const url = new URL(request.url);
  if (url.searchParams.get("provider") !== "github")
    return textResponse("Unsupported provider.");
  if (
    !env.GITHUB_OAUTH_ID ||
    !env.GITHUB_OAUTH_SECRET ||
    !env.GITHUB_REPO_TOKEN ||
    !env.ALLOWED_GITHUB_USERNAME ||
    !env.ALLOWED_SITE_ORIGIN
  ) {
    return textResponse("OAuth is not configured.", 503);
  }

  const state = secureRandomState();
  const callbackUrl = `${url.origin}/callback`;
  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
  authorizeUrl.search = new URLSearchParams({
    client_id: env.GITHUB_OAUTH_ID,
    redirect_uri: callbackUrl,
    scope: "read:user",
    state,
  }).toString();

  return new Response(null, {
    status: 302,
    headers: {
      location: authorizeUrl.toString(),
      "set-cookie": `decap_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/callback; Max-Age=600`,
      "cache-control": "no-store",
      "referrer-policy": "no-referrer",
    },
  });
}

async function handleCallback(request, env) {
  const url = new URL(request.url);
  const queryState = url.searchParams.get("state");
  const cookieState = request.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)decap_oauth_state=([a-f0-9]{64})(?:;|$)/)?.[1];
  const code = url.searchParams.get("code");
  const callbackUrl = `${url.origin}/callback`;
  const clearStateCookie =
    "decap_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/callback; Max-Age=0";

  if (!queryState || !cookieState || queryState !== cookieState)
    return textResponse("Invalid or expired sign-in state. Please try again.");
  if (!code)
    return textResponse("GitHub did not return an authorization code.");

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_ID,
      client_secret: env.GITHUB_OAUTH_SECRET,
      code,
      redirect_uri: callbackUrl,
    }),
  });
  if (!tokenResponse.ok)
    return textResponse("GitHub sign-in failed. Please try again.");
  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token)
    return textResponse("GitHub did not return an access token.");

  const userResponse = await fetch(GITHUB_USER_URL, {
    headers: {
      authorization: `Bearer ${tokenData.access_token}`,
      accept: "application/vnd.github+json",
      "user-agent": "portfolio-decap-cms",
    },
  });
  if (!userResponse.ok)
    return textResponse("Unable to verify the GitHub account.");
  const githubUser = await userResponse.json();
  if (githubUser.login !== env.ALLOWED_GITHUB_USERNAME) {
    const denied = authorizationResult(
      "error",
      { error: "This GitHub account is not allowed to edit this site." },
      env.ALLOWED_SITE_ORIGIN,
    );
    denied.headers.append("set-cookie", clearStateCookie);
    return denied;
  }

  const success = authorizationResult(
    "success",
    { token: env.GITHUB_REPO_TOKEN },
    env.ALLOWED_SITE_ORIGIN,
  );
  success.headers.append("set-cookie", clearStateCookie);
  return success;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/auth" && request.method === "GET")
      return handleAuth(request, env);
    if (url.pathname === "/callback" && request.method === "GET")
      return handleCallback(request, env);
    if (url.pathname === "/")
      return new Response("Portfolio CMS OAuth proxy is running.", {
        headers: { "cache-control": "no-store" },
      });
    return textResponse("Not found.", 404);
  },
};
