import { regionalExplainerArticles } from '../data/regionalExplainerArticles.ts';
import { getRegionNameById, resolvePostRegionIds } from './blogRegion.ts';

/** Enough of a blog entry to match the `/blog/` region list. */
export type ExplainerSourcePost = {
  id: string;
  data: {
    title: string;
    shortSlug?: string;
    categories?: string[];
    areaName?: string;
    seo?: { noindex?: boolean };
  };
};

export type RegionalExplainerLink = {
  label: string;
  /** Root-relative article URL, trailing slash */
  href: string;
  /** Full article title from the content collection */
  title: string;
};

export type RegionalExplainerSection = {
  heading: string;
  lead: string;
  links: RegionalExplainerLink[];
  listHref: string;
  listLabel: string;
};

export function blogPostSlug(post: { id: string }): string {
  return post.id.replace(/\/index$/, '');
}

function matchesPick(post: ExplainerSourcePost, key: string): boolean {
  const slug = blogPostSlug(post);
  if (post.data.shortSlug === key) return true;
  if (slug === key) return true;
  return slug.split('/').pop() === key;
}

/**
 * Article links for one regional LP.
 *
 * A pick is included only when a real, indexable post belongs to that region
 * under the same rules as the blog list (`resolvePostRegionIds`). Missing or
 * miscategorized picks are skipped. Returns null when nothing is left, so
 * other regions do not render an empty block.
 */
export function resolveRegionalExplainerLinks(
  posts: ExplainerSourcePost[],
  regionId: string | undefined,
): RegionalExplainerSection | null {
  if (!regionId) return null;
  const config = regionalExplainerArticles[regionId];
  if (!config) return null;

  const regionName = getRegionNameById(regionId);
  if (!regionName) return null;

  const regionPosts = posts.filter((post) => {
    if (post.data.seo?.noindex) return false;
    return resolvePostRegionIds(post).includes(regionId);
  });

  const links: RegionalExplainerLink[] = [];
  const used = new Set<string>();

  for (const pick of config.picks) {
    const post = regionPosts.find((candidate) => matchesPick(candidate, pick.key));
    if (!post) continue;
    const slug = blogPostSlug(post);
    if (used.has(slug)) continue;
    used.add(slug);
    links.push({
      label: pick.label,
      title: post.data.title,
      href: `/blog/${slug}/`,
    });
  }

  if (links.length === 0) return null;

  return {
    heading: config.heading,
    lead: config.lead,
    links,
    listHref: `/blog/?region=${encodeURIComponent(regionName)}`,
    listLabel: `${regionName}の記事一覧を見る`,
  };
}
