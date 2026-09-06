import type { CollectionEntry } from 'astro:content';
import { buildBlogAnswerFirst, toExcerpt } from '@/lib/blogAnswerFirst';
import { resolvePostRegionIds } from '@/lib/blogRegion';
import { canonicalUrl } from '@/lib/site';

export type RelatedBlogPost = {
  title: string;
  href: string;
  description: string;
};

type BlogPost = CollectionEntry<'blog'>;

function getSlug(post: BlogPost): string {
  return post.id.replace(/\/index$/, '');
}

function scoreRelated(
  currentId: string,
  currentTrouble: string | undefined,
  currentRegions: string[],
  candidate: BlogPost,
): number {
  if (candidate.id === currentId) return 0;
  if (candidate.data.seo?.noindex) return 0;

  const regionIds = resolvePostRegionIds(candidate);
  const answer = buildBlogAnswerFirst({
    title: candidate.data.title,
    areaName: candidate.data.areaName,
    body: candidate.body,
    summary: candidate.data.summary,
  });

  let score = 0;
  if (currentTrouble && answer.trouble === currentTrouble) score += 3;
  if (currentRegions.some((id) => regionIds.includes(id))) score += 2;
  if (answer.kind === 'case') score += 1;
  return score;
}

/** Same-trouble / same-region case studies so posts interlink instead of dead-ending */
export function buildRelatedBlogPosts(
  current: BlogPost,
  allPosts: BlogPost[],
  options: { trouble?: string; regionIds: string[]; limit?: number },
): RelatedBlogPost[] {
  const limit = options.limit ?? 3;
  const ranked = allPosts
    .map((post) => ({
      post,
      score: scoreRelated(current.id, options.trouble, options.regionIds, post),
    }))
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.data.date.valueOf() - a.post.data.date.valueOf();
    })
    .slice(0, limit);

  return ranked.map(({ post }) => {
    const answer = buildBlogAnswerFirst({
      title: post.data.title,
      areaName: post.data.areaName,
      body: post.body,
      summary: post.data.summary,
    });
    return {
      title: post.data.title,
      href: canonicalUrl(`/blog/${getSlug(post)}`),
      description: toExcerpt(answer.text, 90),
    };
  });
}
