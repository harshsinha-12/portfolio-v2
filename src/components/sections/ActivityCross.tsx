import { activityPercents, type GitHubActivity } from "@/lib/githubActivity";

const LAYOUT = { cx: 200, cy: 150, arm: 92 } as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function formatRange(from: string, to: string): string {
  const label = (iso: string) => {
    const [year, month, day] = iso.split("-");
    return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
  };
  return `${label(from)} to ${label(to)}`;
}

export function ActivityCross({ activity }: { activity: GitHubActivity }) {
  const share = activityPercents(activity);
  const { cx, cy, arm } = LAYOUT;
  const place = (percent: number, axis: "n" | "e" | "s" | "w") => {
    const scaled = Math.round((percent / 100) * arm * 10) / 10;
    const len = percent <= 0 ? 0 : Math.max(6, scaled);
    if (axis === "n") return { x: cx, y: Math.round((cy - len) * 10) / 10 };
    if (axis === "s") return { x: cx, y: Math.round((cy + len) * 10) / 10 };
    if (axis === "w") return { x: Math.round((cx - len) * 10) / 10, y: cy };
    return { x: Math.round((cx + len) * 10) / 10, y: cy };
  };
  const dots = {
    commits: place(share.commits, "w"),
    codeReview: place(share.codeReview, "n"),
    pullRequests: place(share.pullRequests, "s"),
    issues: place(share.issues, "e"),
  };
  const percentLabel = (percent: number) => (percent > 0 ? `${percent}%` : "");
  const summary = `Public GitHub activity, ${formatRange(activity.from, activity.to)}: ${share.commits}% commits (${activity.commits}), ${share.pullRequests}% pull requests (${activity.pullRequests}), ${share.codeReview}% code review (${activity.codeReview}), ${share.issues}% issues (${activity.issues}).`;

  return (
    <figure className="mt-3 border-t border-[var(--color-ink)]/10 pt-3">
      <figcaption className="mb-1 text-[11px] text-[var(--color-ink-subtle)]">
        Public activity, {formatRange(activity.from, activity.to)}
      </figcaption>
      <svg viewBox="0 0 400 300" role="img" aria-label={summary} className="mx-auto block h-auto w-full max-w-[420px] font-sans">
        <line x1={cx - arm} y1={cy} x2={cx + arm} y2={cy} stroke="var(--color-gh-2)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1={cx} y1={cy - arm} x2={cx} y2={cy + arm} stroke="var(--color-gh-2)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={dots.commits.x} y2={dots.commits.y} stroke="var(--color-gh-4)" strokeWidth="3" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={dots.codeReview.x} y2={dots.codeReview.y} stroke="var(--color-gh-4)" strokeWidth="3" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={dots.pullRequests.x} y2={dots.pullRequests.y} stroke="var(--color-gh-4)" strokeWidth="3" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={dots.issues.x} y2={dots.issues.y} stroke="var(--color-gh-4)" strokeWidth="3" strokeLinecap="round" />
        <circle cx={dots.commits.x} cy={dots.commits.y} r="5" fill="var(--color-paper)" stroke="var(--color-gh-4)" strokeWidth="2" />
        <circle cx={dots.codeReview.x} cy={dots.codeReview.y} r="4" fill="var(--color-paper)" stroke="var(--color-gh-4)" strokeWidth="2" />
        <circle cx={dots.pullRequests.x} cy={dots.pullRequests.y} r="4" fill="var(--color-paper)" stroke="var(--color-gh-4)" strokeWidth="2" />
        {share.issues > 0 && (
          <circle cx={dots.issues.x} cy={dots.issues.y} r="4" fill="var(--color-paper)" stroke="var(--color-gh-4)" strokeWidth="2" />
        )}
        <text x={cx} y={16} textAnchor="middle" fill="var(--color-ink-subtle)" fontSize="12" fontWeight="600">{percentLabel(share.codeReview)}</text>
        <text x={cx} y={32} textAnchor="middle" fill="var(--color-ink)" fontSize="12">Code review</text>
        <text x={cx} y={268} textAnchor="middle" fill="var(--color-ink-subtle)" fontSize="12" fontWeight="600">{percentLabel(share.pullRequests)}</text>
        <text x={cx} y={286} textAnchor="middle" fill="var(--color-ink)" fontSize="12">Pull requests</text>
        <text x={cx - arm - 12} y={144} textAnchor="end" fill="var(--color-ink-subtle)" fontSize="12" fontWeight="600">{percentLabel(share.commits)}</text>
        <text x={cx - arm - 12} y={160} textAnchor="end" fill="var(--color-ink)" fontSize="12">Commits</text>
        {share.issues > 0 && (
          <text x={cx + arm + 12} y={144} textAnchor="start" fill="var(--color-ink-subtle)" fontSize="12" fontWeight="600">{percentLabel(share.issues)}</text>
        )}
        <text x={cx + arm + 12} y={share.issues > 0 ? 160 : 154} textAnchor="start" fill="var(--color-ink)" fontSize="12">Issues</text>
      </svg>
      <p className="text-center text-[11px] leading-relaxed text-[var(--color-ink-subtle)]">
        {activity.commits.toLocaleString("en-US")} commits, {activity.pullRequests.toLocaleString("en-US")} pull requests, {activity.codeReview.toLocaleString("en-US")} reviews, {activity.issues.toLocaleString("en-US")} issues
      </p>
    </figure>
  );
}
