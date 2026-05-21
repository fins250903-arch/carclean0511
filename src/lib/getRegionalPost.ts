import { regionalPosts, type RegionalPost } from '@/data/regionalPosts';

/** 大阪府など表記ゆれを吸収して地域コンテンツを取得 */
export function getRegionalPost(regionName: string): RegionalPost | undefined {
  if (regionalPosts[regionName]) {
    return regionalPosts[regionName];
  }
  const short = regionName.replace('府', '').replace('県', '');
  if (regionalPosts[short]) {
    return regionalPosts[short];
  }
  if (regionName === '大阪府') {
    return regionalPosts['大阪'];
  }
  return undefined;
}
