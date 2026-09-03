// shared/utils.js
// Small set of helpers shared across widgets. Import with, e.g.:
//   import { applyTheme, formatDuration } from '../../shared/utils.js';
//
// Only add a function here if more than one widget genuinely needs it —
// widget-specific logic should stay in that widget's own file.

/**
 * Reads a query-string parameter, e.g. ?target=2026-06-15
 */
export function getParam(name, fallback = null) {
  const params = new URLSearchParams(window.location.search);
  return params.has(name) ? params.get(name) : fallback;
}

/**
 * Resolves the widget's theme and sets data-theme on <html> so the
 * CSS variable overrides in style.css apply.
 *
 * Priority: explicit ?theme=light|dark param  >  OS/browser preference.
 * Notion does not expose its own light/dark state to embedded iframes,
 * so this is best-effort, not a guaranteed match to the Notion page.
 */
export function applyTheme() {
  const override = getParam('theme');
  if (override === 'light' || override === 'dark') {
    document.documentElement.setAttribute('data-theme', override);
    return override;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = prefersDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
}

/**
 * Formats a duration in seconds as MM:SS, or HH:MM:SS once it exceeds an hour.
 * Pass { showHours: true|false } to force one format.
 */
export function formatDuration(totalSeconds, { showHours = null } = {}) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const useHours = showHours === null ? hrs > 0 : showHours;
  const pad = (n) => String(n).padStart(2, '0');
  return useHours
    ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    : `${pad(mins)}:${pad(secs)}`;
}

/**
 * Whole-day difference between two dates (ignores time-of-day).
 * Positive if dateB is after dateA.
 */
export function daysBetween(dateA, dateB) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const a = new Date(dateA);
  const b = new Date(dateB);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round((b - a) / MS_PER_DAY);
}

/**
 * Percent of the way from `start` to `end` that `now` sits at, clamped 0–100.
 * Used by year-progress and by pomodoro/progress-style widgets alike.
 */
export function percentElapsed(start, end, now = new Date()) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const n = now.getTime();
  if (n <= s) return 0;
  if (n >= e) return 100;
  return ((n - s) / (e - s)) * 100;
}
