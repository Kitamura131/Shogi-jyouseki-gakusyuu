// src/components/Record/RecordPanel.tsx
'use client';

import React, { useState } from 'react';
import { Move } from '../../types/shogi';

interface RecordPanelProps {
  game: {
    recordedMoves: Move[];
    setRecordedMoves: (moves: Move[]) => void;
    startStep: number;
    setStartStep: (step: number) => void;
    handleUndo: () => void;
  };
  recorderPlayerColor: 'sente' | 'gote';
  newTitle: string;
  setNewTitle: (val: string) => void;
  newDescription: string;
  setNewDescription: (val: string) => void;
  newFinalComment: string;            // 【新設】総括コメント
  setNewFinalComment: (val: string) => void; // 【新設】総括コメント変更ハンドラ
  editingProblemId: string | null;
  handleSaveJoseki: () => void;
  handleCancel: () => void;
}

// 名前付きエクスポート構造を維持
export function RecordPanel({
  game,
  recorderPlayerColor,
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newFinalComment,
  setNewFinalComment,
  editingProblemId,
  handleSaveJoseki,
  handleCancel,
}: RecordPanelProps) {
  const [editingMoveIndex, setEditingMoveIndex] = useState<number | null>(null);
  const [tempComment, setTempComment] = useState<string>('');
  const [tempHint, setTempHint] = useState<string>('');

  const learnKifuHeight = 150;
  const lastRecordedIndex = game.recordedMoves.length - 1;
  const lastMove = lastRecordedIndex >= 0 ? game.recordedMoves[lastRecordedIndex] : null;

  const handleUpdateLastMoveComment = (comment: string) => {
    if (lastRecordedIndex < 0) return;
    const updated = [...game.recordedMoves];
    updated[lastRecordedIndex] = {
      ...updated[lastRecordedIndex],
      comment: comment
    };
    game.setRecordedMoves(updated);
  };

  const handleUpdateLastMoveHint = (hint: string) => {
    if (lastRecordedIndex < 0) return;
    const updated = [...game.recordedMoves];
    updated[lastRecordedIndex] = {
      ...updated[lastRecordedIndex],
      hint: hint
    };
    game.setRecordedMoves(updated);
  };

  const isLastMovePlayerTurn = lastMove 
    ? (lastRecordedIndex % 2 === 0 && recorderPlayerColor === 'sente') || 
      (lastRecordedIndex % 2 !== 0 && recorderPlayerColor === 'gote')
    : false;

  const handleOpenMoveEditor = (index: number) => {
    const targetMove = game.recordedMoves[index];
    if (targetMove) {
      setEditingMoveIndex(index);
      setTempComment(targetMove.comment || '');
      setTempHint(targetMove.hint || '');
    }
  };

  const handleSaveMoveEdits = () => {
    if (editingMoveIndex === null) return;
    const updatedMoves = [...game.recordedMoves];
    updatedMoves[editingMoveIndex] = {
      ...updatedMoves[editingMoveIndex],
      comment: tempComment,
      hint: tempHint
    };
    game.setRecordedMoves(updatedMoves);
    setEditingMoveIndex(null);
    setTempComment('');
    setTempHint('');
  };

  return (
    // 【仕様調整】録音画面も学習画面と完全に足並みを揃え、
    // パネル全体の縦幅固定を排除（h-auto）しつつ、横幅のみ「w-[840px]」に完全固定しました。
    <div className="w-full h-auto min-h-[560px] flex-grow shrink bg-[#FAF7F0] border border-amber-900/10 p-5 rounded-2xl shadow-sm flex flex-col justify-between self-stretch font-sans">
      <div>
        <div className="border-b border-amber-900/5 pb-4 mb-4 font-sans">
          <span className="inline-block text-[11px] font-bold text-red-600 uppercase tracking-widest mb-1 animate-pulse font-sans">● 定跡レコーダー稼働中</span>
          <div className="text-3xl font-serif font-black text-[#111827]">
            {game.recordedMoves.length % 2 === 0 ? "先手の手番" : "後手の手番"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-900/5 shadow-sm mb-4 space-y-4">
          <div className="flex justify-between items-center border-b border-amber-900/5 pb-2">
            <span className="text-[10px] font-bold text-amber-900/50 uppercase">着手コントロール</span>
            <button
              onClick={() => {
                game.setStartStep(game.recordedMoves.length);
                alert(`${game.recordedMoves.length}手目をクイズの開始位置に設定しました。`);
              }}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 underline animate-none"
            >
              現在の手を開始位置にする (現在: {game.startStep}手目)
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-amber-955 uppercase mb-2 tracking-wider">
              {lastMove 
                ? `今動かした手：${lastRecordedIndex + 1}手目 [${lastMove.notation}] の解説コメント` 
                : "解説コメント (駒を動かすと入力できます)"}
            </label>
            <textarea
              placeholder="盤上の駒を動かした後に、その手の狙いや解説をここに入力します。"
              value={lastMove ? (lastMove.comment || '') : ''}
              onChange={(e) => handleUpdateLastMoveComment(e.target.value)}
              disabled={!lastMove}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:outline-none focus:border-amber-600 resize-none font-semibold bg-white disabled:bg-gray-100 disabled:text-gray-400 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-amber-955 uppercase mb-2 tracking-wider">
              {lastMove 
                ? `今動かした手：${lastRecordedIndex + 1}手目 [${lastMove.notation}] への「ヒント」` 
                : "この手への「ヒント」 (駒を動かすと入力できます)"}
            </label>
            <textarea
              placeholder={
                !lastMove 
                  ? "駒を動かすと入力できます" 
                  : isLastMovePlayerTurn 
                    ? "例：飛車を成る手を考えましょう、等" 
                    : "相手(AI)の手番のため、この手のヒントは不要です"
              }
              value={lastMove ? (lastMove.hint || '') : ''}
              onChange={(e) => handleUpdateLastMoveHint(e.target.value)}
              disabled={!lastMove || !isLastMovePlayerTurn}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:outline-none focus:border-amber-600 resize-none font-semibold bg-white disabled:bg-gray-100 disabled:text-gray-400 shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-3 bg-white p-4 rounded-xl border border-amber-900/5 shadow-sm">
          <div>
            <label className="block text-[10px] font-bold text-amber-900/50 uppercase mb-1">定跡タイトル</label>
            <input
              type="text"
              placeholder="例：四間飛車 対急戦基本"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-600 font-medium"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-amber-900/50 uppercase mb-1">説明文 (省略可)</label>
            <textarea
              placeholder="この手順 of 狙いやポイントを入力します。"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-600 resize-none font-medium"
            />
          </div>
          
          {/* 定跡レコーダー画面：完了時総括コメントの入力エリア */}
          <div>
            <label className="block text-[10px] font-bold text-amber-900/50 uppercase mb-1">定跡クリア時の総括コメント (省略可)</label>
            <textarea
              placeholder="定跡を最後までクリアした時にお祝いとして表示されるまとめメッセージを入力します。"
              value={newFinalComment}
              onChange={(e) => setNewFinalComment(e.target.value)}
              rows={2.5}
              className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-600 resize-none font-medium"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-4 font-sans">
        <button
          onClick={handleSaveJoseki}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md text-sm tracking-wider transition-all"
        >
          {editingProblemId ? "定跡を上書き保存する" : "この手順で定跡を新規保存する"}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={game.handleUndo}
            disabled={game.recordedMoves.length === 0}
            className="bg-[#111827] hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 px-2 rounded-xl shadow-sm text-xs transition-colors"
          >
            1手消す
          </button>
          <button onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-2 rounded-xl shadow-sm text-xs transition-colors">
            中止する
          </button>
        </div>
      </div>

      {/* 1手ごとのコメント・ヒントピンポイント編集ダイアログ */}
      {editingMoveIndex !== null && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4 font-sans">
          <div className="bg-[#FAF7F0] border border-amber-900/10 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="border-b border-amber-900/5 pb-3">
              <h3 className="text-lg font-serif font-black text-gray-900">
                ✏️ {editingMoveIndex + 1}手目 [{game.recordedMoves[editingMoveIndex]?.notation}] の直接編集
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                この一手の手順や進行は一切削除せずに、解説コメントとヒントだけをピンポイントで修正します。
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-amber-955 uppercase mb-1 tracking-wider">解説・コメント</label>
                <textarea
                  value={tempComment}
                  onChange={(e) => setTempComment(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs sm:text-base focus:outline-none focus:border-amber-600 resize-none font-semibold bg-white shadow-inner"
                  placeholder="この手に対する解説・コメントを入力します。"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-955 uppercase mb-1 tracking-wider">次の一手のヒント</label>
                <textarea
                  value={tempHint}
                  onChange={(e) => setTempHint(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs sm:text-base focus:outline-none focus:border-amber-600 resize-none font-semibold bg-white shadow-inner"
                  placeholder="この手順に進むためのヒントを設定します。"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-amber-900/5">
              <button
                onClick={handleSaveMoveEdits}
                className="flex-grow bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs tracking-wider transition-all"
              >
                編集内容を適用する
              </button>
              <button
                onClick={() => setEditingMoveIndex(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl text-xs transition-all"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="hidden">
        {game.recordedMoves.map((_, idx) => (
          <button key={idx} onClick={() => handleOpenMoveEditor(idx)} id={`btn-edit-move-${idx}`} />
        ))}
      </div>
    </div>
  );
}