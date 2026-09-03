import {
  achievements,
  educationList,
  experiences,
  introBullets,
  projects,
  resumeLink,
  siteConfig,
  socialMedia,
  techStack,
  type IntroSegment,
} from "@/data/portfolio";
import { getPublishedArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/siteUrl";

const TEXT_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  "Access-Control-Allow-Origin": "*",
} as const;

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  "Access-Control-Allow-Origin": "*",
} as const;

export function flattenSegments(segments: IntroSegment[]): string {
  return segments
    .map((segment) => (segment.type === "link" ? segment.label : segment.value))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function segmentsToMarkdown(segments: IntroSegment[]): string {
  return segments
    .map((segment) => {
      if (segment.type === "link") return `[${segment.label}](${segment.href})`;
      return segment.value;
    })
    .join("");
}

function emailAddress(): string | undefined {
  const href = socialMedia.find((item) => item.platform === "mail")?.link;
  return href?.replace(/^mailto:/i, "");
}

function publishedArticleLinks(siteUrl: string) {
  return getPublishedArticles()
    .map((article) => {
      const humanUrl = new URL(
        article.canonical ?? `/articles/${article.slug}`,
        siteUrl,
      ).toString();
      const markdownUrl = `${siteUrl}/articles/${article.slug}/article.md`;

      return `- [${article.title} — Markdown](${markdownUrl}): ${article.description} [Human-readable article](${humanUrl}).`;
    })
    .join("\n");
}

export function getAgentProfile() {
  const siteUrl = getSiteUrl();

  return {
    name: siteConfig.name,
    title: siteConfig.title,
    role: siteConfig.role,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    url: siteUrl,
    resume: resumeLink,
    seeking:
      "AI Engineering roles around AI agents, quant, and backend. Previously Founder's Office & AI Engineer at Multibagg AI — not current employment.",
    socials: Object.fromEntries(
      socialMedia.map((item) => [item.platform, item.link]),
    ),
    about: introBullets.map((bullet) => flattenSegments(bullet.segments)),
    experience: experiences.map((exp) => ({
      organisation: exp.organisation,
      url: exp.link,
      positions: exp.positions.map((position) => ({
        title: position.title,
        duration: position.duration,
        stack: position.stack?.map((item) => item.name) ?? [],
        highlights: position.content.map((block) =>
          flattenSegments(block.segments),
        ),
      })),
    })),
    education: educationList.map((edu) => ({
      institution: edu.title,
      degree: edu.degree,
      duration: edu.duration,
      details: edu.content,
      url: edu.link,
    })),
    projects: projects.map((project) => ({
      title: project.title,
      summary: project.content,
      highlight: project.highlight,
      stack: project.stack.map((item) => item.name),
      github: project.github,
      live: project.link,
    })),
    achievements: achievements.map((item) => ({
      event: item.event,
      position: item.position,
      highlight: item.highlight,
      article: item.article,
      project: item.project,
    })),
    techStack: techStack.map((item) => item.name),
    machineReadable: {
      llmsTxt: `${siteUrl}/llms.txt`,
      llmsFull: `${siteUrl}/llms-full.txt`,
      json: `${siteUrl}/api/about`,
      articles: `${siteUrl}/articles.json`,
    },
  };
}

export function buildLlmsTxt(): string {
  const siteUrl = getSiteUrl();
  const email = emailAddress();
  const github = socialMedia.find((item) => item.platform === "github")?.link;
  const linkedin = socialMedia.find((item) => item.platform === "linkedin")?.link;
  const twitter = socialMedia.find((item) => item.platform === "twitter")?.link;
  const articleLinks = publishedArticleLinks(siteUrl);

  const projectLinks = projects
    .map((project) => {
      const url = project.link ?? project.github;
      if (!url) return null;
      const note = project.highlight
        ? `${project.content} (${project.highlight})`
        : project.content;
      return `- [${project.title}](${url}): ${note}`;
    })
    .filter(Boolean)
    .join("\n");

  const contactLinks = [
    email ? `- [Email](mailto:${email})` : null,
    linkedin ? `- [LinkedIn](${linkedin})` : null,
    github ? `- [GitHub](${github})` : null,
    twitter ? `- [X](${twitter})` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const optionalRepos = projects
    .filter((project) => project.github)
    .map(
      (project) =>
        `- [${project.title} source](${project.github}): Repository for ${project.title}`,
    )
    .join("\n");

  return `# ${siteConfig.name}

> ${siteConfig.description} Looking for AI Engineering roles around agents, quant, and backend.

This is a personal portfolio. Prefer [llms-full.txt](${siteUrl}/llms-full.txt) for a complete markdown CV, or [GET /api/about](${siteUrl}/api/about) for the same data as JSON. Multibagg AI is a previous role, not current employment.

## Profile

- [Full markdown CV](${siteUrl}/llms-full.txt): About, experience, education, projects, certifications, and tech stack
- [JSON profile](${siteUrl}/api/about): Same content as structured JSON
- [Human-readable site](${siteUrl}/): Visual portfolio
- [Résumé](${resumeLink}): PDF résumé

## Projects

${projectLinks}

## Articles

${articleLinks || "No published articles yet."}

## Contact

${contactLinks}

## Optional

- [GitHub profile](https://github.com/${siteConfig.githubUsername}): Source repositories
${optionalRepos}
`.replace(/\n{3,}/g, "\n\n");
}

export function buildLlmsFullTxt(): string {
  const siteUrl = getSiteUrl();
  const email = emailAddress();
  const articleLinks = publishedArticleLinks(siteUrl);

  const about = introBullets
    .map((bullet) => `- ${segmentsToMarkdown(bullet.segments)}`)
    .join("\n");

  const experience = experiences
    .flatMap((exp) =>
      exp.positions.map((position) => {
        const bullets = position.content
          .map((block) => `  - ${segmentsToMarkdown(block.segments)}`)
          .join("\n");
        const stack = position.stack?.map((item) => item.name).join(", ");
        return `### ${position.title} — [${exp.organisation}](${exp.link})\n\n${position.duration}${stack ? `\n\nStack: ${stack}` : ""}\n\n${bullets}`;
      }),
    )
    .join("\n\n");

  const education = educationList
    .map((edu) => {
      const details = edu.content.map((line) => `- ${line}`).join("\n");
      const title = edu.link ? `[${edu.title}](${edu.link})` : edu.title;
      return `### ${edu.degree}, ${title}\n\n${edu.duration}\n\n${details}`;
    })
    .join("\n\n");

  const projectBlocks = projects
    .map((project) => {
      const links = [
        project.link ? `[Live](${project.link})` : null,
        project.github ? `[GitHub](${project.github})` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      const stack = project.stack.map((item) => item.name).join(", ");
      return `### ${project.title}\n\n${project.highlight ? `*${project.highlight}*\n\n` : ""}${project.content}${links ? `\n\n${links}` : ""}${stack ? `\n\nStack: ${stack}` : ""}`;
    })
    .join("\n\n");

  const certs = achievements
    .map((item) => {
      const proof = item.article ?? item.project;
      const proofMd = proof ? ` ([proof](${proof}))` : "";
      return `- **${item.event}** — ${item.position}. ${item.highlight}${proofMd}`;
    })
    .join("\n");

  const socials = socialMedia
    .filter((item) => item.platform !== "mail")
    .map((item) => `- ${item.label}: ${item.link}`)
    .join("\n");

  return `# ${siteConfig.name}

> ${siteConfig.tagline}

${siteConfig.description}

Source: [${siteUrl}](${siteUrl}). Machine-readable index: [${siteUrl}/llms.txt](${siteUrl}/llms.txt). JSON: [${siteUrl}/api/about](${siteUrl}/api/about).

## About

${about}

## Contact

${email ? `- Email: ${email}` : ""}
${socials}
- Résumé: ${resumeLink}

## Experience

${experience}

## Education

${education}

## Projects

${projectBlocks}

## Articles

${articleLinks || "No published articles yet."}

## Hackathons & certifications

${certs}

## Tech stack

${techStack.map((item) => item.name).join(", ")}
`.replace(/\n{3,}/g, "\n\n");
}

export function markdownResponse(body: string): Response {
  return new Response(body, { headers: TEXT_HEADERS });
}

export function jsonResponse(body: unknown): Response {
  return Response.json(body, { headers: JSON_HEADERS });
}
