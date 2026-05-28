// src/components/Header.tsx
'use client';

import React from 'react';

interface HeaderProps {
  mode: 'home' | 'learn' | 'record';
  onExport: () => void;
  onStartRecording: () => void;
  isAdmin?: boolean;
}

// 名前付きエクスポートを維持
export function Header({ mode, onExport, onStartRecording, isAdmin = false }: HeaderProps) {
  return (
    <header className="bg-white border-b border-amber-900/5 py-4 px-6 shadow-sm flex justify-between items-center flex-shrink-0 font-sans z-20">
      <h1 className="text-xl font-bold text-[#111827] tracking-wide">将棋定跡学習</h1>
      <div className="flex items-center gap-3">
        {isAdmin && (
          <button
            onClick={onExport}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1"
          >
            💾 【管理者用】全定跡データをコード出力
          </button>
        )}
        {mode === 'home' && isAdmin && (
          <button
            onClick={onStartRecording}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-colors"
          >
            ＋ 自分で定跡を登録する
          </button>
        )}
      </div>
    </header>
  );
}