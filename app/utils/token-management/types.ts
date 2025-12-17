export interface TokenResponse {
  accessToken: string;
  refreshToken: string; // Usually, refresh endpoints return a new refresh token too
  expiresIn: number; // Access token expiry in seconds
  refreshExpiresIn: number; // Refresh token expiry in seconds
}