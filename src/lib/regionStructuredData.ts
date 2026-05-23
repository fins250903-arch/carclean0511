import { regionAreaData } from '@/data/regionAreaData';
import { getRegionalPost } from '@/lib/getRegionalPost';
import type { RegionalBlogDisplayPost } from '@/lib/getRegionalBlogDisplayPosts';

const MAX_AREA_CITIES = 16;

/** regionAreaData から LocalBusiness.areaServed を生成（地域密着・AI Overview向け） */
export function buildDefaultAreaServed(regionName: string): { '@type': string; name: string }[] {
  const config = regionAreaData[regionName];
  if (!config) {
    return [{ '@type': 'AdministrativeArea', name: regionName }];
  }
  const cities: string[] = [];
  for (const group of config.areas) {
    for (const city of group.cities) {
      cities.push(city);
      if (cities.length >= MAX_AREA_CITIES) {
        return cities.map((name) => ({ '@type': 'AdministrativeArea', name }));
      }
    }
  }
  return cities.map((name) => ({ '@type': 'AdministrativeArea', name }));
}

export type RegionSeoOverridesInput = {
  regionName: string;
  displayName: string;
  blogCases: RegionalBlogDisplayPost[];
};

export type RegionSeoOverrides = {
  displayName: string;
  aiSummary?: string;
  articles?: Array<{
    headline: string;
    description: string;
    image: string;
    url?: string;
  }>;
  localBusiness?: {
    areaServed?: unknown;
    description?: string;
    geo?: Record<string, unknown>;
  };
};

export function buildRegionSeoOverrides({
  regionName,
  displayName,
  blogCases,
}: RegionSeoOverridesInput): RegionSeoOverrides {
  const post = getRegionalPost(regionName);
  const defaultAreaServed = buildDefaultAreaServed(regionName);
  const areaServed = post?.structuredData?.areaServed ?? defaultAreaServed;
  const description =
    post?.structuredData?.description ??
    `${regionName}全域に出張 車内 清掃対応。車内クリーニング・シート洗浄・嘔吐・ペット臭・灯油こぼしの消臭洗浄を地域密着で施工します。`;

  const articlesFromBlog = blogCases.map((c) => ({
    headline: c.title,
    description: c.excerpt,
    image: c.image,
    url: c.url,
  }));

  const articlesFromRegional =
    post?.title && post?.excerpt && post?.image
      ? [
          {
            headline: post.title,
            description: post.excerpt,
            image: post.image,
          },
        ]
      : [];

  const articles = [...articlesFromBlog];
  for (const a of articlesFromRegional) {
    if (articles.length >= 2) break;
    if (!articles.some((x) => x.headline === a.headline)) {
      articles.push(a);
    }
  }

  return {
    displayName,
    aiSummary: post?.aiSummary,
    articles: articles.length > 0 ? articles.slice(0, 2) : undefined,
    localBusiness: {
      areaServed,
      description,
      geo: post?.structuredData?.geo
        ? {
            ...post.structuredData.geo,
            addressRegion: regionName,
          }
        : {
            '@type': 'GeoShape',
            addressRegion: regionName,
          },
    },
  };
}
