// src/components/Learn/LearnPanel.tsx

'use client';

import React, { useEffect, useRef } from 'react';
import { JosekiProblem, Move } from '../../types/shogi';

function getDynamicFontSize(text: string, isBothDisplayed: boolean, baseSize: number): number {
  const len = text.length;
  
  if (isBothDisplayed) {
    if (len <= 30) return baseSize;
    if (len <= 60) return Math.max(18, baseSize - 2);
    return Math.max(18, baseSize - 4);
  }

  if (len <= 30) return baseSize + 4;
  if (len <= 65) return baseSize;
  return Math.max(18, baseSize - 3);
}

interface LearnPanelProps {
  game: {
    currentStep: number;
    userComment: string;
    opponentComment: string;
    userNotation: string;
    opponentNotation: string;
    isThinking: boolean;
    handleUndo: () => void;
  };
  clearStep: 'not_cleared' | 'anki_select' | 'action_select';
  selectedJoseki: JosekiProblem | null;
  currentJoseki: JosekiProblem | null;
  totalMoves: number;
  hasNextProblem: boolean;
  handleAnkiSelect: (selection: 'again' | 'good') => void;
  handleNextJoseki: () => void;
  handleReplayJoseki: () => void;
  handleCancel: () => void;
  isHintRevealed: boolean;
  setIsHintRevealed: (revealed: boolean) => void;
  moves: Move[];
  getNextGoodIntervalText: () => string;
  onOpenSubBoard: () => void; // 【新設要件】検討用継盤を開くための関数
}

export function LearnPanel({
  game,
  clearStep,
  selectedJoseki,
  currentJoseki,
  totalMoves,
  hasNextProblem,
  handleAnkiSelect,
  handleNextJoseki,
  handleReplayJoseki,
  handleCancel,
  isHintRevealed,
  setIsHintRevealed,
  moves,
  getNextGoodIntervalText,
  onOpenSubBoard,
}: LearnPanelProps) {
  const commentScrollRef = useRef<HTMLDivElement>(null);

  const learnCommentHeaderSize = 16;
  const learnCommentSize = 30;
  const learnHintSize = 24;
  
  // 高さの固定を排除するため、最小の目安高さだけを設定（画面いっぱいに縦横自動伸縮します）
  const learnCommentHeight = 280; 
  const learnHintHeight = 130;

  useEffect(() => {
    if (commentScrollRef.current) {
      commentScrollRef.current.scrollTop = 0;
    }
  }, [game.currentStep, selectedJoseki]);

  return (
    // 【仕様調整】
    // 1. 高さの固定制限を排除し、通常学習中・クリア時のパーツ量に応じて自然に伸び縮みする「min-h-[500px] h-auto」に復帰
    // 2. パネル全体の横幅サイズを、本来の基準幅（420px）のちょうど2倍にあたる「w-full max-w-[840px]」に完全自動拡張（自動伸縮）
    // 3. パネル内の「解説小窓」や「Anki小窓」のうっとうしい二重スクロールバーはすべて【完全撤廃】
    <div className="w-full h-auto min-h-[500px] flex-grow shrink bg-[#FAF7F0] border border-amber-900/10 p-5 rounded-2xl shadow-sm flex flex-col justify-between self-stretch font-sans">
      <div className="flex flex-col h-full justify-between gap-4">
        
        {/* 最後の手の解説コメント：max-hや個別スクロールバーを完全撤廃し、文字数に応じて自然に伸びる設計 */}
        {(game.userComment || game.opponentComment) && (
          <div 
            className="bg-[#FCF9F2] border-2 border-amber-500/20 rounded-2xl p-5 shadow-inner space-y-4 relative flex-shrink-0"
            style={{ minHeight: `${learnCommentHeight}px` }} 
          >
            <div className="absolute top-2 right-3 text-[8px] font-bold text-amber-600/40 tracking-wider">最後の一手の解説巻物</div>

            {game.userComment && (
              <div className="space-y-1 font-sans">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 select-none" style={{ fontSize: `${learnCommentHeaderSize}px` }}>
                  <span>▲</span> <span>あなたの着手 {game.userNotation && `[ ${game.userNotation} ]`}</span>
                </div>
                <p 
                  className="font-serif font-extrabold text-slate-950 leading-relaxed pl-3 border-l-2 border-amber-500/40 py-1"
                  style={{ fontSize: `${getDynamicFontSize(game.userComment, !!game.opponentComment, learnCommentSize)}px` }}
                >
                  {game.userComment}
                </p>
              </div>
            )}

            {game.userComment && game.opponentComment && <div className="border-t border-amber-500/10 my-1" />}

            {game.opponentComment && (
              <div className="space-y-1 font-sans">
                <div className="flex items-center gap-1.5 font-bold text-gray-500 select-none" style={{ fontSize: `${learnCommentHeaderSize}px` }}>
                  <span>△</span> <span>相手の応手 {game.opponentNotation && `[ ${game.opponentNotation} ]`}</span>
                </div>
                <p 
                  className={`font-serif font-extrabold leading-relaxed pl-3 border-l-2 border-gray-300 py-1 ${
                    game.opponentComment === '相手が考え中...' ? 'text-gray-400 italic' : 'text-slate-950'
                  }`}
                  style={{ fontSize: `${getDynamicFontSize(game.opponentComment, true, learnCommentSize)}px` }}
                >
                  {game.opponentComment}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 解決案1：クリア直後のインライン Anki評価＆定跡総括エリア */}
        {clearStep === 'anki_select' && (
          <div className="p-5 bg-amber-50/60 border-2 border-amber-500/30 rounded-2xl shadow-inner space-y-4 flex-grow overflow-y-auto animate-fade-in flex-shrink-0">
            <div className="text-center pb-2 border-b border-amber-900/5">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">定跡クリアの総括</span>
              <h4 className="font-serif font-black text-xl text-amber-955 mt-1 flex items-center justify-center gap-1.5">
                🌸 習得お見事です！ 🌸
              </h4>
            </div>

            {/* 定跡全体に対する「総括・最終まとめコメント」を表示 */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-amber-900/50 uppercase">総括メッセージ</span>
              <p className="font-serif font-extrabold text-slate-950 text-lg leading-relaxed bg-white/55 p-4 rounded-xl border border-amber-900/5 shadow-inner">
                {currentJoseki?.finalComment || currentJoseki?.description || "この定跡の総括コメントは未登録です。次の定跡もがんばりましょう！"}
              </p>
            </div>

            {/* 押しやすい巨大な2つの記憶度評価ボタン */}
            <div className="space-y-3 pt-4 border-t border-amber-900/5">
              <span className="text-sm sm:text-base font-extrabold text-amber-955 uppercase block text-center">
                定跡を覚えた自信は？
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAnkiSelect('again')}
                  className="py-4 px-4 font-extrabold text-base rounded-xl border-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-800 transition-all text-center flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 duration-75"
                >
                  <span className="text-lg">自信無し</span>
                  <span className="text-xs font-semibold opacity-80">(1日後に復習)</span>
                </button>
                <button
                  onClick={() => handleAnkiSelect('good')}
                  className="py-4 px-4 font-extrabold text-base rounded-xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all text-center flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 duration-75"
                >
                  <span className="text-lg">自信あり</span>
                  <span className="text-xs font-semibold opacity-80">({getNextGoodIntervalText()}に復習)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 常設目隠し式ヒント枠 */}
        {clearStep === 'not_cleared' && (
          <div 
            className="w-full border-2 border-amber-500/30 bg-[#FCF9F2] rounded-xl relative overflow-hidden shadow-sm flex items-center justify-center p-3 font-sans animate-none flex-shrink-0"
            style={{ height: `${learnHintHeight}px` }} 
          >
            <span className="absolute top-1 left-2.5 text-[8px] font-bold text-amber-600/40 tracking-widest uppercase select-none">次の一手のヒント</span>
            {isHintRevealed ? (
              <div className="w-full text-center overflow-y-auto max-h-[85px] px-1 pt-2 animate-none">
                <p 
                  className="font-serif font-extrabold text-slate-950 leading-relaxed"
                  style={{ fontSize: `${getDynamicFontSize(moves[game.currentStep]?.hint || "ヒントは未登録です。", false, learnHintSize)}px` }}
                >
                  {moves[game.currentStep]?.hint || "この手にはヒントが登録されていません。自分の直感で指してみましょう！"}
                </p>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200/50 via-amber-100/45 to-amber-200/50 flex items-center justify-center">
                <button
                  onClick={() => setIsHintRevealed(true)}
                  disabled={game.currentStep >= totalMoves || game.isThinking}
                  className="px-5 py-2 bg-[#111827] hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-400 text-white font-extrabold rounded-lg shadow-md text-xs tracking-wider transition-all select-none hover:scale-105 active:scale-95 duration-100"
                >
                  🔑 ヒントを見る
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 右カラム最下部：1手戻す ＆ 常に表示される3大アクション常設ボタン */}
      <div className="space-y-3 mt-4 pt-4 border-t border-amber-900/5 bg-[#FAF7F0] font-sans flex-shrink-0">
        
        {/* 学習中のみ「1手戻す」ボタンを表示 */}
        {clearStep === 'not_cleared' && (
          <button
            onClick={game.handleUndo}
            disabled={game.currentStep === (selectedJoseki?.startStep ?? 0) || game.isThinking}
            className="w-full bg-[#111827] hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md text-sm tracking-wider transition-all"
          >
            1手戻す
          </button>
        )}

        {/* 継盤ボタン - 常時表示（clearStepに関わらず） */}
        <button
          onClick={onOpenSubBoard}
          disabled={game.isThinking}
          className="w-full text-s font-bold text-white bg-amber-700 hover:bg-amber-800 disabled:bg-gray-200 disabled:text-gray-500 py-3 px-3.5 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
        >
          継盤 を開く
        </button>

        <div className="space-y-2">
          {/* 定跡クリア後、記憶度を評価するまでの間（clearStep === 'anki_select'）は、「次の定跡に進む」「ホームに戻る」を完全にロック（disabled） */}
          <button
            onClick={handleNextJoseki}
            disabled={!hasNextProblem || game.isThinking || clearStep === 'anki_select'}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-200 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            次の定跡に進む ➔
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleReplayJoseki}
              disabled={game.isThinking}
              className="py-2.5 px-3 border border-gray-300 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 text-[#111827] font-bold text-xs rounded-xl transition-colors"
            >
              最初からやり直し
            </button>
            <button
              onClick={handleCancel}
              disabled={game.isThinking || clearStep === 'anki_select'}
              className="py-2.5 px-3 border border-gray-300 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 text-[#111827] font-bold text-xs rounded-xl transition-colors"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}