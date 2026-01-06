"use server"

import { setCookieSession } from "../utils/session/cookieSession";

export async function  login(userlogin: string, password: string) {

     const loginDetails = {
      password: password,
      userlogin: userlogin,
      credentialType: "PASSWORD",
    };

    // const url = `${  /platform/auth}/login`;
    const url = `${process.env.IKON_API_URL}/platform/auth/login`;
    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetails),
      }
    );
    console.log("Login response status:", response);
    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }
    const data = await response.json();
    console.log("Login response data:", data);
    const { accessToken, refreshToken, expiresIn, refreshExpiresIn } = data;
    

    

    await setCookieSession("accessToken", accessToken, { maxAge: expiresIn });
    await setCookieSession("refreshToken", refreshToken, { maxAge: refreshExpiresIn });
}
