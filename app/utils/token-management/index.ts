"use server";
import { redirect } from "next/navigation";
import { clearAllCookieSession, getCookieSession, setCookieSession } from "../session/cookieSession";
import { TokenResponse } from "./types";
interface AccessTokenOptionsProps {
  isNotLogOutWhenExpire?: boolean;
  isSetToken?: boolean;
  forceRefresh?: boolean;
}

const ACCESS_TOKEN_EXPIRY_KEY = "accessTokenExpiresAt";

function isExpired(expiresAtMs?: number | null) {
  if (!expiresAtMs) return true;
  // Refresh a little early to avoid race conditions.
  const skewMs = 30_000;
  return Date.now() + skewMs >= expiresAtMs;
}

export async function getValidAccessToken(options?: AccessTokenOptionsProps): Promise<string | null> {
  const accessToken = await getCookieSession("accessToken");
  const refreshToken = await getCookieSession("refreshToken");
  const accessTokenExpiresAtRaw = await getCookieSession(ACCESS_TOKEN_EXPIRY_KEY);
  const accessTokenExpiresAt = accessTokenExpiresAtRaw ? Number(accessTokenExpiresAtRaw) : null;
  console.log("Access token from cookie:", accessToken);
  console.log("Refresh token from cookie:", refreshToken);

  // If we are not forcing a refresh and an access token exists and is not expired, return it.
  if (accessToken && !options?.forceRefresh && !isExpired(accessTokenExpiresAt)) {
    console.log("Access token is getting from cookie:", accessToken);
    return accessToken;
  }

  if (refreshToken) {
    // Refresh token is present — attempt to refresh.
    const refreshResult = await refreshAccessToken(refreshToken);
    // refreshResult: { accessToken: string | null, refreshExpired?: boolean }
    if (refreshResult?.accessToken) {
      console.log("Access token refreshed: getting", refreshResult.accessToken);
      return refreshResult.accessToken;
    }

    // If refreshExpired is true, refresh token is invalid/expired and we must log out.
    if (refreshResult?.refreshExpired) {
      if (!options?.isNotLogOutWhenExpire) {
        console.log("Refresh token expired, logging out user");
        await logOut();
      }
      return null;
    }

    // Otherwise refresh failed due to transient error — do NOT clear refresh token here.
    // Let the caller decide what to do (it may retry later or trigger a UI message).
    console.warn("Refresh attempt failed due to transient error — will not log out");
    return null;
  }

  // No refresh token available — treat as expired/absent and log out unless opted out.
  if (!options?.isNotLogOutWhenExpire) {
    console.log("No refresh token available, logging out user");
    await logOut();
  }
  return null;
}

/**
 * Proactively refresh tokens and persist them to cookies.
 * Call this from client-loaded pages via dynamic import (server-side helper).
 * Returns the new access token string if refresh succeeded, otherwise null.
 */
export async function refreshTokens(): Promise<string | null> {
  const refreshToken = await getCookieSession("refreshToken");
  if (!refreshToken) {
    console.log("No refresh token available to refreshTokens()");
    return null;
  }

  const refreshResult = await refreshAccessToken(refreshToken);
  if (refreshResult?.accessToken) {
    console.log("refreshTokens: refreshed and persisted access token");
    return refreshResult.accessToken;
  }

  console.warn("refreshTokens: refresh failed or returned null");
  return null;
}

async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string | null; refreshExpired?: boolean }> {
  try {
    const url = `${process.env.IKON_API_URL}/platform/auth/refresh-token`;
    const mask = (t?: string) => (t ? `${t.slice(0, 6)}...${t.slice(-6)} (len=${t.length})` : 'nil');
    console.log(`Calling refresh endpoint: ${url} refreshToken=${mask(refreshToken)}`);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    console.log(`Refresh endpoint response status=${response.status} content-type=${response.headers.get('content-type')}`);

    // If refresh succeeded, parse tokens and optionally persist them.
    if (response.ok) {
      const data = await response.json();
      console.log("Full refresh response data:", data); // Debug log
      // Defensive: check for all expected fields
      if (!data.accessToken || !data.refreshToken || !data.expiresIn || !data.refreshExpiresIn) {
        console.error('Refresh endpoint returned OK but missing expected fields', data);
        return { accessToken: null };
      }
      const { accessToken, refreshToken: newRefreshToken, expiresIn, refreshExpiresIn }: TokenResponse = data;
      if (!accessToken) {
        // Backend returned OK but no accessToken field — treat as transient failure
        console.error('Refresh endpoint returned OK but no accessToken in payload', data);
        return { accessToken: null };
      }
      // Always persist refreshed tokens (otherwise future server actions can't see them)
      try {
        await setCookieSession("accessToken", accessToken, { maxAge: expiresIn });
        await setCookieSession("refreshToken", newRefreshToken, { maxAge: refreshExpiresIn });
        // store absolute expiry timestamp so we can know when to refresh
        await setCookieSession(ACCESS_TOKEN_EXPIRY_KEY, String(Date.now() + expiresIn * 1000), { maxAge: expiresIn });
      } catch (error) {
        console.error("Failed to set refreshed tokens in cookies:", error);
      }
      return { accessToken };
    }

    // Read response body for better diagnostics
    let bodyText = '';
    try {
      bodyText = await response.text();
    } catch (e) {
      /* ignore */
    }

    // If backend returns 401/403 it's an indication the refresh token is invalid/expired.
    if (response.status === 401 || response.status === 403) {
      console.warn("Refresh endpoint returned 401/403 — refresh token expired or invalid", bodyText);
      return { accessToken: null, refreshExpired: true };
    }

    // Other non-OK responses are treated as transient failures (do not clear refresh token).
    console.error("Refresh endpoint returned non-ok status:", response.status, bodyText);
    return { accessToken: null };
  } catch (error) {
    console.error("Failed to refresh access token (network/error):", error);
    return { accessToken: null };
  }
}

export async function logOut() {
  await clearAllCookieSession();
  // redirect(process.env.IKON_LOGIN_PAGE_URL || process.env.DEV_TOOL_BASE_PATH + "/signup.html")
  redirect(process.env.IKON_LOGIN_PAGE_URL || "/login")

}

/**
 * Use this in server utilities (like API wrappers) where throwing NEXT_REDIRECT is undesirable.
 */
export async function logOutWithoutRedirect() {
  await clearAllCookieSession();
}