'use client';

import React from 'react';

interface AdBannerProps {
  position: 'footer' | 'panel' | 'sidebar';
}

// 名前付きエクスポートを維持
export function AdBanner({ position = 'panel' }: AdBannerProps) {
  // 実運用時はここにAdSense等のタグを埋めます。運用IDは環境変数で管理してください。
  if (position === 'sidebar') {
    return (
      <aside className="hidden xl:flex flex-col items-center justify-start w-[160px] flex-shrink-0">
        <div className="w-[140px] h-[600px] bg-white border border-amber-900/5 rounded-xl shadow-sm flex items-center justify-center px-2 py-4">
          <div className="text-xs text-gray-500 writing-vertical-rl rotate-0 flex flex-col items-center gap-3">
            <div className="font-bold text-amber-700 text-sm">広告スペース</div>
            <div className="text-[11px] text-gray-400 text-center">
              （縦長バナー）
            </div>
            <div className="text-[11px] text-gray-400 text-center mt-2">
              AdSense / AdManager タグをここに埋めてください
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const baseClass = position === 'footer'
    ? 'w-full max-w-[1000px] h-[90px] rounded-t-xl shadow-md bg-white border border-amber-900/5 flex items-center justify-center'
    : 'w-full h-[100px] rounded-xl shadow-sm bg-white border border-amber-900/5 flex items-center justify-center';

  return (
    <div className={`mx-2 ${baseClass}`}>
      <div className="text-xs text-gray-500 text-center px-3">
        {/* 実運用時は下記のテキスト部分を広告タグ（ins.adsbygoogle 等）で差し替えてください */}
        <div className="font-bold text-amber-700">広告スペース</div>
        <div className="mt-1">ここにAdSenseやAdManagerのタグを埋めて表示します。</div>
      </div>
    </div>
  );
}