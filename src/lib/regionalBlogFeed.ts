import type { CollectionEntry } from 'astro:content';
import { buildBlogAnswerFirst, toExcerpt } from '@/lib/blogAnswerFirst';
import { getRegionNameById, resolvePostRegionIds } from '@/lib/blogRegion';
import { resolvePostImage } from '@/lib/blogSeo';
import { canonicalUrl } from '@/lib/site';
import type { RegionalBlogDisplayPost } from '@/lib/getRegionalBlogDisplayPosts';

type BlogPost = CollectionEntry<'blog'>;

const FALLBACK_IMAGE = '/images/rinser.webp';

function getSlug(post: BlogPost): string {
  return post.id.replace(/\/index$/, '');
}

function getSortTime(post: BlogPost): number {
  return Math.max(post.data.updatedDate?.valueOf() ?? 0, post.data.date.valueOf());
}

function formatDisplayDate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}.${month}.${day}`;
}

function toDisplayPost(post: BlogPost, fallbackArea?: string): RegionalBlogDisplayPost {
  const slug = getSlug(post);
  const answer = buildBlogAnswerFirst({
    title: post.data.title,
    areaName: post.data.areaName,
    body: post.body,
    summary: post.data.summary,
    fallbackArea,
  });
  const image =
    resolvePostImage(post.data.coverImage, slug) ??
    resolvePostImage(post.data.ogp?.og_image, slug) ??
    FALLBACK_IMAGE;

  return {
    title: post.data.title,
    excerpt: toExcerpt(answer.text, 110),
    date: formatDisplayDate(post.data.updatedDate ?? post.data.date),
    datePublished: post.data.date.toISOString(),
    image,
    url: canonicalUrl(`/blog/${slug}`),
    category: '施工実例',
  };
}

/**
 * Region id → newest posts, so every region LP shows the latest case studies
 * without anyone editing a hardcoded list.
 *
 * Rebuilding this for each of the ~900 generated pages would re-parse every
 * article body, so the result is cached per content snapshot.
 */
let cache: { key: string; feed: Map<string, RegionalBlogDisplayPost[]> } | null = null;

function cacheKey(posts: BlogPost[]): string {
  let bodyLength = 0;
  let newest = 0;
  for (const post of posts) {
    bodyLength += post.body?.length ?? 0;
    newest = Math.max(newest, getSortTime(post));
  }
  return `${posts.length}:${bodyLength}:${newest}`;
}

export function buildRegionalBlogFeed(
  posts: BlogPost[],
): Map<string, RegionalBlogDisplayPost[]> {
  const key = cacheKey(posts);
  if (cache?.key === key) return cache.feed;

  const sorted = [...posts].sort((a, b) => getSortTime(b) - getSortTime(a));
  const feed = new Map<string, RegionalBlogDisplayPost[]>();

  for (const post of sorted) {
    if (post.data.seo?.noindex) continue;
    const regionIds = resolvePostRegionIds(post);
    const display = toDisplayPost(post, getRegionNameById(regionIds[0] ?? ''));
    for (const regionId of regionIds) {
      const list = feed.get(regionId) ?? [];
      list.push(display);
      feed.set(regionId, list);
    }
  }

  cache = { key, feed };
  return feed;
}

/** Newest posts for one region (empty when the region has no post yet) */
export function getLatestRegionalPosts(
  posts: BlogPost[],
  regionId: string | undefined,
  limit = 2,
): RegionalBlogDisplayPost[] {
  if (!regionId) return [];
  return buildRegionalBlogFeed(posts).get(regionId)?.slice(0, limit) ?? [];
}
