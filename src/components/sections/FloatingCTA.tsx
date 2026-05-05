import React from 'react';

export default function FloatingCTA() {
    return (
        <>
            {/* モバイル: LINE + 電話 2ボタン */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_6px_rgba(0,0,0,0.1)] p-3 md:hidden">
                <div className="flex gap-3 max-w-4xl mx-auto">
                    <a href="https://lin.ee/Xs8Orp2" target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                        <div className="text-center leading-tight">
                            <span className="block text-xs font-bold opacity-90">必ずお返事！</span>
                            <span className="block text-lg font-black">LINEで見積もり</span>
                        </div>
                    </a>
                    <a href="tel:07084280866" className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform animate-shine ring-2 ring-white/50 ring-offset-2 ring-offset-red-600">
                        <div className="text-center leading-tight">
                            <span className="block text-xs font-bold opacity-90">最速確認</span>
                            <span className="block text-lg font-black">電話相談</span>
                        </div>
                    </a>
                </div>
            </div>

            {/* PC: 画面底部に大きな電話番号を常時表示 */}
            <div className="hidden md:block fixed bottom-0 left-0 right-0 z-50">
                <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white shadow-[0_-4px_12px_rgba(0,0,0,0.2)]">
                    <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-3">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold opacity-90">お電話でのお問い合わせ ─ ３６５日受付</p>
                                <a href="tel:07084280866" className="text-4xl font-black tracking-wider hover:opacity-90 transition-opacity">
                                    070-8428-0866
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="https://lin.ee/Xs8Orp2" target="_blank" rel="noopener noreferrer" className="bg-[#06C755] hover:bg-[#05a346] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2 text-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                                LINEで見積もり
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
