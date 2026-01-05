
"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getValidAccessToken, logOut } from "../token-management";
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
  // — force logout and redirect to login. Do this before the try/catch so
  // the redirect thrown by `logOut()` isn't swallowed by our catch below.
  const refreshTokenCookie = await getCookieSession("refreshToken");
  if (!refreshTokenCookie) {
    // This will clear cookies and redirect to the login page
    await logOut();
    // logOut will redirect; if it returns for any reason, surface failure
    return { status: "Failure", message: "No refresh token, logged out" };
  }

  try {
    const headers = new Headers(init.headers);
    if (!headers.get("Content-Type")) {
      headers.append("Content-Type", "application/json");
    }
    if (
      extraOptions?.isAccessTokenRequird == undefined ||
      extraOptions?.isAccessTokenRequird == true
    ) {
      // Try to get a valid access token. Don't force logout from inside this
      // helper if refresh fails; let the caller decide how to handle auth
      // failures. Also request that a refreshed token (if obtained) be
      // persisted to cookies.
      const accessToken = await getValidAccessToken({ isNotLogOutWhenExpire: true, isSetToken: true });
      if (!accessToken) {
        console.log("Access token not available after refresh attempt");
        // Return a failure early so the caller can react; don't throw and
        // clear cookies here (that would log the user out unexpectedly).
        return {
          status: "Failure",
          message: "Access token not available",
        };
      }
      headers.append("Authorization", "Bearer " + accessToken);
    }
    init.headers = headers;

    const response = await fetch(url, init);

    console.log("API Response:--------------------", response);

    if (!response.ok) {
      // Try to capture any error body to make debugging easier
      let errText: string | null = null;
      try {
        errText = await response.text();
      } catch {}
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
