import {
  achievements,
  educationList,
  experiences,
  navSections,
  projects,
  resumeLink,
  socialMedia,
} from "@/data/portfolio";
import {
  CONTACT_KINDS,
  NAV_SECTION_IDS,
  PROJECT_LINK_KINDS,
  type ContactKind,
  type NavSectionId,
  type ProjectLinkKind,
} from "@/voice/types";

export const sectionIds = navSections.map((section) => section.id);

export const projectCatalog = projects.map((project) => ({
  id: project.id,
  title: project.title,
  summary: project.content,
  highlight: project.highlight,
  live: project.link ?? null,
  github: project.github ?? null,
  readme: project.readme ?? null,
  youtube: project.youtube ?? null,
  hasDemo: Boolean(project.video),
}));

export const experienceCatalog = experiences.map((experience) => ({
  id: experience.id,
  organisation: experience.organisation,
  url: experience.link,
}));

export const educationCatalog = educationList.map((education) => ({
  id: education.id,
  institution: education.title,
  degree: education.degree,
}));

export const achievementCatalog = achievements.map((achievement) => ({
  id: achievement.id,
  event: achievement.event,
  position: achievement.position,
}));

const projectById = new Map(projectCatalog.map((project) => [project.id, project]));
const experienceIds = new Set(experienceCatalog.map((item) => item.id));
const educationIds = new Set(educationCatalog.map((item) => item.id));
const achievementIds = new Set(achievementCatalog.map((item) => item.id));
const sectionIdSet = new Set<string>(NAV_SECTION_IDS);

export function isNavSectionId(value: string): value is NavSectionId {
  return sectionIdSet.has(value);
}

export function isProjectId(value: string) {
  return projectById.has(value);
}

export function isExperienceId(value: string) {
  return experienceIds.has(value);
}

export function isEducationId(value: string) {
  return educationIds.has(value);
}

export function isAchievementId(value: string) {
  return achievementIds.has(value);
}

export function isProjectLinkKind(value: string): value is ProjectLinkKind {
  return (PROJECT_LINK_KINDS as readonly string[]).includes(value);
}

export function isContactKind(value: string): value is ContactKind {
  return (CONTACT_KINDS as readonly string[]).includes(value);
}

export function getProject(id: string) {
  return projectById.get(id);
}

export function getProjectLink(id: string, kind: ProjectLinkKind) {
  const project = projectById.get(id);
  if (!project) return null;
  if (kind === "live") return project.live;
  if (kind === "github") return project.github;
  if (kind === "readme") return project.readme;
  return project.youtube;
}

export function getContactUrl(kind: ContactKind) {
  if (kind === "resume") return resumeLink;
  if (kind === "email") {
    return socialMedia.find((item) => item.platform === "mail")?.link ?? null;
  }
  if (kind === "twitter") {
    return socialMedia.find((item) => item.platform === "twitter")?.link ?? null;
  }
  if (kind === "linkedin") {
    return socialMedia.find((item) => item.platform === "linkedin")?.link ?? null;
  }
  return socialMedia.find((item) => item.platform === "github")?.link ?? null;
}

export function isArticleSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
