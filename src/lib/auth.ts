export const TOKEN_KEY = 'auth_token';

export interface JwtPayload {
  sub?: string;
  exp?: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1];
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function writeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable — the session lasts until reload
  }
}

/** Saved token if it exists and has not expired; an expired one is removed. */
export function validToken(): string | null {
  const token = readToken();
  if (!token) return null;
  const exp = decodeJwt(token)?.exp;
  if (exp && exp * 1000 <= Date.now()) {
    writeToken(null);
    return null;
  }
  return token;
}
