import React from 'react';
import { useRegion } from '@/lib/RegionContext';
import { trackFormSubmit } from '@/lib/analytics';
import { Mail } from 'lucide-react';

export default function ContactForm({ regionName: propRegionName }: { regionName?: string }) {
    const context = useRegion();
    const regionName = propRegionName || context.regionName;

    return (
        <section id="contact" className="py-10 bg-white border-t border-gray-200">
            <div className="container mx-auto px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 text-primary">
                            <Mail size={32} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            無料相談・お見積もり
                        </h2>
                        <p className="text-gray-600">
                            {regionName}周辺での車内トラブル、お気軽にご相談ください。<br />
                            お急ぎの場合はお電話、またはLINEがスムーズです。
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-3xl p-8 md:p-12 shadow-inner border border-gray-100">
                        <form
                            className="space-y-6"
                            action="https://formspree.io/f/xknlodez"
                            method="POST"
                            onSubmit={() => trackFormSubmit()}
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">お名前</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="例：山田 太郎"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="tel" className="block text-sm font-bold text-gray-700 mb-2">電話番号</label>
                                    <input
                                        type="tel"
                                        id="tel"
                                        name="tel"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="例：090-1234-5678"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="region" className="block text-sm font-bold text-gray-700 mb-2">ご住所・市区町村</label>
                                <input
                                    type="text"
                                    id="region"
                                    name="region"
                                    defaultValue={regionName}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="例：大阪府大阪市..."
                                />
                            </div>

                            <div>
                                <label htmlFor="car_model" className="block text-sm font-bold text-gray-700 mb-2">車種</label>
                                <input
                                    type="text"
                                    id="car_model"
                                    name="car_model"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="例：トヨタ アルファード"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">お問い合わせ内容</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="トラブルの内容（嘔吐、灯油漏れ、ペットの粗相など）を詳しくお知らせください。"
                                ></textarea>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-12 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
                                >
                                    この内容で送信する
                                </button>
                                <p className="text-xs text-gray-400 mt-4">
                                    ※送信いただいた内容は、お見積もり・サービス提供の目的以外には使用いたしません。
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
