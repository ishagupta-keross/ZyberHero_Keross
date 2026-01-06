"use server";
import { redirect } from "next/navigation";
import { clearAllCookieSession, getCookieSession, setCookieSession } from "../session/cookieSession";
import { TokenResponse } from "./types";
interface AccessTokenOptionsProps {
  isNotLogOutWhenExpire?: boolean;
  isSetToken?: boolean;
}
export async function getValidAccessToken(options?: AccessTokenOptionsProps): Promise<string | null> {
  
  const accessToken = await getCookieSession("accessToken");
  const refreshToken = await getCookieSession("refreshToken");
  console.log("Access token from cookie:", accessToken);
  console.log("Refresh token from cookie:", refreshToken);
  
  if (accessToken) {
    console.log("Access token is getting from cookie:", accessToken);
    return accessToken;
  }

  if (refreshToken) {
    // Refresh token is valid, call the refresh token API
    const newAccessToken = await refreshAccessToken(refreshToken, options?.isSetToken);
    if (newAccessToken) {
      console.log("Access token refreshed: getting", newAccessToken);
      return newAccessToken; // Return the new access token
    }
  }
  if (!options?.isNotLogOutWhenExpire) {
    console.log("Both tokens are invalid, logging out user");
    await logOut();
  }
  // If both tokens are invalid, return null
  return null;
}

async function refreshAccessToken(
  refreshToken: string,
  isSetToken?: boolean
): Promise<string | null> {
  try {
    // Replace this with your actual API call to refresh the token
    const response = await fetch(
      `${process.env.IKON_API_URL}/platform/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (response.ok) {
      const data = await response.json();

      const { accessToken, refreshToken, expiresIn, refreshExpiresIn }: TokenResponse = data;
      if (isSetToken) {
        try {
          await setCookieSession("accessToken", accessToken, { maxAge: expiresIn });
          await setCookieSession("refreshToken", refreshToken, { maxAge: refreshExpiresIn });
        } catch (error) {
          console.error(error)
        }
      }

      // const headerList = headers();
      // const protocol = (await headerList).get("x-forwarded-proto") || "http";
      // const hostname = (await headerList).get("host") || "localhost:3000";
      // const host = `${protocol}://${hostname}`;
      // // Save the new access token and its expiration time
      // try {
      //   const res = await fetch(`${host}/api/auth/set-token`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(tokenData),
      //     credentials: "include", // Include credentials to send cookies
      //   });
      //   if (res.ok) {
      //     console.log("Token updated successfully");
      //   } else {
      //     console.error("Failed to update token");
      //   }
      // } catch (error) {
      //   console.error("Error updating token:", error);
      // }

      return accessToken;
    }
  } catch (error) {
    console.error("Failed to refresh access token:", error);
  }

  return null;
}

export async function logOut() {
  await clearAllCookieSession();
  // redirect(process.env.IKON_LOGIN_PAGE_URL || process.env.DEV_TOOL_BASE_PATH + "/signup.html")
  redirect(process.env.IKON_LOGIN_PAGE_URL || "/login")

}