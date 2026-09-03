export type ArticleSocialLinks = {
  twitter?: string;
  linkedin?: string;
};

export type ArticleFrontmatter = {
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  tags: string[];
  cover?: string;
  draft: boolean;
  featured?: boolean;
  canonical?: string;
  social: ArticleSocialLinks;
};

export type ArticleHeading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

export type ArticleSummary = ArticleFrontmatter & {
  slug: string;
  readingTime: string;
};

export type Article = ArticleSummary & {
  body: string;
  headings: ArticleHeading[];
  data: Record<string, unknown>;
};
