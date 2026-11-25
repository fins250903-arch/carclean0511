import React from 'react';
import { questionnaireTestimonials } from '@/data/questionnaireTestimonials';
import { useRegion } from '@/lib/RegionContext';
import LpImage from '@/components/ui/LpImage';

export default function QuestionnaireTestimonials({
    displayName: propDisplayName,
    onlyIds,
}: {
    displayName?: string;
    onlyIds?: string[];
}) {
    const context = useRegion();
    const displayName = propDisplayName || context.displayName;
    const matched = onlyIds?.length
        ? questionnaireTestimonials.filter((item) => onlyIds.includes(item.id))
        : [];
    const shown = matched.length > 0 ? matched : questionnaireTestimonials;

    return (
        <section className="bg-amber-50 py-16">
            <div className="container mx-auto px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
                        お客様の声
                    </h2>
                    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border-2 border-amber-200 max-w-4xl mx-auto mb-10">
                        <h3 className="text-xl md:text-2xl font-bold text-amber-800 mb-4">
                            ご利用頂いたお客様のアンケート
                        </h3>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            実際にお客様にご記入いただいたアンケートをそのまま掲載しています。<br className="hidden md:block" />
                            手書きの声と一緒に内容をご確認ください。
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {shown.map((item, index) => (
                        <div key={index} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100 flex flex-col md:flex-row h-full">
                            <div className="md:w-1/2 relative bg-gray-100">
                                <LpImage
                                    src={item.image}
                                    alt={`${item.name}様のアンケート原本`}
                                    className="w-full h-full object-contain p-4 md:p-2"
                                    sizes="(min-width: 768px) 360px, 100vw"
                                />
                                <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    アンケート原本
                                </div>
                            </div>
                            <div className="md:w-1/2 p-6 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">
                                        {item.service}
                                    </span>
                                    <span className="text-gray-500 text-xs">{item.name}</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-4">
                                    「{item.title}」
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                                    {item.comment}
                                </p>
                                <div className="flex text-amber-400 text-lg">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
