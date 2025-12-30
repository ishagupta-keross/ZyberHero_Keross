"use server";
import { cookies } from "next/headers";

const cookiePrefix = "ikoncloud_next_";

interface CookieSessionOptionsProps {
  maxAge?: number,
  expires?: Date
}

export async function setCookieSession(
  sessionName: string,
  data: string, options?: CookieSessionOptionsProps
) {
  const cookieStore = await cookies();

//   cookieStore.set(cookiePrefix + sessionName, data, {
//     httpOnly: false,
//     sameSite: "lax",
//     secure: process.env.NODE_ENV === "production",
//     path: "/",
//     domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
//     expires: options?.expires,
//     maxAge: options?.maxAge
//   });
// }
 cookieStore.set(cookiePrefix + sessionName, data, {
    httpOnly: false, // or true if you don't need JS access
    // For cross-site cookies in production we set sameSite='none' and secure=true.
    // For local development (http://localhost) browsers reject Secure cookies, so
    // relax settings to allow testing.
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_COOKIE_DOMAIN : undefined,
    expires: options?.expires,
    maxAge: options?.maxAge,
  });
}

export async function getCookieSession(
  sessionName: string
): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(cookiePrefix + sessionName)?.value;
  return cookie;
}

export async function clearCookieSession(sessionName: string) {
  const cookieStore = await cookies();
  cookieStore.delete(cookiePrefix + sessionName);
}

export async function clearAllCookieSession() {
  const cookieStore = await cookies();
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.startsWith(cookiePrefix)) {
      cookieStore.delete(cookie.name);
    }
  });
}
