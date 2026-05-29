// src/components/Home/JosekiExplorer.tsx
'use client';

import React, { useState } from 'react';
import { JosekiProblem, JosekiGroup, SubGroup } from '../../types';

type JosekiExplorerProps = {
  problems: JosekiProblem[];
  tacticsGroups: JosekiGroup[];
  tacticsSubGroups: SubGroup[];
  onSelect: (problem: JosekiProblem) => void;
  onEdit: (problem: JosekiProblem) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  onSaveGroup: (id: string | null, name: string) => void;
  onDeleteGroup: (id: string) => void;
  onSaveSubGroup: (id: string | null, groupId: string, name: string) => void;
  onDeleteSubGroup: (id: string) => void;
  onMoveGroup?: (id: string, direction: 'up' | 'down') => void;    // 親並び替え関数
  onMoveSubGroup?: (id: string, direction: 'up' | 'down') => void; // 子並び替え関数
  onMoveProblem?: (id: string, direction: 'up' | 'down') => void;  // 孫並び替え関数
  cardPadding: number;
  titleSize: number;
  isAdmin?: boolean; 
  onToggleReviewVisibility?: (problemId: string, hide: boolean) => void; 
};

export function JosekiExplorer({
  problems,
  tacticsGroups,
  tacticsSubGroups,
  onSelect,
  onEdit,
  onDelete,
  onCopy,
  onSaveGroup,
  onDeleteGroup,
  onSaveSubGroup,
  onDeleteSubGroup,
  onMoveGroup,
  onMoveSubGroup,
  onMoveProblem,
  cardPadding,
  titleSize,
  isAdmin = false,
  onToggleReviewVisibility
}: JosekiExplorerProps) {
  // 親カテゴリ（戦法・親グループ）の展開状態管理
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(
    tacticsGroups.length > 0 ? tacticsGroups[0].id : null
  );

  // 子カテゴリ（戦型フォルダ・子グループ）の展開状態を管理するState
  const [expandedSubGroupId, setExpandedSubGroupId] = useState<string | null>(null);

  const toggleGroup = (groupId: string) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
    setExpandedSubGroupId(null);
  };

  const toggleSubGroup = (subGroupId: string) => {
    setExpandedSubGroupId(expandedSubGroupId === subGroupId ? null : subGroupId);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center border-b border-amber-900/10 pb-3">
        <h3 className="text-sm font-bold text-amber-900/50 tracking-wider uppercase">
          戦法 ＆ 定跡ライブラリ
        </h3>
        {isAdmin && (
          <button
            onClick={() => {
              const name = prompt("追加する新しい戦法（親グループ）の名前を入力してください：");
              if (name && name.trim()) onSaveGroup(null, name.trim());
            }}
            className="text-xs font-bold text-amber-800 hover:text-amber-955 bg-amber-50 hover:bg-amber-100 border border-amber-800/20 px-3.5 py-1.5 rounded-xl transition-all"
          >
            ＋ 戦法（親）を追加
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 font-sans">
        {tacticsGroups.map((group) => {
          const isExpanded = expandedGroupId === group.id;
          const groupProblems = problems.filter((p) => p.groupId === group.id);
          const subFolders = tacticsSubGroups.filter((sg) => sg.groupId === group.id);

          return (
            <div 
              key={group.id} 
              className="bg-white border border-amber-900/5 rounded-2xl shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* 親グループヘッダー */}
              <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-amber-50/10 transition-colors select-none">
                <div onClick={() => toggleGroup(group.id)} className="flex-grow">
                  <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {group.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 mr-2" onClick={(e) => e.stopPropagation()}>
                      {/* 【親並び替え矢印】 */}
                      {onMoveGroup && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); onMoveGroup(group.id, 'up'); }}
                            className="p-1 text-xs hover:bg-amber-100 rounded text-gray-400 hover:text-amber-800 transition-colors"
                            title="戦法を上に移動"
                          >
                            ▲
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onMoveGroup(group.id, 'down'); }}
                            className="p-1 text-xs hover:bg-amber-100 rounded text-gray-400 hover:text-amber-800 transition-colors"
                            title="戦法を下に移動"
                          >
                            ▼
                          </button>
                          <span className="text-gray-300">|</span>
                        </>
                      )}
                      <button
                        onClick={() => {
                          const name = prompt("戦法の名前を編集：", group.name);
                          if (name && name.trim()) onSaveGroup(group.id, name.trim());
                        }}
                        className="p-1 text-xs hover:bg-amber-50 rounded text-gray-400 hover:text-amber-800 transition-colors"
                        title="戦法名を編集"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`戦法「${group.name}」を削除しますか？\n（フォルダ内の戦型、すべての定跡問題も一斉に連動削除されます）`)) {
                            onDeleteGroup(group.id);
                          }
                        }}
                        className="p-1 text-xs hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"
                        title="戦法を削除"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                  <span onClick={() => toggleGroup(group.id)} className="text-gray-400 font-bold text-lg">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* 子定跡リスト ＆ 戦型フォルダ */}
              {isExpanded && (
                <div className="border-t border-amber-900/5 bg-gray-50/40 p-4 space-y-4">
                  {isAdmin && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const name = prompt("この戦法の中に追加する、新しい戦型（子フォルダ）の名前を入力してください：");
                          if (name && name.trim()) onSaveSubGroup(null, group.id, name.trim());
                        }}
                        className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-900/5 px-3 py-1.5 rounded-lg transition-all"
                      >
                        ＋ この戦法に「戦型（子）」を追加
                      </button>
                    </div>
                  )}

                  {subFolders.length === 0 ? (
                    <p className="text-xs italic text-gray-400 p-3 text-center">
                      登録されている戦型フォルダがありません。
                    </p>
                  ) : (
                    subFolders.map((sub) => {
                      const isSubExpanded = expandedSubGroupId === sub.id;
                      const subProblems = groupProblems.filter((p) => p.subGroupId === sub.id);

                      return (
                        <div key={sub.id} className="bg-amber-50/5 border border-amber-900/5 p-4 rounded-xl space-y-3">
                          
                          {/* 子グループ（戦型フォルダ）ヘッダー */}
                          <div 
                            onClick={() => toggleSubGroup(sub.id)}
                            className="flex justify-between items-center border-b border-amber-900/5 pb-2 cursor-pointer select-none hover:bg-amber-100/30 p-2 rounded transition-colors"
                          >
                            <span className="text-sm font-extrabold text-amber-900 flex items-center gap-1.5">
                              📁 {sub.name}
                              <span className="text-[10px] text-gray-400 font-normal">({subProblems.length}つの定跡)</span>
                            </span>
                            
                            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                              {isAdmin && (
                                <div className="flex items-center gap-1.5">
                                  {/* 【子並び替え矢印】 */}
                                  {onMoveSubGroup && (
                                    <>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); onMoveSubGroup(sub.id, 'up'); }}
                                        className="text-[11px] font-bold text-gray-400 hover:text-amber-800 hover:bg-amber-100/50 px-1.5 py-0.5 rounded transition-all"
                                        title="上に移動"
                                      >
                                        ▲
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); onMoveSubGroup(sub.id, 'down'); }}
                                        className="text-[11px] font-bold text-gray-400 hover:text-amber-800 hover:bg-amber-100/50 px-1.5 py-0.5 rounded transition-all"
                                        title="下に移動"
                                      >
                                        ▼
                                      </button>
                                      <span className="text-gray-300">|</span>
                                    </>
                                  )}
                                  <button
                                    onClick={() => {
                                      const name = prompt("戦型（フォルダ）の名前を編集：", sub.name);
                                      if (name && name.trim()) onSaveSubGroup(sub.id, group.id, name.trim());
                                    }}
                                    className="text-[10px] hover:underline text-gray-400 hover:text-amber-800"
                                  >
                                    編集
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={() => {
                                      if (confirm(`戦型「${sub.name}」を削除しますか？\n（このフォルダ内に含まれるすべての定跡問題も連動削除されます）`)) {
                                        onDeleteSubGroup(sub.id);
                                      }
                                    }}
                                    className="text-[10px] hover:underline text-gray-400 hover:text-red-600"
                                  >
                                    削除
                                  </button>
                                </div>
                              )}
                              <span className="text-gray-400 text-xs font-bold pl-2">
                                {isSubExpanded ? '▲' : '▼'}
                              </span>
                            </div>
                          </div>

                          {/* 孫要素の展開表示 */}
                          {isSubExpanded && (
                            <div className="grid grid-cols-1 gap-3 pt-2 animate-fade-in">
                              {subProblems.length === 0 ? (
                                <p className="text-xs italic text-gray-400 p-2 text-center">
                                  このフォルダには定跡が登録されていません。
                                </p>
                              ) : (
                                subProblems.map((problem) => {
                                  const progress = Math.round((problem.srs.stage / 7) * 100);

                                  return (
                                    <div
                                      key={problem.id}
                                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-amber-900/5 hover:border-amber-900/20 rounded-xl transition-all shadow-sm group"
                                    >
                                      <div className="flex-grow max-w-xl">
                                        <h5 className="text-lg font-black text-gray-800">
                                          {problem.title}
                                        </h5>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                          {problem.description}
                                        </p>
                                      </div>

                                      {/* 習得度 ＆ Lvバッジ */}
                                      <div className="flex items-center gap-4 flex-shrink-0 min-w-[150px]">
                                        <div className="flex-grow">
                                          <div className="flex justify-between text-[13px] font-bold text-gray-400 mb-1">
                                            <span>習得度</span>
                                            <span>{progress}%</span>
                                          </div>
                                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                              className="bg-amber-600 h-full rounded-full transition-all duration-300" 
                                              style={{ width: `${progress}%` }}
                                            />
                                          </div>
                                        </div>
                                        
                                        <div className="flex flex-col gap-1 items-center">
                                          <span className="text-base font-serif font-black text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                                            Lv.{problem.srs.stage}
                                          </span>
                                          
                                          {problem.srs.hiddenFromReview && (
                                            <span className="text-[10px] font-extrabold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                                              👁️‍🗨️ 復習非表示中
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* アクションボタン */}
                                      <div className="flex items-center gap-3">
                                        <div className="flex flex-col gap-1.5 items-end">
                                          <button
                                            onClick={() => onSelect(problem)}
                                            className="text-[18px] font-black text-white bg-amber-600 hover:bg-amber-700 transition-all py-2.5 px-5 rounded-2xl shadow-sm active:scale-95"
                                          >
                                            学習を開始する ➔
                                          </button>

                                          {problem.srs.hiddenFromReview && onToggleReviewVisibility && (
                                            <button
                                              className="text-[11px] font-extrabold text-blue-600 hover:underline px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shadow-sm animate-none"
                                              title="この定跡を今日の復習予定リストに復帰させます"
                                              onClick={(e) => { e.stopPropagation(); onToggleReviewVisibility(problem.id, false); }}
                                            >
                                              👁️今日の復習に戻す
                                            </button>
                                          )}
                                        </div>

                                        {isAdmin && (
                                          <div className="flex items-center gap-1.5 border-l border-gray-200 pl-3">
                                            {/* 【孫（定跡）並び替え矢印】 */}
                                            {onMoveProblem && (
                                              <>
                                                <button
                                                  onClick={(e) => { e.stopPropagation(); onMoveProblem(problem.id, 'up'); }}
                                                  className="text-xs hover:bg-amber-50 p-1.5 rounded text-gray-400 hover:text-amber-800"
                                                  title="上に移動"
                                                >
                                                  ▲
                                                </button>
                                                <button
                                                  onClick={(e) => { e.stopPropagation(); onMoveProblem(problem.id, 'down'); }}
                                                  className="text-xs hover:bg-amber-50 p-1.5 rounded text-gray-400 hover:text-amber-800"
                                                  title="下に移動"
                                                >
                                                  ▼
                                                </button>
                                                <span className="text-gray-200">|</span>
                                              </>
                                            )}
                                            <button
                                              onClick={() => onEdit(problem)}
                                              className="text-xs hover:bg-amber-50 p-1.5 rounded text-gray-400 hover:text-amber-800"
                                              title="定跡を編集"
                                            >
                                              ✏️
                                            </button>
                                            <button
                                              onClick={() => {
                                                onCopy(problem.id);
                                                alert(`定跡「${problem.title}」をコピーしました！`);
                                              }}
                                              className="text-xs hover:bg-blue-50 p-1.5 rounded text-gray-400 hover:text-blue-600"
                                              title="定跡をコピー"
                                            >
                                              📋
                                            </button>
                                            <button
                                              onClick={() => {
                                                if (confirm(`定跡「${problem.title}」を完全に削除しますか？`)) {
                                                  onDelete(problem.id);
                                                }
                                              }}
                                              className="text-xs hover:bg-red-50 p-1.5 rounded text-gray-400 hover:text-red-600"
                                              title="定跡を削除"
                                            >
                                              🗑️
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}