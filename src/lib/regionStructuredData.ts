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
  aiSummary?: string;
};

export type RegionSeoOverrides = {
  displayName: string;
  aiSummary?: string;
  articles?: Array<{
    headline: string;
    description: string;
    image: string;
    url?: string;
    datePublished?: string;
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
  aiSummary: aiSummaryOverride,
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
    datePublished: c.datePublished,
  }));

  const articlesFromRegional: NonNullable<RegionSeoOverrides['articles']> =
    post?.title && post?.excerpt && post?.image
      ? [
          {
            headline: post.title,
            description: post.excerpt,
            image: post.image,
          },
        ]
      : [];

  const articles: NonNullable<RegionSeoOverrides['articles']> = [...articlesFromBlog];
  for (const a of articlesFromRegional) {
    if (articles.length >= 2) break;
    if (!articles.some((x) => x.headline === a.headline)) {
      articles.push(a);
    }
  }

  // Prefecture pages do not store latitude/longitude. A GeoShape that only
  // sets addressRegion is not valid GeoCoordinates, so geo is omitted.
  const storedGeo = post?.structuredData?.geo as
    | { '@type'?: string; latitude?: unknown; longitude?: unknown }
    | undefined;
  const geo =
    storedGeo?.['@type'] === 'GeoCoordinates' &&
    storedGeo.latitude != null &&
    storedGeo.latitude !== '' &&
    storedGeo.longitude != null &&
    storedGeo.longitude !== ''
      ? {
          '@type': 'GeoCoordinates' as const,
          latitude: storedGeo.latitude,
          longitude: storedGeo.longitude,
        }
      : undefined;

  return {
    displayName,
    aiSummary: aiSummaryOverride ?? post?.aiSummary,
    articles: articles.length > 0 ? articles.slice(0, 2) : undefined,
    localBusiness: {
      areaServed,
      description,
      ...(geo ? { geo } : {}),
    },
  };
}
