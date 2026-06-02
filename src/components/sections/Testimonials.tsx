import React from 'react';
import { useRegion } from '@/lib/RegionContext';
import { localCaseStudies } from '@/data/localCaseStudies';

export default function Testimonials({ regionName: propRegionName, displayName: propDisplayName }: { regionName?: string, displayName?: string }) {
    const context = useRegion();
    const regionName = propRegionName || context.regionName;
    const displayName = propDisplayName || context.displayName;
    
    // Fetch regional cases
    const regionCases = localCaseStudies.filter(c => c.region === regionName || c.region === displayName);
    
    return (
        <section className="py-10 bg-white" id="testimonials">
            <div className="container mx-auto px-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        {displayName}周辺の施工事例
                    </h2>
                    <p className="text-gray-600">
                        実際に当店をご利用いただいたお客様の施工実績です。
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {regionCases.length > 0 ? (
                        regionCases.map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col">
                                <div className="h-64 relative">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        {item.city}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                                    <div className="space-y-4 text-sm text-gray-600">
                                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                                            <p className="font-bold text-gray-700 mb-1">■ お悩み</p>
                                            <p>{item.problem}</p>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                            <p className="font-bold text-green-700 mb-1">■ プロの解決策</p>
                                            <p>{item.professionalInsight}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="font-bold text-gray-800">
                                            <span className="text-accent mr-2">✨ 結果：</span>
                                            {item.result}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                            現在、{displayName}の施工事例を準備中です。ブログで最新の実績を公開しております。
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
