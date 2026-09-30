import { isLocale, type Locale } from "./config";

/** Rewrite a pathname to the same route under a different locale (trailing slash). */
export function pathForLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${locale}/`;
  }

  if (isLocale(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join("/")}/`;
}
