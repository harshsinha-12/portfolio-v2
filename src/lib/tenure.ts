const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function parseMonthYear(value: string): Date | null {
  const parts = value.trim().split(/\s+/);
  if (parts.length < 2) return null;

  const month = MONTH_INDEX[parts[0].toLowerCase().replace(/\./g, "")];
  const year = Number.parseInt(parts[parts.length - 1] ?? "", 10);
  if (month === undefined || !Number.isFinite(year)) return null;

  return new Date(year, month, 1);
}

export function parseDurationRange(
  duration: string,
): { start: Date; end: Date } | null {
  const [startRaw, endRaw] = duration.split(/\s*-\s*/);
  if (!startRaw || !endRaw) return null;

  const start = parseMonthYear(startRaw);
  if (!start) return null;

  const end = /present/i.test(endRaw)
    ? new Date()
    : parseMonthYear(endRaw);
  if (!end) return null;

  return { start, end };
}

export function monthsBetween(start: Date, end: Date): number {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}

export function formatTenure(totalMonths: number): string {
  const months = Math.max(totalMonths, 1);
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const parts: string[] = [];

  if (years > 0) parts.push(`${years} yr${years === 1 ? "" : "s"}`);
  if (remainder > 0) parts.push(`${remainder} mo${remainder === 1 ? "" : "s"}`);

  return parts.join(" ") || "1 mo";
}

export function totalTenureFromDurations(durations: string[]): string | null {
  let earliest: Date | null = null;
  let latest: Date | null = null;

  for (const duration of durations) {
    const range = parseDurationRange(duration);
    if (!range) continue;
    if (!earliest || range.start < earliest) earliest = range.start;
    if (!latest || range.end > latest) latest = range.end;
  }

  if (!earliest || !latest) return null;
  return formatTenure(monthsBetween(earliest, latest));
}

export function formatDurationWithTenure(duration: string): string {
  const range = parseDurationRange(duration);
  if (!range) return duration;
  return `${duration} · ${formatTenure(monthsBetween(range.start, range.end))}`;
}
