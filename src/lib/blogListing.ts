import type { CollectionEntry } from 'astro:content';
import { regions } from '@/data/regions';
import { normalizeRegionCategory, resolvePostRegionIds } from '@/lib/blogRegion';

export type BlogPost = CollectionEntry<'blog'>;

export { normalizeRegionCategory };

export function getPostRegionIds(post: BlogPost): string[] {
  return resolvePostRegionIds(post);
}

/** Sort key: latest edit or publish time */
export function getPostSortTime(post: BlogPost): number {
  const updated = post.data.updatedDate?.valueOf();
  const published = post.data.date.valueOf();
  return Math.max(updated ?? 0, published);
}

export function comparePostsByNewest(a: BlogPost, b: BlogPost): number {
  const diff = getPostSortTime(b) - getPostSortTime(a);
  if (diff !== 0) return diff;
  return b.id.localeCompare(a.id);
}

export function sortPostsByNewest(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(comparePostsByNewest);
}

export type RegionBlogGroup = {
  regionId: string;
  regionName: string;
  posts: BlogPost[];
  latestTime: number;
};

/** Group posts under each region they belong to; each post may appear in multiple sections */
export function buildRegionBlogGroups(posts: BlogPost[]): RegionBlogGroup[] {
  const byId = new Map<string, BlogPost[]>();

  for (const post of posts) {
    const regionIds = getPostRegionIds(post);
    for (const regionId of regionIds) {
      const list = byId.get(regionId) ?? [];
      list.push(post);
      byId.set(regionId, list);
    }
  }

  const groups: RegionBlogGroup[] = [];

  for (const region of regions) {
    const raw = byId.get(region.id);
    if (!raw?.length) continue;
    const sorted = sortPostsByNewest(raw);
    groups.push({
      regionId: region.id,
      regionName: region.name,
      posts: sorted,
      latestTime: getPostSortTime(sorted[0]!),
    });
  }

  return groups.sort((a, b) => b.latestTime - a.latestTime);
}

export function getOtherBlogPosts(posts: BlogPost[]): BlogPost[] {
  return sortPostsByNewest(
    posts.filter((post) => getPostRegionIds(post).length === 0),
  );
}

export function resolveRegionNameFromQuery(value: string | null): string | null {
  if (!value) return null;
  const decoded = decodeURIComponent(value).trim();
  const byName = regions.find((r) => r.name === decoded);
  if (byName) return byName.name;
  const byId = regions.find((r) => r.id === decoded.toLowerCase());
  return byId?.name ?? null;
}
