import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: '車内清掃「特急便」ブログ',
		description: '車内クリーニング・消臭洗浄の施工事例やお役立ち情報',
		site: context.site,
		items: posts.map((post) => {
			const slug = post.id.replace(/\/index$/, '');
			return {
				title: post.data.title,
				pubDate: post.data.date,
				description: post.data.description || '',
				link: `/blog/${slug}/`,
			};
		}),
	});
}
