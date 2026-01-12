
"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getValidAccessToken, logOutWithoutRedirect } from "../token-management";
import { getCookieSession } from "../session/cookieSession";

export interface ExtraOptionsProps {
  isAccessTokenRequird?: boolean;
  revalidateTags?: string[];
  revalidatePaths?: string[];
}

export const baseApiRequest = async (
  url: string,
  init: RequestInit,
  extraOptions?: ExtraOptionsProps
) => {
  // If there's no refresh token in cookies the user cannot be refreshed
  // — force logout and redirect to login up-front.
  const refreshTokenCookie = await getCookieSession("refreshToken");
  if (!refreshTokenCookie) {
    await logOutWithoutRedirect();
    return { status: "Failure", message: "No refresh token, logged out" };
  }

  try {
    const headers = new Headers(init.headers);
    if (!headers.get("Content-Type")) {
      headers.append("Content-Type", "application/json");
    }

    // Try to get an access token (will refresh + persist if expired)
    const accessToken = await getValidAccessToken({ isNotLogOutWhenExpire: true });

    if (accessToken) {
      headers.append("Authorization", "Bearer " + accessToken);
    }

    init.headers = headers;

    let response = await fetch(url, init);

    // Some backends validate JWT `nbf`/`iat` with strict clock checks and may
    // reject a token if server time is behind the token's Not-Before.
    // In that case we should force-refresh and retry once.
    if (!response.ok) {
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const clone = response.clone();
          const errJson: any = await clone.json();
          const msg = String(errJson?.message || errJson?.error || '');
          const isNbfSkew = msg.toLowerCase().includes("can't be used before");

          if (isNbfSkew) {
            console.warn('Backend rejected access token due to nbf/iat clock skew; forcing refresh and retrying once');
            const refreshed = await getValidAccessToken({ isNotLogOutWhenExpire: true, forceRefresh: true });
            if (refreshed) {
              headers.set('Authorization', 'Bearer ' + refreshed);
              init.headers = headers;
              response = await fetch(url, init);
            }
          }
        }
      } catch {
        // ignore parsing errors
      }
    }

    // If unauthorized, attempt a forced refresh and retry once
    if (response.status === 401 || response.status === 403) {
      let newAccessToken = await getValidAccessToken({ isNotLogOutWhenExpire: true, forceRefresh: true });

      // If we couldn't get a token, check whether a refresh token cookie exists.
      if (!newAccessToken) {
        const refreshTokenCookie = await getCookieSession("refreshToken");
        if (!refreshTokenCookie) {
          // No refresh token -> force logout
          await logOutWithoutRedirect();
          return { status: 'Failure', message: 'Unauthorized - logged out' };
        }

        // Refresh token exists but initial refresh attempt failed. Try one final
        // attempt which will allow logout if the refresh token is invalid.
        try {
          const finalAttempt = await getValidAccessToken({ isNotLogOutWhenExpire: false, forceRefresh: true });
          if (!finalAttempt) {
            // finalAttempt either performed logout or refresh failed and logout was allowed
            return { status: 'Failure', message: 'Unauthorized - logged out' };
          }
          newAccessToken = finalAttempt;
        } catch (err) {
          console.error('Final refresh attempt failed:', err);
          return { status: 'Failure', message: 'Unauthorized - failed to refresh access token' };
        }
      }

      // If we now have a token, retry the request with it
      if (newAccessToken) {
        headers.set('Authorization', 'Bearer ' + newAccessToken);
        init.headers = headers;
        response = await fetch(url, init);
      } else {
        // No token after attempts — return failure
        return { status: 'Failure', message: 'Unauthorized - failed to refresh access token' };
      }
    }

    if (!response.ok) {
      let errText: string | null = null;
      try {
        errText = await response.text();
      } catch {}

      // If we still have an auth-type failure after retries, clear cookies and
      // return a controlled Failure response.
      const looksLikeAuth =
        response.status === 401 ||
        response.status === 403 ||
        (errText && errText.toLowerCase().includes("can't be used before"));

      if (looksLikeAuth) {
        await logOutWithoutRedirect();
        return { status: 'Failure', message: 'Unauthorized - session invalid, please log in again' };
      }

      throw new Error(`HTTP error! Status: ${response.status}${errText ? ` - ${errText}` : ''}`);
    }

    const contentType = response.headers.get("Content-Type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    extraOptions?.revalidateTags?.forEach((tag) => revalidateTag(tag));
    extraOptions?.revalidatePaths?.forEach((path) => revalidatePath(path));

    return responseData;
  } catch (error) {
    console.error(`API Request Failed - ${init.method} ${url}:`, error);
    const err = error as Error;
    return {
      status: "Failure",
      message: err.message || "An error occurred while making the request",
    };
  }
};
