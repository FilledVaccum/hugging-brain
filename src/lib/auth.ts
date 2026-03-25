import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "HuggingBrainAdmin2026!";
const SESSION_COOKIE = "hb_admin_session";

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Simple token store (in production, use Redis or DB)
const validTokens = new Set<string>();

export async function createSession(): Promise<string> {
  const token = generateToken();
  validTokens.add(token);
  return token;
}

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    return token ? validTokens.has(token) : false;
  } catch {
    return false;
  }
}

export function isAuthenticatedFromRequest(request: NextRequest): boolean {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return token ? validTokens.has(token) : false;
}

export { SESSION_COOKIE };
