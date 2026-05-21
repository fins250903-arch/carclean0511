import React from 'react';
import { useState } from 'react';
import { regionalPosts } from '@/data/regionalPosts';
import { useRegion } from '@/lib/RegionContext';

export default function Blog({ regionName: propRegionName, displayName: propDisplayName }: { regionName?: string, displayName?: string }) {
    const context = useRegion();
    const regionName = propRegionName || context.regionName;
    const displayName = propDisplayName || context.displayName;

    type BlogPost = {
        id: number;
        title: string;
        excerpt: string;
        date: string;
        image: string;
        category: string;
        url?: string;
        regionName?: string;
        niche?: 'car' | 'truck' | 'coating';
    };

    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    // Merge base posts with regional posts
    const basePosts: BlogPost[] = [
        {
            id: 1,
            title: "車内嘔吐の正しい対処法と、プロの除菌技術",
            excerpt: "もし車内で嘔吐してしまったら…被害を最小限に抑えるための応急処置と、プロが行う徹底洗浄の内容を解説します。",
            date: "2024.04.19",
            image: "/images/cases/sienta_vomit_5.webp",
            category: "ノウハウ",
            url: "https://carinteriorcleaning.jp/blog/2026/04/19/childouto/",
            niche: 'car'
        },
        {
            id: 2,
            title: "トラックキャビンの悪臭、原因はタバコだけじゃない？",
            excerpt: "長距離トラックのキャビンに染み付いた臭い。皮脂汚れやカビなど、見えない原因を根こそぎ除去する方法。",
            date: "2024.03.10",
            image: "/images/truck-fv.png",
            category: "トラック清掃",
            url: "https://carinteriorcleaning.jp/regions/osaka-truck/",
            niche: 'truck'
        },
        {
            id: 3,
            title: "100均3品で解決！中古車のタバコ臭を業者並みに消す超簡単術",
            excerpt: "中古車特有のタバコの臭い。100円ショップで手に入る身近なアイテムを使って、プロに近い消臭効果を得る裏技を公開。",
            date: "2024.03.14",
            image: "/images/rinser.webp",
            category: "消臭ノウハウ",
            url: "https://carinteriorcleaning.jp/blog/2026/03/12/100kinnioi/",
            niche: 'car'
        }
    ];

    const currentRegionPost = regionalPosts[regionName] || regionalPosts[regionName.replace('府', '').replace('県', '')];
    const regionalDisplayPosts = currentRegionPost 
        ? [{ ...currentRegionPost, category: '実例・実績', date: '2024.05.20' }]
        : [];

    const usefulPosts = basePosts
        .filter(post => post.niche === context.niche)
        .map(post => ({ ...post, regionName: displayName }));

    const handlePostClick = (post: BlogPost) => {
        if (post.url) {
            window.location.href = post.url;
        } else {
            setSelectedPost(post);
        }
    };

    const renderPostCard = (post: any, index: number) => (
        <article 
            key={index} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
            onClick={() => handlePostClick(post as BlogPost)}
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
                        {post.category || "コラム"}
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
                        施工実例・お役立ち情報
                    </h2>
                    <p className="text-gray-600 text-lg">
                        {regionName}での活動実績と、プロが教える車内清掃のノウハウ
                    </p>
                </div>

                {regionalDisplayPosts.length > 0 && (
                    <div className="mb-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {regionalDisplayPosts.slice(0, 2).map((post, index) => renderPostCard(post, index))}
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

            {/* Modal for posts without URL (optional) */}
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
                                ※詳細な内容は現在準備中です。公式ブログにて同様のテーマの記事を公開しておりますので、そちらもあわせてご覧ください。
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
