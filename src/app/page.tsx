// src/app/page.tsx
'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Dashboard } from '../components/Home/Dashboard';
import { JosekiExplorer } from '../components/Home/JosekiExplorer';
import Board, { BoardState } from '../components/Board';
import { ErrorBoundary } from '../components/ErrorBoundary';

// 分割コンポーネントをインポート
import { Header } from '../components/Header';
import { LeftPanel } from '../components/LeftPanel';
import { ExportModal } from '../components/ExportModal';
import { LearnPanel } from '../components/Learn/LearnPanel';
import { RecordPanel } from '../components/Record/RecordPanel';
import { RecordSettingModal } from '../components/Record/RecordSettingModal';
import { AdBanner } from '../components/AdBanner';

// フローティング継盤のインポート
import { SubBoardModal } from '../components/Learn/SubBoardModal';

import { JosekiProblem, Move } from '../types/shogi';
import { STORAGE_KEYS, BOARD_SIZE } from '../utils/constants';
import { useJosekiStore } from '../hooks/useJosekiStore';
import { useShogiGame } from '../hooks/useShogiGame';
import { getGameStateAtStep } from '../utils/boardEngine';


export default function Home() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
      <div className="min-h-screen bg-[#F6F3EB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-amber-700 font-serif text-2xl">読み込み中...</div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
    </ErrorBoundary>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const isAdmin = !!(searchParams && searchParams.get('admin') === 'true');

  // --- A. モードとデータの状態管理 ---
  const [mode, setMode] = useState<'home' | 'learn' | 'record'>('home');
  const [selectedJoseki, setSelectedJoseki] = useState<JosekiProblem | null>(null);

  // 定跡カード選択時に画面中央に大きく表示する「プレビューポップアップ」用State
  const [previewJoseki, setPreviewJoseki] = useState<JosekiProblem | null>(null);

  // --- B. 独立したカスタムフックのバインド ---
  const store = useJosekiStore();

  // 現在選択されている定跡のリアルタイム最新状態をデータベースから同期
  const currentJoseki = store.problems.find(p => p.id === selectedJoseki?.id) || selectedJoseki;

  // ゲーム制御用フック
  const game = useShogiGame(selectedJoseki, mode, undefined);

  // --- C. 状態管理State ---
  const [boardWidth, setBoardWidth] = useState<number>(BOARD_SIZE.DEFAULT);
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
  const [isHintRevealed, setIsHintRevealed] = useState<boolean>(false);

  // 検討用フローティング継盤（つぎばん）起動用のState
  const [isSubBoardOpen, setIsSubBoardOpen] = useState<boolean>(false);

  // 一時的な管理者エクスポート機能用State
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [exportText, setExportText] = useState<string>('');

  // クリア状態の進行ステップ管理
  const [clearStep, setClearStep] = useState<'not_cleared' | 'anki_select' | 'action_select'>('not_cleared');

  // レコーダー用内部State
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedSubGroupId, setSelectedSubGroupId] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newFinalComment, setNewFinalComment] = useState<string>(''); // 総括コメント
  const [recorderPlayerColor, setRecorderPlayerColor] = useState<'sente' | 'gote'>('sente');

  // デザイン調整数値
  const homeCardPadding = 36;
  const homeTitleSize = 36;
  const learnKifuHeight = 150;

  // --- D. 画面・設定 of 連動ロジック ---
  useEffect(() => {
    setIsHintRevealed(false);
  }, [game.currentStep, selectedJoseki]);

  useEffect(() => {
    if (mode === 'learn' && selectedJoseki) {
      game.setupLearnMode(selectedJoseki);
    }
  }, [selectedJoseki, mode]);

  useEffect(() => {
    if (!selectedJoseki || mode !== 'learn') {
      setClearStep('not_cleared');
      return;
    }
    const isCompleted = game.currentStep >= selectedJoseki.moves.length && selectedJoseki.moves.length > 0;
    if (isCompleted) {
      if (clearStep === 'not_cleared') {
        setClearStep('anki_select');
      }
    } else {
      setClearStep('not_cleared');
    }
  }, [game.currentStep, mode, selectedJoseki, clearStep]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.BOARD_WIDTH);
      if (saved) setBoardWidth(Number(saved));
    }
  }, []);

  // ---- 管理者専用：録音開始 ----
  const handleStartRecording = () => {
    if (!isAdmin) {
      alert("定跡の登録・録音は管理者モードでのみ可能です。\n管理者モードで開くには、URLに `?admin=true` を付与してください。");
      return;
    }

    if (store.josekiGroups.length === 0 || store.subGroups.length === 0) {
      alert("定跡を登録する前に、まず左メニューから「戦法」および「戦型」を追加してください。");
      return;
    }
    const defaultGroup = store.josekiGroups[0].id;
    const defaultSub = store.subGroups.filter(sg => sg.groupId === defaultGroup)[0]?.id || '';
    
    game.resetToInitialBoard();
    game.setRecordedMoves([]);
    game.setStartStep(0);
    setNewTitle('');
    setNewDescription('');
    setNewFinalComment(''); 
    setSelectedGroupId(defaultGroup);
    setSelectedSubGroupId(defaultSub);
    setRecorderPlayerColor('sente');
    setEditingProblemId(null);
    setIsSettingOpen(true);
  };

  // ---- 管理者専用：編集開始 ----
  const handleStartEditing = (problem: JosekiProblem) => {
    if (!isAdmin) {
      alert("編集は管理者モードでのみ可能です。URLに `?admin=true` を付与してください。");
      return;
    }
    setEditingProblemId(problem.id);
    setSelectedGroupId(problem.groupId);
    setSelectedSubGroupId(problem.subGroupId);
    setNewTitle(problem.title);
    setNewDescription(problem.description);
    setNewFinalComment(problem.finalComment || ''); 
    setRecorderPlayerColor(problem.playerColor);
    game.setStartStep(problem.startStep);
    game.setRecordedMoves(problem.moves);

    const state = game.getGameStateAtStep(problem, problem.moves.length);
    game.setBoard(state.board);
    game.setSenteHand(state.senteHand);
    game.setGoteHand(state.goteHand);
    game.setSelectedFrom(null);
    setIsSettingOpen(true);
  };

  // レコーダー設定確定（新設）
  const handleConfirmRecording = () => {
    if (!newTitle.trim()) {
      alert("定跡のタイトルを入力してください。");
      return;
    }
    setIsSettingOpen(false);
    setMode('record');
    game.setCurrentComment('');
    game.setNewHint('');
  };

  // 定跡の保存
  const handleSaveJoseki = () => {
    if (!isAdmin) {
      alert("保存は管理者モードでのみ可能です。");
      return;
    }
    if (game.recordedMoves.length === 0) {
      alert("盤面を動かして手順を記録してください。");
      return;
    }

    const baseProblem: Omit<JosekiProblem, 'srs'> = {
      id: editingProblemId || `custom-${Date.now()}`,
      groupId: selectedGroupId,
      subGroupId: selectedSubGroupId,
      title: newTitle,
      description: newDescription || "自分で登録したオリジナル定跡です。",
      playerColor: recorderPlayerColor,
      startStep: game.startStep,
      moves: game.recordedMoves,
      finalComment: newFinalComment
    };

    let updatedProblems: JosekiProblem[] = [];

    if (editingProblemId) {
      updatedProblems = store.problems.map((p) => {
        if (p.id === editingProblemId) {
          return { ...baseProblem, srs: p.srs };
        }
        return p;
      });
    } else {
      const newProblem: JosekiProblem = {
        ...baseProblem,
        srs: { stage: 0, interval: 0, nextReviewDate: null, lastReviewedAt: null }
      };
      updatedProblems = [...store.problems, newProblem];
    }

    store.setProblems(updatedProblems);
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updatedProblems));

    alert(editingProblemId ? "定跡を上書き更新しました！" : "定跡を新しく保存しました！");
    handleCancel();
  };

  // 【バグ修正】定跡カードを選択した際、直接遷移せず、まずは「プレビューポップアップ」のみを安全に起動します！
  const handleSelectJoseki = (problem: JosekiProblem) => {
    setPreviewJoseki(problem);
  };

  // 局面プレビューモーダルから、正式に定跡学習（画面ジャンプ）を開始する
  const handleStartLearnAfterPreview = () => {
    if (!previewJoseki) return;
    setSelectedJoseki(previewJoseki);
    setMode('learn');
    setClearStep('not_cleared');
    setPreviewJoseki(null); // プレビューモーダルを閉じる
  };

  // キャンセル
  const handleCancel = () => {
    setMode('home');
    setSelectedJoseki(null);
    game.setSelectedFrom(null);
    setClearStep('not_cleared');
    game.resetToInitialBoard();
    setIsSubBoardOpen(false); 
  };

  const handleAnkiSelect = (selection: 'again' | 'good') => {
    if (!selectedJoseki) return;
    store.updateProblemSrs(selectedJoseki.id, false, selection);
    setClearStep('action_select');
  };

  const handleReplayJoseki = () => {
    setClearStep('not_cleared');
    if (selectedJoseki) {
      game.setupLearnMode(selectedJoseki);
    }
  };

  const handleNextJoseki = () => {
    setClearStep('not_cleared');
    const currentIndex = store.problems.findIndex(p => p.id === selectedJoseki?.id);
    const nextProblem = store.problems[currentIndex + 1];
    if (nextProblem) {
      handleSelectJoseki(nextProblem);
    } else {
      handleCancel();
      alert('すべての定跡を学習しました！素晴らしい！');
    }
  };

  const handleStartReview = () => {
    const now = new Date();
    const reviewable = store.problems.filter((p) => {
      if (!p.srs.nextReviewDate) return false;
      return new Date(p.srs.nextReviewDate) <= now;
    });
    if (reviewable.length > 0) {
      handleSelectJoseki(reviewable[0]);
    } else {
      alert("今日復習すべき定跡はすべて完了しています！素晴らしい！");
    }
  };

  const handleBoardWidthChange = (val: number) => {
    setBoardWidth(val);
    localStorage.setItem(STORAGE_KEYS.BOARD_WIDTH, val.toString());
  };

  // 復習リストからの削除ハンドラ（ゴミ箱/完全リセット：警告アラートダイアログ連動）
  const handleRemoveFromReviewQueue = (problemId: string) => {
    if (window.confirm("⚠️本当にこれまでの学習データを完全に削除（初期化）しますか？\nこれまでの習得ステージや復習スケジュール履歴がすべて消去され、最初からやり直しになります。")) {
      const updatedProblems = store.problems.map((prob) => {
        if (prob.id === problemId) {
          return {
            ...prob,
            srs: {
              stage: 0,
              interval: 0,
              nextReviewDate: null, 
              lastReviewedAt: null,
              hiddenFromReview: false 
            }
          };
        }
        return prob;
      });

      store.setProblems(updatedProblems);
      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updatedProblems));
      alert("学習データを完全にリセットしました。未学習の状態に戻ります。");
    }
  };

  // 復習リストの非表示ハンドラー
  const handleToggleReviewVisibility = (problemId: string, hide: boolean) => {
    const updatedProblems = store.problems.map((prob) => {
      if (prob.id === problemId) {
        return {
          ...prob,
          srs: {
            ...prob.srs,
            hiddenFromReview: hide 
          }
        };
      }
      return prob;
    });

    store.setProblems(updatedProblems);
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updatedProblems));
    
    if (hide) {
      alert("この定跡を「復習非表示中」に指定しました。今日の復習リストから非表示になります。\n再表示させたい場合は、下のライブラリのカードからいつでも復帰させることができます。");
    } else {
      alert("この定跡を今日の復習リストに復活させました。");
    }
  };

  // 管理者用エクスポート（finalComment も漏れなく抽出できるように連動）
  const handleExportData = () => {
    if (!isAdmin) {
      alert("エクスポートは管理者モードでのみ可能です。");
      return;
    }
    try {
      const rawGroups = localStorage.getItem(STORAGE_KEYS.GROUPS);
      const rawSubGroups = localStorage.getItem(STORAGE_KEYS.SUB_GROUPS);
      const rawProblems = localStorage.getItem(STORAGE_KEYS.PROBLEMS);

      const groups = rawGroups ? JSON.parse(rawGroups) : store.josekiGroups;
      const subGroups = rawSubGroups ? JSON.parse(rawSubGroups) : store.subGroups;
      const problems = rawProblems ? JSON.parse(rawProblems) : store.problems;

      const cleansedProblems = problems.map((problem: any) => ({
        ...problem,
        srs: {
          stage: 0,
          interval: 0,
          nextReviewDate: null,
          lastReviewedAt: null
        }
      }));

      const formattedCode = `/**
 * 将棋定跡学習アプリ 初期マスターデータ
 * 管理者ツールによってLocalStorageからクレンジング抽出された自動生成ファイルです。
 */

import { JosekiProblem, JosekiGroup, SubGroup } from '../types/shogi';

export const initialTacticsGroups: JosekiGroup[] = ${JSON.stringify(groups, null, 2)};

export const initialTacticsSubGroups: SubGroup[] = ${JSON.stringify(subGroups, null, 2)};

export const initialJosekiProblems: JosekiProblem[] = ${JSON.stringify(cleansedProblems, null, 2)};
`;

      setExportText(formattedCode);
      setIsExportOpen(true);
    } catch (e) {
      alert("データのパース、またはクレンジングの処理中に不具合が発生しました: " + e);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportText);
    alert("クリップボードにコピーしました！");
  };

  // ==================== 表示判定補助 ====================
  const moves = selectedJoseki?.moves || [];
  const totalMoves = moves.length;
  const currentIndex = store.problems.findIndex(p => p.id === selectedJoseki?.id);
  const hasNextProblem = currentIndex !== -1 && currentIndex < store.problems.length - 1;

  const getNextGoodIntervalText = () => {
    const stage = currentJoseki?.srs?.stage ?? 0;
    const nextStage = Math.min(7, stage + 1);
    const intervals = [0, 1, 3, 7, 14, 30, 60, 120];
    const days = intervals[nextStage];
    return `${days}日後`;
  };

  const isYourTurn = selectedJoseki
    ? (selectedJoseki.playerColor === 'sente' && game.currentStep % 2 === 0) ||
      (selectedJoseki.playerColor === 'gote' && game.currentStep % 2 !== 0)
    : false;

  const handleTriggerMoveEditor = (idx: number) => {
    const btn = document.getElementById(`btn-edit-move-${idx}`);
    if (btn) btn.click();
  };

  // ----- ラップして渡す -----
  const wrappedOnEdit = (problem: JosekiProblem) => handleStartEditing(problem);
  const wrappedOnDelete = (id: string) => {
    if (!isAdmin) { alert("削除は管理者モードでのみ可能です。"); return; }
    store.deleteProblem(id);
  };
  const wrappedOnSaveGroup = (id: string | null, name: string) => {
    if (!isAdmin) { alert("管理者操作は管理者モードでのみ可能です。"); return; }
    store.saveGroup(id, name);
  };
  const wrappedOnDeleteGroup = (id: string) => {
    if (!isAdmin) { alert("管理者操作は管理者モードでのみ可能です。"); return; }
    store.deleteGroup(id);
  };
  const wrappedOnSaveSubGroup = (id: string | null, groupId: string, name: string) => {
    if (!isAdmin) { alert("管理者操作は管理者モードでのみ可能です。"); return; }
    store.saveSubGroup(id, groupId, name);
  };
  const wrappedOnDeleteSubGroup = (id: string) => {
    if (!isAdmin) { alert("管理者操作は管理者モードでのみ可能です。"); return; }
    store.deleteSubGroup(id);
  };

  return (
    <main className="min-h-screen overflow-y-auto pb-16 bg-[#F6F3EB] flex flex-col justify-between relative">
      <Header
        mode={mode}
        onExport={handleExportData}
        onStartRecording={handleStartRecording}
        isAdmin={isAdmin}
      />

      {mode === 'learn' && selectedJoseki && (
        <div className="w-full bg-white border-b border-amber-900/5 py-4 px-6 shadow-sm flex items-center justify-between font-sans z-10 animate-fade-in flex-shrink-0">
          <div className="flex-1" />
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#111827] tracking-wider text-center flex-grow">
            {selectedJoseki.title}
          </h2>
          <div className="flex-grow flex-1" />
        </div>
      )}

      {/* コンテンツエリア */}
      <div className="flex-shrink-0 flex items-center justify-center w-full py-6 min-h-0 h-auto overflow-visible z-10">
        {mode === 'home' ? (
          <div className="w-full">
            <div className="mx-auto w-full max-w-[1680px] px-4 xl:px-6">
              <div className="hidden xl:flex items-start gap-6">
                {/* 左サイドバー広告 */}
                <div className="hidden xl:block flex-shrink-0">
                  <AdBanner position="sidebar" />
                </div>

                {/* 中央コンテンツ */}
                <div className="flex-1 min-h-[60vh] overflow-y-auto">
                  <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-6 py-2">
                    <Dashboard
                      problems={store.problems}
                      onStartReview={handleStartReview}
                      onSelect={handleSelectJoseki}
                      onTimeTravel={store.timeTravelReviewDates}
                      cardPadding={homeCardPadding}
                      titleSize={homeTitleSize}
                      isAdmin={isAdmin}
                      onRemoveFromReviewQueue={handleRemoveFromReviewQueue}
                      onToggleReviewVisibility={handleToggleReviewVisibility}
                    />
                    <JosekiExplorer
                      problems={store.problems}
                      tacticsGroups={store.josekiGroups}
                      tacticsSubGroups={store.subGroups}
                      onSelect={handleSelectJoseki}
                      onEdit={wrappedOnEdit}
                      onDelete={wrappedOnDelete}
                      onSaveGroup={wrappedOnSaveGroup}
                      onDeleteGroup={wrappedOnDeleteGroup}
                      onSaveSubGroup={wrappedOnSaveSubGroup}
                      onDeleteSubGroup={wrappedOnDeleteSubGroup}
                      cardPadding={homeCardPadding}
                      titleSize={homeTitleSize}
                      isAdmin={isAdmin}
                      onToggleReviewVisibility={handleToggleReviewVisibility}
                    />
                  </div>
                </div>

                {/* 右サイドバー広告 */}
                <div className="hidden xl:block flex-shrink-0">
                  <AdBanner position="sidebar" />
                </div>
              </div>

              {/* 小画面 */}
              <div className="xl:hidden">
                <div className="max-w-[1200px] w-full mx-auto px-0 flex flex-col gap-6">
                  <Dashboard
                    problems={store.problems}
                    onStartReview={handleStartReview}
                    onSelect={handleSelectJoseki}
                    onTimeTravel={store.timeTravelReviewDates}
                    cardPadding={homeCardPadding}
                    titleSize={homeTitleSize}
                    isAdmin={isAdmin}
                    onRemoveFromReviewQueue={handleRemoveFromReviewQueue}
                    onToggleReviewVisibility={handleToggleReviewVisibility}
                  />
                  <JosekiExplorer
                    problems={store.problems}
                    tacticsGroups={store.josekiGroups}
                    tacticsSubGroups={store.subGroups}
                    onSelect={handleSelectJoseki}
                    onEdit={wrappedOnEdit}
                    onDelete={wrappedOnDelete}
                    onSaveGroup={wrappedOnSaveGroup}
                    onDeleteGroup={wrappedOnDeleteGroup}
                    onSaveSubGroup={wrappedOnSaveSubGroup}
                    onDeleteSubGroup={wrappedOnDeleteSubGroup}
                    cardPadding={homeCardPadding}
                    titleSize={homeTitleSize}
                    isAdmin={isAdmin}
                    onToggleReviewVisibility={handleToggleReviewVisibility}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 学習中の左パネル廃止
          // 右側カラムを包むコンテナの高さ制限を完全に解除し、h-auto（画面全体のスクロール）に最適化
          <div className="max-w-[1680px] w-full mx-auto px-6 flex flex-col xl:flex-row xl:items-start gap-6 justify-center h-auto">
            {mode === 'record' && (
              <LeftPanel
                mode={mode}
                editingProblemId={editingProblemId}
                selectedJoseki={selectedJoseki}
                currentJoseki={currentJoseki}
                game={game}
                totalMoves={totalMoves}
                moves={moves}
                isYourTurn={isYourTurn}
                handleCancel={handleCancel}
                handleTriggerMoveEditor={handleTriggerMoveEditor}
              />
            )}

            {/* 中央カラム: 将棋盤 */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4 justify-center w-full xl:w-auto bg-white/10 p-4 border border-amber-900/5 rounded-2xl shadow-sm relative h-auto">
              {/* 【バグ改修】不自然に隠れていた「継盤ボタン」関係のコードを1から完全に書き直し、
                  ここではボタンを配置せず、LearnPanel側の「1手戻す」のすぐ真下で確実に起動するように変更しました。 */}
              
              <Board
                board={game.board}
                senteHand={game.senteHand}
                goteHand={game.goteHand}
                selectedFrom={game.selectedFrom}
                onSquareClick={clearStep === 'anki_select' ? () => {} : game.handleSquareClick}
                onHandClick={clearStep === 'anki_select' ? () => {} : game.handleHandClick}
                boardWidth={boardWidth}
                isFlipped={
                  mode === 'record'
                    ? recorderPlayerColor === 'gote'
                    : (selectedJoseki ? selectedJoseki.playerColor === 'gote' : false)
                }
                lastAppliedMove={game.lastAppliedMove} 
              />

              {clearStep === 'anki_select' && (
                <div className="absolute inset-0 bg-black/5 rounded-2xl flex items-center justify-center z-10 cursor-not-allowed">
                  <span className="bg-slate-900/85 text-white text-xs font-bold px-3 py-2 rounded-xl select-none flex items-center gap-1">
                    🔒 記憶度の評価を行ってください
                  </span>
                </div>
              )}

              <div className="w-full max-w-[320px] bg-white/80 border border-amber-900/5 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-[9px] font-bold text-gray-400 select-none">盤面 小</span>
                <input
                  type="range" min="320" max="800" step="10"
                  value={boardWidth}
                  onChange={(e) => handleBoardWidthChange(Number(e.target.value))}
                  className="flex-grow accent-amber-700 h-1 bg-gray-200 rounded-lg cursor-pointer"
                  disabled={game.isThinking || clearStep === 'anki_select'}
                />
                <span className="text-[9px] font-bold text-gray-400 select-none">盤面 大</span>
              </div>
            </div>

            {/* 右カラム: モード別操作パネル */}
            {mode === 'learn' ? (
              <div className="flex flex-col gap-3 flex-grow shrink min-w-[300px] max-w-[840px] w-full h-auto">
                <LearnPanel
                  game={game}
                  clearStep={clearStep}
                  selectedJoseki={selectedJoseki}
                  currentJoseki={currentJoseki}
                  totalMoves={totalMoves}
                  hasNextProblem={hasNextProblem}
                  handleAnkiSelect={handleAnkiSelect}
                  handleNextJoseki={handleNextJoseki}
                  handleReplayJoseki={handleReplayJoseki}
                  handleCancel={handleCancel}
                  isHintRevealed={isHintRevealed}
                  setIsHintRevealed={setIsHintRevealed}
                  moves={moves}
                  getNextGoodIntervalText={getNextGoodIntervalText}
                  onOpenSubBoard={() => setIsSubBoardOpen(true)} // 【新設】
                />
                <AdBanner position="panel" />
              </div>
            ) : (
              <div className="flex flex-col gap-3 flex-grow shrink min-w-[300px] max-w-[840px] w-full h-auto">
                <RecordPanel
                  game={game}
                  recorderPlayerColor={recorderPlayerColor}
                  newTitle={newTitle}
                  setNewTitle={setNewTitle}
                  newDescription={newDescription}
                  setNewDescription={setNewDescription}
                  newFinalComment={newFinalComment}
                  setNewFinalComment={setNewFinalComment}
                  editingProblemId={editingProblemId}
                  handleSaveJoseki={handleSaveJoseki}
                  handleCancel={handleCancel}
                />
                <AdBanner position="panel" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 【新設要件】定跡カード選択時に「ホーム画面に残ったまま」画面中央に浮かび上がる局面プレビューダイアログ */}
      {previewJoseki && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[3px] flex items-center justify-center z-[9999] p-4 font-sans animate-fade-in">
          <div className="bg-[#FAF7F0] border-4 border-amber-800 p-6 rounded-3xl max-w-lg w-full shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            
            {/* 上側: タイトルと詳しい解説（文字を大きく見やすく調整） */}
            <div className="text-center pb-2 border-b border-amber-900/5">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">定跡開始プレビュー</span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-amber-955 mt-1 leading-tight">
                {previewJoseki.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-2 leading-relaxed">
                {previewJoseki.description || "解説はありません。"}
              </p>
            </div>

            {/* 真ん中: 大きくてクッキリ見やすい「開始局面＋1手」の将棋盤 */}
            <div className="flex justify-center p-2 bg-white/25 rounded-2xl border border-amber-900/5 pointer-events-none scale-95 origin-center">
              <Board
                board={getGameStateAtStep(previewJoseki, previewJoseki.startStep + 1)}
                senteHand={{}}
                goteHand={{}}
                selectedFrom={null}
                onSquareClick={() => {}}
                onHandClick={() => {}}
                boardWidth={360} 
                isFlipped={previewJoseki.playerColor === 'gote'}
              />
            </div>

            {/* 下側: 操作ボタン */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-amber-900/5">
              <button
                onClick={handleStartLearnAfterPreview}
                className="py-3 px-4 font-extrabold text-sm text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-md active:scale-95 text-center"
              >
                定跡を開始する ➔
              </button>
              <button
                onClick={() => setPreviewJoseki(null)}
                className="py-3 px-4 font-bold text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all shadow-sm text-center"
              >
                閉じる
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 検討用フローティング継盤（つぎばん）モーダル */}
      {selectedJoseki && (
        <SubBoardModal
          isOpen={isSubBoardOpen}
          onClose={() => setIsSubBoardOpen(false)}
          initialBoard={game.board} 
          initialSenteHand={game.senteHand} 
          initialGoteHand={game.goteHand} 
          isFlipped={selectedJoseki.playerColor === 'gote'}
        />
      )}

      {/* 各種設定ダイアログ・モーダル */}
      <RecordSettingModal
        isOpen={isSettingOpen}
        onClose={() => setIsSettingOpen(false)}
        josekiGroups={store.josekiGroups}
        subGroups={store.subGroups}
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={setSelectedGroupId}
        selectedSubGroupId={selectedSubGroupId}
        setSelectedSubGroupId={setSelectedSubGroupId}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        newFinalComment={newFinalComment}
        setNewFinalComment={setNewFinalComment}
        recorderPlayerColor={recorderPlayerColor}
        setRecorderPlayerColor={setRecorderPlayerColor}
        editingProblemId={editingProblemId}
        onConfirm={handleConfirmRecording}
      />

      <ExportModal
        isOpen={isExportOpen}
        exportText={exportText}
        onClose={() => setIsExportOpen(false)}
        onCopy={handleCopyToClipboard}
      />

      {game.isPromoteModalOpen && (game.pendingMove || game.pendingQuizMove) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white border border-amber-900/10 rounded-2xl max-w-xs w-full p-5 shadow-xl text-center space-y-4">
            <h4 className="font-serif font-black text-lg text-gray-900">駒を成りますか？</h4>
            <p className="text-xs text-gray-400">成ってパワーアップさせることができます。</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (mode === 'record' && game.pendingMove) {
                    game.commitMove(game.pendingMove.from, game.pendingMove.to, game.pendingMove.pieceName, game.pendingMove.color, true, game.pendingMove.isDrop);
                    game.setPendingMove(null);
                  } else if (mode === 'learn') {
                    game.handleQuizPromoteDecision(true);
                  }
                  game.setIsPromoteModalOpen(false);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs tracking-wider transition-all"
              >
                成る
              </button>
              <button
                onClick={() => {
                  if (mode === 'record' && game.pendingMove) {
                    game.commitMove(game.pendingMove.from, game.pendingMove.to, game.pendingMove.pieceName, game.pendingMove.color, false, game.pendingMove.isDrop);
                    game.setPendingMove(null);
                  } else if (mode === 'learn') {
                    game.handleQuizPromoteDecision(false);
                  }
                  game.setIsPromoteModalOpen(false);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl text-xs transition-all"
              >
                成らない
              </button>
            </div>
          </div>
        </div>
      )}

      {/* フッター */}
      <footer className="bg-white border-t border-amber-900/5 py-4 text-center text-xs text-gray-400 flex-shrink-0">
        © 将棋定跡学習 MVP
      </footer>
    </main>
  );
}