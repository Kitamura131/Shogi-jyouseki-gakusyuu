// src/components/Home/Dashboard.tsx
'use client';

import React from 'react';
import { JosekiProblem } from '../../types';

type DashboardProps = {
  problems: JosekiProblem[];
  onStartReview: () => void;
  onSelect: (problem: JosekiProblem) => void; 
  onTimeTravel?: () => void;
  cardPadding: number;
  titleSize: number;
  isAdmin?: boolean; 
  onRemoveFromReviewQueue?: (problemId: string) => void; 
  onToggleReviewVisibility?: (problemId: string, hide: boolean) => void; // 【新設】一時的に非表示にする
};

export function Dashboard({ 
  problems, 
  onStartReview, 
  onSelect, 
  onTimeTravel,
  cardPadding,
  titleSize,
  isAdmin = false, 
  onRemoveFromReviewQueue,
  onToggleReviewVisibility
}: DashboardProps) {
  const now = new Date();

  // 今日の復習対象をフィルタ（※非表示フラグ hiddenFromReview が true のものは完全に除外）
  const reviewQueue = problems.filter((problem) => {
    if (!problem.srs.nextReviewDate) return false;
    if (problem.srs.hiddenFromReview) return false; 
    return new Date(problem.srs.nextReviewDate) <= now;
  });

  const reviewCount = reviewQueue.length;

  return (
    <div 
      className="w-full bg-[#FAF7F0] border border-amber-900/10 rounded-3xl shadow-sm flex flex-col gap-8 transition-all"
      style={{ padding: `${cardPadding}px` }}
    >
      {/* 上部：状況サマリー */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left space-y-1">
          <span className="inline-block text-xs font-bold text-amber-900/40 uppercase tracking-widest mb-1">
            DAILY STUDY DASHBOARD
          </span>
          <h2 
            className="font-serif font-black text-gray-900 leading-none"
            style={{ fontSize: `${titleSize * 1.2}px` }}
          >
            今日の復習: <span className="text-amber-700">{reviewCount}</span> つの定跡
          </h2>
          <p 
            className="text-gray-500 font-semibold mt-1"
            style={{ fontSize: `${titleSize * 0.55}px` }}
          >
            {reviewCount > 0 
              ? "記憶が薄れる前に、学んだ手順を復習して定着させましょう。" 
              : "今日復習すべき手順はすべて完了しています！素晴らしい成果です。"}
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col items-center gap-3 flex-shrink-0">
          <button
            onClick={onStartReview}
            disabled={reviewCount === 0}
            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-200 text-white font-extrabold rounded-2xl shadow-md hover:shadow-lg disabled:shadow-none transition-all text-base tracking-wider uppercase"
          >
            今すぐまとめて復習 →
          </button>

          {onTimeTravel && isAdmin && (
            <button
              onClick={onTimeTravel}
              className="text-[10px] font-bold text-gray-400 hover:text-amber-700 bg-gray-100 hover:bg-amber-50 px-4 py-2 rounded-xl border border-gray-200 hover:border-amber-200 transition-all select-none"
            >
              ⏱️ 開発用：時間を1日進める (デバッグ)
            </button>
          )}
        </div>
      </div>

      {/* 復習リスト */}
      {reviewCount > 0 && (
        <div className="border-t border-amber-900/5 pt-6">
          <h3 className="text-xs font-bold text-amber-900/50 uppercase tracking-wider mb-4">
            🎯 個別に選んで復習するリスト
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewQueue.map((problem) => (
              <div
                key={problem.id}
                className="bg-white border border-amber-900/5 hover:border-amber-500/20 rounded-2xl p-4 transition-all flex items-center justify-between gap-4 shadow-sm group"
              >
                {/* 【改修要件】見えなかったミニ盤面を完全廃止し、スッキリ見やすい極上カードに復元 */}
                <div 
                  onClick={() => onSelect(problem)}
                  className="min-w-0 space-y-1.5 flex-grow cursor-pointer"
                >
                  <h4 
                    className="font-black text-gray-800 group-hover:text-amber-800 transition-colors line-clamp-1 text-base sm:text-lg"
                    style={{ fontSize: `${titleSize * 0.6}px` }}
                  >
                    {problem.title}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                      Lv.{problem.srs.stage}
                    </span>
                    {problem.startStep > 0 && (
                      <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {problem.startStep}手目開始
                      </span>
                    )}
                  </div>
                </div>
                
                {/* 操作エリア（非表示 ＆ 削除リセット ＆ 開始） */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* 【新設要件】一時的に「今日の復習から非表示」にする目隠しボタン */}
                  {onToggleReviewVisibility && (
                    <button
                      onClick={() => onToggleReviewVisibility(problem.id, true)}
                      className="p-2 rounded-xl text-gray-400 hover:text-amber-800 hover:bg-amber-50 transition-colors leading-none"
                      title="今日だけ復習リストから非表示にする"
                    >
                      👁️‍🗨️
                    </button>
                  )}

                  {/* 【新設要件】警告確認つきの学習記録完全削除（リセット）ボタン */}
                  {onRemoveFromReviewQueue && (
                    <button
                      onClick={() => onRemoveFromReviewQueue(problem.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors leading-none"
                      title="学習データを完全にリセット（削除）"
                    >
                      🗑️
                    </button>
                  )}
                  
                  <button 
                    onClick={() => onSelect(problem)}
                    className="text-base text-amber-600 hover:text-amber-800 font-bold px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all"
                  >
                    開始 ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}