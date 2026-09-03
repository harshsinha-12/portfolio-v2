# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this portfolio project. Session Replay and Error Tracking were already enabled, Support was enabled, and the health, scout, error-tracking, support, and selected GitHub Issues responder routes are enabled.

The scout fleet and two Replay Vision monitors are armed. Findings should start appearing in the [Self-driving inbox](https://us.posthog.com/project/591460/inbox) within about 30 minutes once the project has traffic and recordings.

## AI data processing

Approved. The organization-level AI data processing gate was approved before this setup ran.

## GitHub

The PostHog GitHub App was already connected for `harshsinha-12/portfolio-v2`. GitHub Issues was selected, but the repository-source confirmation was skipped, so no GitHub warehouse source was created.

## Products enabled

| Product | Result | Client check |
| --- | --- | --- |
| Session Replay | Already enabled | `instrumentation-client.ts` keeps `disable_session_recording: false`. |
| Error Tracking | Already enabled | `instrumentation-client.ts` keeps `capture_exceptions: true`. |
| Support (Conversations) | Enabled | An inbound email, inbox, or Slack channel is still required before support tickets arrive. |

## Signal sources

| Signal source | Action |
| --- | --- |
| `signals_scout` / `cross_source_issue` | Enabled (config `01a0653c-3ae6-7992-be99-fab34ce5c4c0`). |
| `health_checks` / `health_issue` | Enabled (config `01a0653c-3b17-7a73-aeba-92c4fff13aa1`). |
| `error_tracking` / `issue_created` | Enabled (config `01a0653c-3acd-7803-b893-6e4ff19aab9f`). |
| `error_tracking` / `issue_reopened` | Enabled (config `01a0653c-3b12-71f1-ba79-2c22927edd85`). |
| `error_tracking` / `issue_spiking` | Enabled (config `01a0653c-3c53-72ce-8e4e-a31fa10ddc3c`). |
| `conversations` / `ticket` | Enabled (config `01a0653c-3b25-73d7-81cf-acd9e68b2888`). |
| `github` / `issue` | Enabled but dormant (config `01a0653e-e838-7cd8-9c6d-ed259440ce29`) until a GitHub Issues warehouse source is connected. |
| Session replay source row | Deliberately not created; Replay Vision monitors are its Self-driving route. |

## Connected tools

| Tool | Result |
| --- | --- |
| GitHub Issues | Selected but no source detected (dormant). The responder is enabled, but no warehouse source was created because repository confirmation was skipped. |
| Linear, Jira, Sentry, Zendesk, and other tools | Not used in this setup. |

## Scout troop

**Active scouts (5):**

| Scout | Why it is active |
| --- | --- |
| `signals-scout-general` | Cross-product patterns and surfaces without a dedicated specialist. |
| `signals-scout-web-analytics` | Web traffic, attribution, landing-page health, and 404 regressions. |
| `signals-scout-product-analytics` | Visitor-flow conversion, retention, lifecycle, and engagement regressions. |
| `signals-scout-project-discovery-engagement` | Approved custom coverage for project-card and outbound project engagement. |
| `signals-scout-contact-path-engagement` | Approved custom coverage for résumé, social, and contact-path engagement. |

**Disabled scouts (24):**

| Scout | Reason |
| --- | --- |
| `signals-scout-ai-observability` | No AI observability telemetry was found. |
| `signals-scout-anomaly-detection` | No saved dashboard or insight activity was available to rank it above the selected site specialists. |
| `signals-scout-apm` | No distributed tracing or APM usage was found. |
| `signals-scout-conversations` | Support was newly enabled but no inbound channel or ticket activity exists yet. |
| `signals-scout-csp-violations` | No CSP reporting configuration was found. |
| `signals-scout-customer-analytics` | No account/group analytics evidence was found. |
| `signals-scout-data-pipelines` | No CDP destination, batch export, or Hog flow evidence was found. |
| `signals-scout-data-warehouse` | No live warehouse source exists. |
| `signals-scout-error-tracking` | Covered by the enabled native Error Tracking source. |
| `signals-scout-experiments` | No active experiment evidence was found. |
| `signals-scout-feature-flags` | No active feature-flag evidence was found. |
| `signals-scout-health-checks` | Native health-check source is enabled; the focused fleet remains selective. |
| `signals-scout-inbox-validation` | Fresh setup has no resolved Self-driving reports to validate. |
| `signals-scout-insight-alerts` | No insight-alert evidence was found. |
| `signals-scout-logs` | No active logs usage was confirmed. |
| `signals-scout-mcp-tool-calls` | This app is not a PostHog MCP-tool surface. |
| `signals-scout-observability-gaps` | No project profile was available to identify high-volume uncovered events. |
| `signals-scout-replay-vision` | Kept off initially; the two new scanners have no observations yet. |
| `signals-scout-revenue-analytics` | No payment or revenue telemetry was found. |
| `signals-scout-session-replay` | Covered by the enabled Replay Vision monitors. |
| `signals-scout-skills-store` | Not a core portfolio product surface. |
| `signals-scout-surveys` | Surveys are not enabled or in use. |
| `signals-scout-tasks` | No PostHog Tasks usage was found. |
| `signals-scout-web-vitals` | No web-vitals evidence was available to rank it above the selected web-traffic scout. |

**Run budget:** 100 maximum runs/day; 0 used and 100 remaining at configuration time. The current announcement says: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

| Custom scout | Coverage and discriminator |
| --- | --- |
| `signals-scout-project-discovery-engagement` | Watches project previews and project-link engagement from `ProjectsSection` and `ProjectPreviewVideo`. It reports only when project engagement rate or destination share changes materially while overall site traffic remains stable; this adds a project-specific discriminator beyond the general and product analytics scouts. |
| `signals-scout-contact-path-engagement` | Watches résumé, social, and contact interactions from `ProfileSection`, `Footer`, and `FloatingNav`. It reports only when a contact-path rate drops materially against stable visits or an established placement remains near zero; this protects a distinct recruiter/contact path. |

The codebase’s GitHub-contribution display was considered but ruled out because it does not expose a concrete PostHog success/failure surface. Both custom scouts deduplicate findings and ignore sparse, incomplete, test, redesign, and traffic-wide changes. If either becomes noisy, set its scout config `emit` to `false` in PostHog to run it in dry-run mode.

## Replay Vision scanners

A Replay Vision scanner is an LLM that watches individual session recordings on a schedule and pushes clear defects into Self-driving. It is the only component in this setup that spends Replay Vision quota. Scanner findings arrive at half weight and require independent corroboration before promotion into a report.

| Brief | Scanner | Status and scope | Sampling | Estimate |
| --- | --- | --- | --- | --- |
| Breakage monitor | `Portfolio browsing breakage` | Created. Watches recordings on the portfolio’s root browsing flow, where visitors browse projects, experience, achievements, and contact links. This is the site’s immediate engagement/completion path. | 0.5 | 0 observations/month; 0 credits/month. |
| Frustration monitor | `Portfolio interaction frustration` | Created. Watches only recordings containing `$rageclick`; it has no URL filter to preserve its distinct behavioral scope. | 1.0 | 0 observations/month; 0 credits/month. |

There were no recordings when configured, so both monitors are armed and will start working when recordings begin. The organization had 2,500 Replay Vision credits remaining for the current period, with no current or projected scanner spend.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so the enabled Support responder can receive tickets.
- [ ] To activate the selected GitHub Issues responder, create a GitHub warehouse source for `harshsinha-12/portfolio-v2` from [New data warehouse source](https://us.posthog.com/project/591460/pipeline/new/source). The responder remains harmlessly dormant until syncing starts.
- [ ] The project profile was not yet available, and the MCP connection lacks the data-schema read scope. Once traffic arrives, review the first scout runs and scanner observations to confirm the captured events and tune the enabled specialists if needed.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scouts consume the shared daily run budget, while Replay Vision monitors analyze newly matching recordings. Findings cluster into reports in the [Self-driving inbox](https://us.posthog.com/project/591460/inbox), where immediately actionable findings can start coding tasks.

## Files modified or created

- Created `posthog-self-driving-report.md`.
- Installed the local workflow references under `.claude/skills/replay-vision-scanners-core/`, `.claude/skills/replay-vision-scanner-broken-experiences/`, and `.claude/skills/replay-vision-scanner-user-frustration/`.
- No application source files were changed.
