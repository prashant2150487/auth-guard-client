// dateTimeHelper.js

/**
 * Parse input into a Date object.
 * Accepts Date, number (ms), or ISO string.
 */
export function toDate(input) {
  if (input instanceof Date) return input;
  if (typeof input === "number") return new Date(input);
  return new Date(String(input)); // handles ISO strings
}

/**
 * Format a date using Intl.DateTimeFormat.
 * - date: Date | string | number
 * - opts: Intl.DateTimeFormat options + { timeZone }
 */
export function formatDateTime(date, opts = {}) {
  const d = toDate(date);
  const {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale = "en-IN",
    ...dtOpts
  } = opts;

  // sensible default format
  const defaultOpts = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const formatOptions = Object.keys(dtOpts).length ? dtOpts : defaultOpts;
  return new Intl.DateTimeFormat(locale, { timeZone, ...formatOptions }).format(
    d
  );
}

/**
 * Return current time (Date) or a formatted string for a given timezone.
 * - tz: timezone string like "Asia/Kolkata"
 * - formatted: if true, returns formatted string, else Date object
 */
export function now(tz = "Asia/Kolkata", formatted = true, locale = "en-IN") {
  const d = new Date();
  if (!formatted) return d;
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}

/**
 * Convert a date to an ISO string (UTC).
 */
export function toISO(date) {
  return toDate(date).toISOString();
}

/**
 * Human-friendly relative time like "5 minutes ago" or "in 2 hours".
 * Uses Intl.RelativeTimeFormat if available; falls back to simple strings.
 */
export function relativeTime(
  targetDate,
  { nowDate = new Date(), locale = "en" } = {}
) {
  const t = toDate(targetDate).getTime();
  const n = toDate(nowDate).getTime();
  const diffSec = Math.round((t - n) / 1000);

  const rtf =
    typeof Intl !== "undefined" && Intl.RelativeTimeFormat
      ? new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
      : null;

  const units = [
    { name: "year", secs: 60 * 60 * 24 * 365 },
    { name: "month", secs: 60 * 60 * 24 * 30 },
    { name: "day", secs: 60 * 60 * 24 },
    { name: "hour", secs: 60 * 60 },
    { name: "minute", secs: 60 },
    { name: "second", secs: 1 },
  ];

  const abs = Math.abs(diffSec);
  for (const u of units) {
    if (abs >= u.secs || u.name === "second") {
      const val = Math.round(diffSec / u.secs);
      if (rtf) return rtf.format(val, u.name);
      // fallback
      if (val === 0) return "just now";
      if (val > 0) return `in ${val} ${u.name}${Math.abs(val) > 1 ? "s" : ""}`;
      return `${Math.abs(val)} ${u.name}${Math.abs(val) > 1 ? "s" : ""} ago`;
    }
  }
}

/**
 * Example helpers: startOfDay / endOfDay (in given timezone treated in local time)
 * Note: startOfDay/endOfDay operate in system local time. If you need timezone-aware
 * arithmetic, prefer libraries like luxon/DateTime or use Intl formatting for display only.
 */
export function startOfDay(date) {
  const d = toDate(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
export function endOfDay(date) {
  const d = toDate(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
