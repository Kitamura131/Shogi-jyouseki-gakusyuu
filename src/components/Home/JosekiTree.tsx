'use client';

import React, { useState } from 'react';
import { JosekiProblem, TacticsGroup } from '../../types/shogi';
import { initialTacticsGroups } from '../../data/initialJoseki';

type JosekiTreeProps = {
  problems: JosekiProblem[];
  onSelect: (problem: JosekiProblem) => void;
};

export function JosekiTree({ problems, onSelect }: JosekiTreeProps) {
  // どの親戦法（groupId）が展開されているかを管理するState (初期値は最初の戦法)
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(initialTacticsGroups[0].id);

  const toggleGroup = (groupId: string) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-xs font-bold text-amber-900/40 tracking-wider uppercase mb-1">
        戦法 ＆ 定跡ライブラリ
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {initialTacticsGroups.map((group) => {
          const isExpanded = expandedGroupId === group.id;
          
          // このグループに属する定跡問題をフィルター
          const groupProblems = problems.filter((p) => p.groupId === group.id);

          return (
            <div 
              key={group.id} 
              className="bg-white border border-amber-900/5 rounded-2xl shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* 親グループヘッダー (クリックで開閉) */}
              <div
                onClick={() => toggleGroup(group.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-amber-50/20 transition-colors select-none"
              >
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{group.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                </div>
                <span className="text-gray-400 font-bold text-lg transition-transform duration-200">
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>

              {/* 子定跡リスト (展開時のみ表示) */}
              {isExpanded && (
                <div className="border-t border-amber-900/5 bg-gray-50/40 p-4 space-y-2">
                  {groupProblems.length === 0 ? (
                    <p className="text-xs italic text-gray-400 p-3 text-center">
                      まだ登録されている定跡がありません。
                    </p>
                  ) : (
                    groupProblems.map((problem) => {
                      // 進捗率を算出 (最高ステージ7段階として％を計算)
                      const progress = Math.round((problem.srs.stage / 7) * 100);

                      return (
                        <div
                          key={problem.id}
                          onClick={() => onSelect(problem)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white hover:bg-amber-50/30 border border-amber-900/5 hover:border-amber-900/20 rounded-xl cursor-pointer transition-all shadow-sm"
                        >
                          {/* 左側: 定跡のタイトル・説明 */}
                          <div className="flex-grow max-w-xl">
                            <h5 className="text-sm font-bold text-gray-800">{problem.title}</h5>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{problem.description}</p>
                          </div>

                          {/* 右側: 進捗度プログレスバー */}
                          <div className="flex items-center gap-4 flex-shrink-0 min-w-[120px]">
                            <div className="flex-grow">
                              <div className="flex justify-between text-[9px] font-bold text-gray-400 mb-1">
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
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1.5 rounded-lg">
                              Lv.{problem.srs.stage}
                            </span>
                          </div>
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