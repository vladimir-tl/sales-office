/**
 * Хранение согласия на cookie.
 * Значение пишется и в localStorage, и в cookie `cookie_consent`
 * (cookie нужна, чтобы выбор был виден и серверу).
 */

export const CONSENT_KEY = 'cookie_consent';
/** Увеличьте, если поменялся состав категорий — баннер покажется снова. */
export const CONSENT_VERSION = 1;
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 год

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
  const match = document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/**
 * Согласие считается данным, только если оно есть и в localStorage, и в cookie.
 * Удалили любое из двух — баннер покажется снова.
 * Если localStorage недоступен совсем (запрет сайта), смотрим только cookie.
 */
export function getConsent(): Consent | null {
  const fromCookie = parse(readCookie(CONSENT_KEY));
  let fromStorage: Consent | null;
  try {
    fromStorage = parse(localStorage.getItem(CONSENT_KEY));
  } catch {
    return fromCookie;
  }
  return fromStorage && fromCookie ? fromStorage : null;
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
  const raw = JSON.stringify(consent);

  try {
    localStorage.setItem(CONSENT_KEY, raw);
  } catch {
    // игнорируем — cookie ниже всё равно сохранит выбор
  }

  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_KEY}=${encodeURIComponent(raw)}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;

  window.dispatchEvent(new CustomEvent<Consent>('cookie-consent', { detail: consent }));
  return consent;
}
