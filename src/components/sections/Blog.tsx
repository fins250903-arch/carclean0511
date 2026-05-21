import React from 'react';
import { useState } from 'react';
import { getRegionalBlogDisplayPosts, getRegionIdFromName } from '@/lib/getRegionalBlogDisplayPosts';
import { useRegion } from '@/lib/RegionContext';

type BlogPost = {
    title: string;
    excerpt: string;
    date: string;
    image: string;
    category: string;
    url: string;
};

export default function Blog({ regionName: propRegionName, displayName: propDisplayName }: { regionName?: string, displayName?: string }) {
    const context = useRegion();
    const regionName = propRegionName || context.regionName;
    const displayName = propDisplayName || context.displayName;
    const regionId = getRegionIdFromName(regionName);

    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const regionalDisplayPosts: BlogPost[] = getRegionalBlogDisplayPosts(regionId, regionName);

    const handlePostClick = (post: BlogPost) => {
        if (post.url) {
            window.location.href = post.url;
        } else {
            setSelectedPost(post);
        }
    };

    const renderPostCard = (post: BlogPost, index: number) => (
        <article 
            key={index} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
            onClick={() => handlePostClick(post)}
        >
            <div className="h-48 overflow-hidden">
                <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/rinser.webp';
                    }}
                />
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-primary px-2 py-1 bg-blue-50 rounded">
                        {post.category}
                    </span>
                    <span className="text-gray-400 text-xs">{post.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                    {post.excerpt}
                </p>
                <span className="text-primary font-bold text-sm flex items-center gap-1">
                    詳しく見る <span className="text-lg">→</span>
                </span>
            </div>
        </article>
    );

    return (
        <section className="py-12 bg-gray-50 border-t border-gray-200" id="blog">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        施工実例
                    </h2>
                    <p className="text-gray-600 text-lg">
                        {regionName}での活動実績
                    </p>
                </div>

                {regionalDisplayPosts.length > 0 && (
                    <div className="mb-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {regionalDisplayPosts.map((post, index) => renderPostCard(post, index))}
                        </div>
                    </div>
                )}

                <div className="text-center mt-12">
                    <a 
                        href={`/blog/?region=${encodeURIComponent(regionName)}`}
                        className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-full transition-all"
                    >
                        最新の施工事例一覧を見る →
                    </a>
                </div>
            </div>

            {selectedPost && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 relative">
                        <button 
                            onClick={() => setSelectedPost(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                        </button>
                        <div className="mb-6">
                            <span className="text-primary font-bold text-sm bg-blue-50 px-3 py-1 rounded-full mb-4 inline-block">
                                {selectedPost.category}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                {selectedPost.title}
                            </h2>
                            <p className="text-gray-400 text-sm mt-2">{selectedPost.date}</p>
                        </div>
                        <img 
                            src={selectedPost.image} 
                            alt={selectedPost.title} 
                            className="w-full h-64 object-cover rounded-xl mb-6 shadow-md"
                        />
                        <div className="prose prose-blue max-w-none">
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {selectedPost.excerpt}
                                <br /><br />
                                ※詳細な内容は公式ブログにて公開しております。そちらもあわせてご覧ください。
                            </p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center">
                            <button 
                                onClick={() => setSelectedPost(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-10 rounded-full transition-colors"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
