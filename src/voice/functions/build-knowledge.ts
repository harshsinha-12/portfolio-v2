import "server-only";

import { getPublishedArticles } from "@/lib/articles";
import { buildLlmsFullTxt } from "@/lib/agentProfile";
import {
  achievementCatalog,
  educationCatalog,
  experienceCatalog,
  projectCatalog,
  sectionIds,
} from "@/voice/functions/site-catalog";

export function getPublishedArticleSlugs() {
  return getPublishedArticles().map((article) => article.slug);
}

export function buildVoiceKnowledge() {
  const articles = getPublishedArticles().map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    date: article.date,
    tags: article.tags,
  }));

  const actionCatalog = {
    sections: sectionIds,
    projects: projectCatalog,
    experience: experienceCatalog,
    education: educationCatalog,
    achievements: achievementCatalog,
    articles,
  };

  return `${JSON.stringify(actionCatalog, null, 2)}

---

${buildLlmsFullTxt()}`;
}
