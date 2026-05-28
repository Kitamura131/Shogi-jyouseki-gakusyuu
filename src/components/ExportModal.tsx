// src/components/ExportModal.tsx
'use client';

import React from 'react';

interface ExportModalProps {
  isOpen: boolean;
  exportText: string;
  onClose: () => void;
  onCopy: () => void;
}

// export default から名前付きの export に変更しました
export function ExportModal({ isOpen, exportText, onClose, onCopy }: ExportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4 font-sans">
      <div className="bg-[#FAF7F0] border-2 border-amber-900/10 rounded-3xl max-w-3xl w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh]">
        <div className="border-b border-amber-900/5 pb-3">
          <h3 className="text-xl font-serif font-black text-gray-900 flex items-center gap-1.5">
            💾 データベース・エクスポート
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            クレンジング抽出された初期マスター配列データです。
          </p>
        </div>

        <div className="flex-grow overflow-y-auto">
          <textarea
            readOnly
            value={exportText}
            className="w-full h-[400px] p-4 border border-zinc-200 rounded-2xl font-mono text-xs bg-zinc-950 text-emerald-400 focus:outline-none resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2 border-t border-amber-900/5 flex-shrink-0">
          <button
            onClick={onCopy}
            className="flex-grow bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs tracking-wider transition-all"
          >
            📋 コピー
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl text-xs transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}