/**
 * Cookie consent storage.
 * The only storage location is the `cookie_consent` cookie (JSON).
 * The cookie is visible to the server (Astro.cookies) and expires on its own after one year.
 */

export const CONSENT_KEY = 'cookie_consent';
/** Bump this when the set of categories changes — the banner will be shown again. */
export const CONSENT_VERSION = 1;
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export type ConsentCategory = 'analytics' | 'marketing';

export interface Consent {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

function isConsent(value: unknown): value is Consent {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    v.version === CONSENT_VERSION &&
    v.necessary === true &&
    typeof v.analytics === 'boolean' &&
    typeof v.marketing === 'boolean'
  );
}

function parse(raw: string | null | undefined): Consent | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return isConsent(value) ? value : null;
  } catch {
    return null;
  }
}

function readCookie(name: string): string | null {
  const match = document.cookie.split('; ').find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export function getConsent(): Consent | null {
  return parse(readCookie(CONSENT_KEY));
}

export function hasConsent(category: ConsentCategory): boolean {
  return getConsent()?.[category] === true;
}

export function saveConsent(choice: Pick<Consent, ConsentCategory>): Consent {
  const consent: Consent = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    updatedAt: new Date().toISOString(),
  };

  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_KEY}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;

  window.dispatchEvent(new CustomEvent<Consent>('cookie-consent', { detail: consent }));
  return consent;
}
