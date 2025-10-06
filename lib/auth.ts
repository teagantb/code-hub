import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth-token")?.value || null;
}

export function setAuthCookie(token: string) {
  // This will be used in API routes
  return {
    "Set-Cookie": `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${
      7 * 24 * 60 * 60
    }`, // 7 days
  };
}

export function clearAuthCookie() {
  return {
    "Set-Cookie":
      "auth-token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
  };
}
