import {
  dispatchExpandExperience,
  dispatchPlayProjectDemo,
  dispatchShowAchievement,
} from "@/voice/functions/events";
import { focusDomTarget, scrollToId } from "@/voice/functions/highlight-target";
import { openOutboundUrl } from "@/voice/functions/open-url";
import { getContactUrl, getProjectLink } from "@/voice/functions/site-catalog";
import {
  achievementDomId,
  articleDomId,
  educationDomId,
  experienceDomId,
  projectDomId,
} from "@/voice/ids";
import type { ActionContext, ActionResult, SiteAction } from "@/voice/types";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

async function ensureHome(ctx: ActionContext, hash?: string) {
  const target = hash ? `/${hash}` : "/";
  if (ctx.pathname !== "/") {
    await ctx.navigate(target);
    await new Promise((resolve) => window.setTimeout(resolve, 380));
  } else if (hash) {
    history.replaceState(null, "", hash);
  }
}

function result(
  tool: ActionResult["tool"],
  ok: boolean,
  message: string,
  details?: ActionResult["details"],
): ActionResult {
  return { ok, tool, message, details };
}

export async function executeSiteAction(
  action: SiteAction,
  ctx: ActionContext,
): Promise<ActionResult> {
  switch (action.type) {
    case "scroll_to_section": {
      await ensureHome(ctx, `#${action.id}`);
      if (action.id === "experience") {
        dispatchExpandExperience();
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
      const ok = await focusDomTarget(action.id, `#${action.id}`);
      return result(
        action.type,
        ok,
        ok ? `Scrolled to ${action.id}.` : `Could not find section ${action.id}.`,
        { id: action.id },
      );
    }
    case "focus_project": {
      const id = projectDomId(action.id);
      await ensureHome(ctx, "#projects");
      const ok = await focusDomTarget(id, "#projects");
      return result(
        action.type,
        ok,
        ok ? `Focused project ${action.id}.` : `Could not find project ${action.id}.`,
        { id: action.id },
      );
    }
    case "focus_experience": {
      const id = experienceDomId(action.id);
      await ensureHome(ctx, "#experience");
      dispatchExpandExperience(action.id);
      await new Promise((resolve) => window.setTimeout(resolve, 80));
      const ok = await focusDomTarget(id, "#experience");
      return result(
        action.type,
        ok,
        ok ? `Focused experience ${action.id}.` : `Could not find that role.`,
        { id: action.id },
      );
    }
    case "focus_education": {
      const id = educationDomId(action.id);
      await ensureHome(ctx, "#experience");
      const ok = await focusDomTarget(id, "#experience");
      return result(
        action.type,
        ok,
        ok ? "Focused education." : "Could not find the education entry.",
        { id: action.id },
      );
    }
    case "focus_achievement": {
      await ensureHome(ctx, "#hackathons");
      scrollToId("hackathons", "start");
      dispatchShowAchievement(action.id);
      await new Promise((resolve) => window.setTimeout(resolve, 280));
      const ok = await focusDomTarget(achievementDomId(action.id), "#hackathons");
      return result(
        action.type,
        ok,
        ok ? `Showed ${action.id}.` : `Could not show that achievement.`,
        { id: action.id },
      );
    }
    case "open_project_link": {
      const url = getProjectLink(action.projectId, action.kind);
      if (!url) {
        return result(action.type, false, `No ${action.kind} link for that project.`);
      }
      const opened = openOutboundUrl(url, action.where ?? "tab");
      if (opened.mode !== "same") {
        await ensureHome(ctx, "#projects");
        await focusDomTarget(projectDomId(action.projectId), "#projects");
      }
      return result(
        action.type,
        opened.ok,
        opened.ok
          ? opened.mode === "same"
            ? `Opened ${action.kind} for ${action.projectId} in this tab.`
            : `Opened ${action.kind} for ${action.projectId} in a new tab.`
          : `Could not open ${url}. Tell the visitor to tap Open on the preview card.`,
        { url, mode: opened.mode },
      );
    }
    case "open_article": {
      await ctx.navigate(`/articles/${action.slug}`);
      await new Promise((resolve) => window.setTimeout(resolve, 280));
      const preview = document.getElementById(articleDomId(action.slug));
      if (preview) {
        await focusDomTarget(articleDomId(action.slug));
      }
      return result(action.type, true, `Opened article ${action.slug}.`, {
        slug: action.slug,
      });
    }
    case "open_articles_index": {
      await ctx.navigate("/articles");
      return result(action.type, true, "Opened the articles index.");
    }
    case "open_resume": {
      const url = getContactUrl("resume");
      if (!url) return result(action.type, false, "Résumé link is missing.");
      const opened = openOutboundUrl(url);
      return result(
        action.type,
        opened.ok,
        opened.ok
          ? opened.mode === "same"
            ? "Opened the résumé in this tab."
            : "Opened the résumé in a new tab."
          : `Could not open ${url}. Tell the visitor to tap Open on the preview card.`,
        { url, mode: opened.mode },
      );
    }
    case "open_contact": {
      const url = getContactUrl(action.kind);
      if (!url) return result(action.type, false, `No ${action.kind} link.`);
      if (action.kind === "email") {
        window.location.href = url;
        return result(action.type, true, "Opened email.", { url });
      }
      const opened = openOutboundUrl(url);
      return result(
        action.type,
        opened.ok,
        opened.ok
          ? opened.mode === "same"
            ? `Opened ${action.kind} in this tab.`
            : `Opened ${action.kind} in a new tab.`
          : `Could not open ${url}. Tell the visitor to tap Open on the preview card.`,
        { url, mode: opened.mode },
      );
    }
    case "go_home": {
      await ctx.navigate("/");
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      return result(action.type, true, "Returned to the homepage.");
    }
    case "play_project_demo": {
      await ensureHome(ctx, "#projects");
      const ok = await focusDomTarget(projectDomId(action.id), "#projects");
      dispatchPlayProjectDemo(action.id);
      return result(
        action.type,
        ok,
        ok ? `Playing the ${action.id} demo.` : `Could not play that demo.`,
        { id: action.id },
      );
    }
    case "scroll_page": {
      const distance =
        action.amount === "section"
          ? Math.round(window.innerHeight * 0.72)
          : Math.round(window.innerHeight * 0.9);
      window.scrollBy({
        top: action.direction === "down" ? distance : -distance,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      return result(
        action.type,
        true,
        `Scrolled ${action.direction}.`,
        { direction: action.direction, amount: action.amount },
      );
    }
  }
}
