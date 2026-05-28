// src/components/LeftPanel.tsx
'use client';

import React from 'react';
import { JosekiProblem, Move } from '../types/shogi';

interface LeftPanelProps {
  mode: 'home' | 'learn' | 'record';
  editingProblemId: string | null;
  selectedJoseki: JosekiProblem | null;
  currentJoseki: JosekiProblem | null;
  game: {
    recordedMoves: Move[];
    currentStep: number;
    isThinking: boolean;
  };
  totalMoves: number;
  moves: Move[];
  isYourTurn: boolean;
  handleCancel: () => void;
  handleTriggerMoveEditor: (idx: number) => void;
}

// export default から名前付きの export に変更しました
export function LeftPanel({
  mode,
  editingProblemId,
  selectedJoseki,
  currentJoseki,
  game,
  totalMoves,
  moves,
  isYourTurn,
  handleCancel,
  handleTriggerMoveEditor,
}: LeftPanelProps) {
  const learnKifuHeight = 150;
  const isSenteTurnInRecord = game.recordedMoves.length % 2 === 0;

  const renderLevelBadge = () => {
    const stage = currentJoseki?.srs?.stage ?? 0;
    const badgeConfigs: Record<number, { text: string; nextText: string; className: string }> = {
      0: { text: '未着手 (Level 0)', nextText: '新規学習', className: 'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-800 dark:text-stone-100' },
      1: { text: '初習 (Level 1)', nextText: '復習：1日後', className: 'bg-emerald-50 text-emerald-955 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-100' },
      2: { text: '中修 (Level 2)', nextText: '復習：3日後', className: 'bg-teal-50 text-teal-955 border-teal-300 dark:bg-teal-950/40 dark:text-teal-100' },
      3: { text: '精修 (Level 3)', nextText: '復習：7日後', className: 'bg-indigo-50 text-indigo-955 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-100' },
      4: { text: '極言 (Level 4)', nextText: '復習：14日後', className: 'bg-sky-50 text-sky-955 border-sky-300 dark:bg-sky-950/40 dark:text-sky-100' },
      5: { text: '達人 (Level 5)', nextText: '復習：30日後', className: 'bg-amber-50 text-amber-955 border-amber-300 dark:bg-amber-950/40 dark:text-amber-100 font-bold' },
      6: { text: '達人 (Level 6)', nextText: '復習：60日後', className: 'bg-amber-100 text-amber-955 border-amber-300 dark:bg-amber-950/50 dark:text-amber-100 font-extrabold shadow-sm' },
      7: { text: '極マスター (Level 7)', nextText: '復習：120日後', className: 'bg-amber-200 text-amber-955 border-amber-400 dark:bg-amber-900/60 dark:text-white font-extrabold shadow' },
    };

    const config = badgeConfigs[stage] || badgeConfigs[0];

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold border ${config.className} select-none shadow-sm w-full justify-center`}>
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-current opacity-75"></span>
        <span>{config.text}</span>
        <span className="opacity-30">|</span>
        <span>{config.nextText}</span>
      </div>
    );
  };

  return (
    <div className="w-full xl:w-[260px] bg-[#FAF7F0] border border-amber-900/10 p-5 rounded-2xl shadow-sm flex flex-col justify-between flex-shrink-0 min-h-[560px] h-auto overflow-y-visible">
      <div className="flex flex-col gap-4">
        {mode === 'learn' && (
          <div className="w-full">
            {renderLevelBadge()}
          </div>
        )}

        <div className="border-b border-amber-900/5 pb-4 flex flex-col justify-center font-sans">
          <h2 className="text-2xl xl:text-3xl font-serif font-black text-slate-950 mb-2 leading-tight tracking-wide">
            {mode === 'record' ? (editingProblemId ? "定跡を編集録音中" : "新規定跡を録音中") : selectedJoseki?.title}
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed font-semibold">
            {mode === 'record' ? "盤面を操作して、正しい手順を1手ずつ記録してください。" : selectedJoseki?.description}
          </p>
        </div>
        
        <div className="py-4 border-t border-amber-900/5">
          <div className="text-xl xl:text-2xl font-serif font-black text-amber-955 leading-none tracking-tight mb-2">
            {mode === 'record' 
              ? (isSenteTurnInRecord ? "先手の手番" : "後手の手番")
              : (game.currentStep >= totalMoves ? "対局終了" : (isYourTurn ? "あなたの手番" : "相手の考え中..."))}
          </div>
          <div className="text-[11px] text-gray-500 font-bold">
            {mode === 'record' ? `${game.recordedMoves.length}手記録済` : `${game.currentStep} / ${totalMoves} 手目`}
          </div>
        </div>

        <div>
          <div className="text-[9px] font-bold text-amber-900/40 mb-2">対局棋譜</div>
          <div className="bg-white/55 border border-amber-900/5 p-4 rounded-xl overflow-y-auto text-sm font-mono leading-relaxed text-gray-700 shadow-inner" style={{ height: `${learnKifuHeight}px` }}>
            {mode === 'record' ? (
              game.recordedMoves.length === 0 ? (
                <span className="text-gray-400 text-xs italic">着手すると記録されます</span>
              ) : (
                <div className="w-full flex flex-col gap-1 text-xs">
                  {game.recordedMoves.map((move, index) => (
                    <div key={index} className="flex items-center justify-between py-1 border-b border-amber-955/5 last:border-none group">
                      <span className="font-semibold text-[#111827]">
                        {index + 1}. {move.notation}
                      </span>
                      <button
                        onClick={() => handleTriggerMoveEditor(index)}
                        className="text-xs hover:bg-amber-100 p-1 rounded-md transition-colors leading-none"
                        title="この手順の解説とヒントを直接編集"
                      >
                        ✏️
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              game.currentStep === 0 ? (
                <span className="text-gray-400 text-xs italic">まだ着手はありません</span>
              ) : (
                <div className="flex flex-wrap gap-x-2.5 gap-y-1">
                  {moves.slice(0, game.currentStep).map((move, index) => (
                    <span key={index} className="font-semibold text-[#111827]">{index + 1}.{move.notation}</span>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleCancel}
        disabled={game.isThinking}
        className="w-full text-center text-xs font-bold text-gray-400 hover:text-gray-600 pt-3 transition-colors border-t border-amber-900/5 mt-4"
      >
        ← 定跡選択一覧に戻る
      </button>
    </div>
  );
}