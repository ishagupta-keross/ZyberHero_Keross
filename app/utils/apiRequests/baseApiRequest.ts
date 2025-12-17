
"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getValidAccessToken } from "../token-management";

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
  try {
    const headers = new Headers(init.headers);
    if (!headers.get("Content-Type")) {
      headers.append("Content-Type", "application/json");
    }
    if (
      extraOptions?.isAccessTokenRequird == undefined ||
      extraOptions?.isAccessTokenRequird == true
    ) {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        throw new Error("Access token not found in cookies");
      }
      headers.append("Authorization", "Bearer " + accessToken);
    }
    init.headers = headers;

    const response = await fetch(url, init);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
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
