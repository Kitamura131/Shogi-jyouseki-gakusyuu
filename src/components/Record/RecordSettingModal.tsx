// src/components/Record/RecordSettingModal.tsx

'use client';

import React from 'react';
import { JosekiGroup, SubGroup } from '../../types';

interface RecordSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  josekiGroups: JosekiGroup[];
  subGroups: SubGroup[];
  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;
  selectedSubGroupId: string;
  setSelectedSubGroupId: (id: string) => void;
  newTitle: string;
  setNewTitle: (title: string) => void;
  newDescription: string;
  setNewDescription: (desc: string) => void;
  newFinalComment: string;            // 【新設】総括コメント
  setNewFinalComment: (comment: string) => void; // 【新設】総括コメント変更ハンドラ
  recorderPlayerColor: 'sente' | 'gote';
  setRecorderPlayerColor: (color: 'sente' | 'gote') => void;
  editingProblemId: string | null;
  onConfirm: () => void;
}

export function RecordSettingModal({
  isOpen,
  onClose,
  josekiGroups,
  subGroups,
  selectedGroupId,
  setSelectedGroupId,
  selectedSubGroupId,
  setSelectedSubGroupId,
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newFinalComment,
  setNewFinalComment,
  recorderPlayerColor,
  setRecorderPlayerColor,
  editingProblemId,
  onConfirm,
}: RecordSettingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-[#FAF7F0] border border-amber-900/10 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
        <div className="border-b border-amber-900/5 pb-3 text-center">
          <h3 className="text-xl font-serif font-black text-gray-900">
            {editingProblemId ? "定跡データの編集設定" : "新規定跡の登録設定"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">定跡の基本情報を編集・設定してください。</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-amber-900/50 uppercase mb-1">戦法（親）と戦型（子）の指定</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedGroupId}
                onChange={(e) => {
                  const gid = e.target.value;
                  setSelectedGroupId(gid);
                  const sub = subGroups.filter(sg => sg.groupId === gid)[0];
                  setSelectedSubGroupId(sub ? sub.id : '');
                }}
                className="border border-gray-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-amber-600 bg-white"
              >
                {josekiGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <select
                value={selectedSubGroupId}
                onChange={(e) => setSelectedSubGroupId(e.target.value)}
                className="border border-gray-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-amber-600 bg-white"
              >
                {subGroups.filter(sg => sg.groupId === selectedGroupId).map(sg => (
                  <option key={sg.id} value={sg.id}>{sg.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-amber-900/50 uppercase mb-1">定跡タイトル</label>
            <input
              type="text"
              placeholder="例：対エルモ急戦基本"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-600 font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-amber-900/50 uppercase mb-1">定跡の簡単な解説 (省略可)</label>
            <textarea
              placeholder="定跡の狙いや概要を入力してください。"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-600 resize-none font-medium bg-white"
            />
          </div>

          {/* 【新設】定跡完了時の総括コメント入力欄（初期設定段階でも設定できるように配置） */}
          <div>
            <label className="block text-[10px] font-bold text-amber-900/50 uppercase mb-1">定跡クリア時の総括コメント (省略可)</label>
            <textarea
              placeholder="定跡を最後までクリアした時にお祝いとして表示されるまとめメッセージを入力します。"
              value={newFinalComment}
              onChange={(e) => setNewFinalComment(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-600 resize-none font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-amber-900/50 uppercase mb-1">あなたの主導権（手番）</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRecorderPlayerColor('sente')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                  recorderPlayerColor === 'sente' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                先手番として記録
              </button>
              <button
                onClick={() => setRecorderPlayerColor('gote')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                  recorderPlayerColor === 'gote' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                後手番として記録
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onConfirm} className="flex-grow bg-[#111827] hover:bg-gray-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs tracking-wider transition-all">
            作成を開始する
          </button>
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl text-xs transition-all">
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}