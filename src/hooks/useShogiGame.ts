// src/hooks/useShogiGame.ts

'use client';

import { useState, useEffect, useRef } from 'react';
import { BoardState, Hand, SelectedFrom, Move, JosekiProblem, SRSStatus, PieceType } from '../types';
import { generateNotation } from '../utils/shogiUtils';

// 平手の初期配置を生成する内部関数
function createInitialBoard(): BoardState {
  const emptyRow = () => Array(9).fill(null);
  const board: BoardState = Array(9).fill(null).map(() => emptyRow());

  // 後手配置
  const goteFirstRow: PieceType[] = ["香", "桂", "銀", "金", "玉", "金", "銀", "桂", "香"];
  for (let i = 0; i < 9; i++) {
    board[0][i] = { name: goteFirstRow[i], color: 'gote' };
  }
  board[1][1] = { name: "飛", color: 'gote' }; 
  board[1][7] = { name: "角", color: 'gote' }; 
  for (let i = 0; i < 9; i++) board[2][i] = { name: "歩", color: 'gote' };

  // 先手配置
  for (let i = 0; i < 9; i++) board[6][i] = { name: "歩", color: 'sente' };
  board[7][1] = { name: "角", color: 'sente' }; 
  board[7][7] = { name: "飛", color: 'sente' }; 
  const senteFirstRow: PieceType[] = ["香", "桂", "銀", "金", "玉", "金", "銀", "桂", "香"];
  for (let i = 0; i < 9; i++) {
    board[8][i] = { name: senteFirstRow[i], color: 'sente' };
  }

  return board;
}

// 駒台（持ち駒）の初期配置
const createEmptyHand = (): Hand => ({ 
  歩: 0, 香: 0, 桂: 0, 銀: 0, 金: 0, 角: 0, 飛: 0, 玉: 0,
  と: 0, 成香: 0, 成桂: 0, 成銀: 0, 龍: 0, 馬: 0
});

export function useShogiGame(
  selectedJoseki: JosekiProblem | null,
  mode: 'home' | 'learn' | 'record',
  onCompleteSrs?: (problemId: string, isPerfect: boolean) => SRSStatus | null, // クイズクリア時にLocalStorage側を更新する関数
  onSaveRecorded?: (moves: Move[], title: string, desc: string, groupId: string, subGroupId: string, color: 'sente' | 'gote', startStep: number) => void // レコーダー保存時の関数
) {
  // --- 1. 将棋盤面 ＆ 駒台のState ---
  const [board, setBoard] = useState<BoardState>(createInitialBoard());
  const [senteHand, setSenteHand] = useState<Hand>(createEmptyHand());
  const [goteHand, setGoteHand] = useState<Hand>(createEmptyHand());
  const [selectedFrom, setSelectedFrom] = useState<SelectedFrom>(null);

  // --- 2. 進行・ルール関連 of State ---
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [hasFailed, setHasFailed] = useState<boolean>(false); // この挑戦で一度でもミスしたか
  const [isThinking, setIsThinking] = useState<boolean>(false); // 相手の思考中ロック用

  // 最後に動いた手の移動元と移動先を追跡・ハイライト表示するState
  const [lastAppliedMove, setLastAppliedMove] = useState<{ from: [number, number] | null; to: [number, number] } | null>(null);

  // --- 3. 2手同時表示の解説コメント＆符号State ---
  const [userComment, setUserComment] = useState<string>('');
  const [userNotation, setUserNotation] = useState<string>('');
  const [opponentComment, setOpponentComment] = useState<string>('');
  const [opponentNotation, setOpponentNotation] = useState<string>('');

  // --- 4. ポップアップ（成り・初期設定）関連のState ---
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState<boolean>(false);
  const [pendingMove, setPendingMove] = useState<{from: [number, number] | null; to: [number, number]; pieceName: string; color: 'sente' | 'gote'; isDrop: boolean} | null>(null);
  const [pendingQuizMove, setPendingQuizMove] = useState<{from: [number, number] | null; to: [number, number]; pieceName: string; color: 'sente' | 'gote'; isDrop: boolean} | null>(null);

  // --- 5. 定跡レコーダー用の棋譜・コメントState ---
  const [recordedMoves, setRecordedMoves] = useState<Move[]>([]);
  const [currentComment, setCurrentComment] = useState<string>('');
  const [newHint, setNewHint] = useState<string>('');
  const [startStep, setStartStep] = useState<number>(0);

  // --- 【安全対策】非同期の自動応手タイマーを安全に破棄するための参照（ゾンビタイマー防止） ---
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // アンマウント時、または問題が切り替わった時に、裏で走っているタイマーを強制停止させるクリーンアップ
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [selectedJoseki]);

  // 効果音再生
  const playSound = (src: string) => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(src);
      audio.play().catch(() => {});
    }
  };

  // 指定された手数 (step) までのゲーム状態をシミュレーション再現して同期する関数
  const getGameStateAtStep = (problem: JosekiProblem, step: number) => {
    const freshBoard = createInitialBoard();
    const sHand = createEmptyHand();
    const gHand = createEmptyHand();

    for (let i = 0; i < step; i++) {
      const move = problem.moves[i];
      const playerColor = i % 2 === 0 ? 'sente' : 'gote';

      if (move.from === null) {
        freshBoard[move.to[0]][move.to[1]] = { name: move.piece, color: playerColor };
        const hand = playerColor === 'sente' ? sHand : gHand;
        hand[move.piece] = Math.max(0, (hand[move.piece] || 1) - 1);
      } else {
        const [fromRow, fromCol] = move.from;
        const [toRow, toCol] = move.to;
        const movingPiece = freshBoard[fromRow][fromCol];

        if (movingPiece) {
          const targetPiece = freshBoard[toRow][toCol];
          
          // 【バグ改修】成駒を取った際も、100%確実に元の「成る前の駒」に翻訳して持ち駒台へ送る復元処理
          if (targetPiece) {
            const takerHand = movingPiece.color === 'sente' ? sHand : gHand;
            let baseName: PieceType = targetPiece.name;
            if (baseName === "龍") baseName = "飛";
            else if (baseName === "馬") baseName = "角";
            else if (baseName === "と") baseName = "歩";
            else if (baseName === "成香") baseName = "香";
            else if (baseName === "成桂") baseName = "桂";
            else if (baseName === "成銀") baseName = "銀";
            takerHand[baseName] = (takerHand[baseName] || 0) + 1;
          }

          let finalName: PieceType = movingPiece.name;
          if (move.promote) {
            if (movingPiece.name === "歩") finalName = "と";
            else if (movingPiece.name === "飛") finalName = "龍";
            else if (movingPiece.name === "角") finalName = "馬";
            else if (movingPiece.name === "香") finalName = "成香";
            else if (movingPiece.name === "桂") finalName = "成桂";
            else if (movingPiece.name === "銀") finalName = "成銀";
          }

          freshBoard[toRow][toCol] = { name: finalName, color: movingPiece.color };
          freshBoard[fromRow][fromCol] = null;
        }
      }
    }
    return { board: freshBoard, senteHand: sHand, goteHand: gHand };
  };

  // 継盤用：現在の学習ステップの1手前の局面（盤面・持ち駒）を取得するヘルパー関数
  const getPreviousStepState = () => {
    if (!selectedJoseki) {
      return { board: createInitialBoard(), senteHand: createEmptyHand(), goteHand: createEmptyHand() };
    }
    // 現在のステップが0手目の場合は初期配置、それ以外は currentStep - 1 手目の状態を再現
    const prevStep = Math.max(0, currentStep - 1);
    return getGameStateAtStep(selectedJoseki, prevStep);
  };

  // 駒の成り・強制成りの判定ロジック
  const checkCanPromote = (
    pieceName: string,
    color: 'sente' | 'gote',
    fromRow: number,
    toRow: number
  ): { canPromote: boolean; mustPromote: boolean } => {
    const promotablePieces = ["歩", "香", "桂", "銀", "角", "飛"];
    if (!promotablePieces.includes(pieceName)) return { canPromote: false, mustPromote: false };

    const isInEnemyZone = (r: number) => color === 'sente' ? r <= 2 : r >= 6;
    const touchedEnemyZone = isInEnemyZone(fromRow) || isInEnemyZone(toRow);
    if (!touchedEnemyZone) return { canPromote: false, mustPromote: false };

    let mustPromote = false;
    if (pieceName === "歩" || pieceName === "香") mustPromote = color === 'sente' ? toRow === 0 : toRow === 8;
    else if (pieceName === "桂") mustPromote = color === 'sente' ? toRow <= 1 : toRow >= 7;

    return { canPromote: true, mustPromote };
  };

  // --- 【自動応手＆コメント自動表示＆クリア判定再帰エンジン】 ---
  const advanceStep = (nextStep: number, currentJosekiData: JosekiProblem) => {
    setCurrentStep(nextStep);
    const state = getGameStateAtStep(currentJosekiData, nextStep);
    setBoard(state.board);
    setSenteHand(state.senteHand);
    setGoteHand(state.goteHand);

    // 2手同時解説の自動振り分け
    const lastMoveIndex = nextStep - 1;
    if (lastMoveIndex >= 0) {
      const lastMove = currentJosekiData.moves[lastMoveIndex];
      const isLastMoveSente = lastMoveIndex % 2 === 0;
      const isPlayerSente = currentJosekiData.playerColor === 'sente';
      const isLastMovePlayer = (isPlayerSente && isLastMoveSente) || (!isPlayerSente && !isLastMoveSente);

      // 最後に動いた手をハイライトとして記録
      setLastAppliedMove({ from: lastMove.from, to: lastMove.to });

      if (isLastMovePlayer) {
        setUserComment(lastMove.comment || '（解説は登録されていません）');
        setUserNotation(lastMove.notation);
        setOpponentComment('相手が考え中...');
        setOpponentNotation('');
      } else {
        setOpponentComment(lastMove.comment || '（解説は登録されていません）');
        setOpponentNotation(lastMove.notation);
      }
    } else {
      setUserComment(''); setUserNotation(''); setOpponentComment(''); setOpponentNotation('');
      setLastAppliedMove(null);
    }

    // クイズ完了の終了判定
    if (nextStep >= currentJosekiData.moves.length) {
      playSound('/sounds/complete.mp3');
      setIsThinking(false);

      if (onCompleteSrs) {
        const isPerfect = !hasFailed;
        onCompleteSrs(currentJosekiData.id, isPerfect);
      }
      return;
    }

    // コンピュータの自動応手を判定
    const nextMove = currentJosekiData.moves[nextStep];
    const isPlayerSente = currentJosekiData.playerColor === 'sente';
    const isNextMoveEnemy = (isPlayerSente && nextStep % 2 !== 0) || (!isPlayerSente && nextStep % 2 === 0);

    if (isNextMoveEnemy) {
      setIsThinking(true);
      
      // 【改修要件】自動応手のディレイを1.3秒（1300ms）に変更
      autoPlayTimerRef.current = setTimeout(() => {
        playSound('/sounds/koma.mp3');
        advanceStep(nextStep + 1, currentJosekiData);
      }, 1300); 
    } else {
      setIsThinking(false);
    }
  };

  // 1手進める（クイズ/レコーダーで手番を確定させ、符号を作る共通処理）
  const commitMove = (
    from: [number, number] | null,
    to: [number, number],
    pieceName: string,
    color: 'sente' | 'gote',
    promote: boolean,
    isDrop: boolean
  ) => {
    const isSenteTurn = recordedMoves.length % 2 === 0;
    
    let finalPieceName: PieceType = pieceName as PieceType;
    if (promote) {
      if (pieceName === "歩") finalPieceName = "と";
      else if (pieceName === "飛") finalPieceName = "龍";
      else if (pieceName === "角") finalPieceName = "馬";
      else if (pieceName === "香") finalPieceName = "成香";
      else if (pieceName === "桂") finalPieceName = "成桂";
      else if (pieceName === "銀") finalPieceName = "成銀";
    }

    const newBoard = board.map(r => [...r]);

    if (isDrop) {
      newBoard[to[0]][to[1]] = { name: finalPieceName, color };
      const hand = color === 'sente' ? senteHand : goteHand;
      const pieceKey = pieceName as PieceType;
      setSenteHand(color === 'sente' ? { ...hand, [pieceKey]: Math.max(0, (hand[pieceKey] || 1) - 1) } : senteHand);
      setGoteHand(color === 'gote' ? { ...hand, [pieceKey]: Math.max(0, (hand[pieceKey] || 1) - 1) } : goteHand);
    } else if (from) {
      const targetPiece = newBoard[to[0]][to[1]];
      
      // 【バグ改修】レコーダーでの駒捕獲時の成駒復元
      if (targetPiece) {
        const takerHand = color === 'sente' ? senteHand : goteHand;
        const setTakerHand = color === 'sente' ? setSenteHand : setGoteHand;
        
        let baseName: PieceType = targetPiece.name;
        if (baseName === "龍") baseName = "飛";
        else if (baseName === "馬") baseName = "角";
        else if (baseName === "と") baseName = "歩";
        else if (baseName === "成香") baseName = "香";
        else if (baseName === "成桂") baseName = "桂";
        else if (baseName === "成銀") baseName = "銀";
        setTakerHand({ ...takerHand, [baseName]: (takerHand[baseName] || 0) + 1 });
      }
      newBoard[to[0]][to[1]] = { name: finalPieceName, color };
      newBoard[from[0]][from[1]] = null;
    }

    setBoard(newBoard);

    // 符号自動生成
    let notation = generateNotation(from, to, pieceName, isSenteTurn);
    if (promote) notation += "成";
    else if (from && checkCanPromote(pieceName, color, from[0], to[0]).canPromote) notation += "不成";

    const newMove: Move = {
      notation,
      from,
      to,
      piece: pieceName as PieceType,
      promote,
      comment: '', 
      hint: ''    
    };

    const newRecordedMoves = [...recordedMoves, newMove];
    setRecordedMoves(newRecordedMoves);
    
    // レコーダーでの着手も、動いた元と先をハイライト
    setLastAppliedMove({ from, to });

    setCurrentComment('');
    setNewHint('');
    playSound('/sounds/koma.mp3');
  };

  // 1手戻す時の解説巻き戻し同期処理
  const syncCommentsToStep = (step: number, problem: JosekiProblem) => {
    if (step === problem.startStep) {
      setUserComment(''); setUserNotation(''); setOpponentComment(''); setOpponentNotation('');
      setLastAppliedMove(null);
      return;
    }

    const isPlayerSente = problem.playerColor === 'sente';
    let lastPlayerStep = -1;
    let lastEnemyStep = -1;

    for (let i = 0; i < step; i++) {
      const isSente = i % 2 === 0;
      const isPlayer = (isPlayerSente && isSente) || (!isPlayerSente && !isSente);
      if (isPlayer) lastPlayerStep = i;
      else lastEnemyStep = i;
    }

    if (lastPlayerStep !== -1) {
      setUserComment(problem.moves[lastPlayerStep].comment || '（この手に対する解説はありません）');
      setUserNotation(problem.moves[lastPlayerStep].notation);
    } else {
      setUserComment(''); setUserNotation('');
    }

    if (lastEnemyStep !== -1 && lastEnemyStep > lastPlayerStep) {
      setOpponentComment(problem.moves[lastEnemyStep].comment || '（この手に対する解説はありません）');
      setOpponentNotation(problem.moves[lastEnemyStep].notation);
    } else if (lastPlayerStep !== -1) {
      setOpponentComment('相手が考え中...');
      setOpponentNotation('');
    } else {
      setOpponentComment(''); setOpponentNotation('');
    }

    // ハイライトを1つ前のステップの指し手に同期
    const prevMove = problem.moves[step - 1];
    if (prevMove) {
      setLastAppliedMove({ from: prevMove.from, to: prevMove.to });
    } else {
      setLastAppliedMove(null);
    }
  };

  // 盤面タップ時のクイズ・レコーダー移動統合ロジック
  const handleSquareClick = (row: number, col: number) => {
    if (isThinking) return;
    if (mode === 'home') return;
    if (!selectedJoseki && mode === 'learn') return;
    if (currentStep >= (selectedJoseki?.moves?.length ?? 0) && mode === 'learn') return;

    const isSenteTurn = mode === 'learn' ? (currentStep % 2 === 0) : (recordedMoves.length % 2 === 0);
    const color: 'sente' | 'gote' = isSenteTurn ? 'sente' : 'gote';

    if (selectedFrom?.type === 'hand') {
      const { name, color: pieceColor } = selectedFrom;
      if (board[row][col] !== null) {
        setSelectedFrom(null);
        return;
      }

      if (mode === 'record') {
        commitMove(null, [row, col], name, pieceColor, false, true);
      } else if (mode === 'learn' && selectedJoseki) {
        const correctMove = selectedJoseki.moves[currentStep];
        const isDropCorrect = correctMove.from === null && correctMove.piece === name && correctMove.to[0] === row && correctMove.to[1] === col;

        if (isDropCorrect) {
          playSound('/sounds/koma.mp3');
          advanceStep(currentStep + 1, selectedJoseki);
        } else {
          setMessage(`違います。もう一度考えてみてください。`);
          setHasFailed(true);
        }
      }
      setSelectedFrom(null);

    } else if (selectedFrom?.type === 'board') {
      const { row: fromRow, col: fromCol } = selectedFrom;
      if (fromRow === row && fromCol === col) {
        setSelectedFrom(null);
        return;
      }

      const pieceToMove = board[fromRow][fromCol];
      if (!pieceToMove) return;

      if (mode === 'record') {
        const { canPromote, mustPromote } = checkCanPromote(pieceToMove.name, color, fromRow, row);
        if (canPromote) {
          if (mustPromote) {
            commitMove([fromRow, fromCol], [row, col], pieceToMove.name, color, true, false);
          } else {
            setPendingMove({ from: [fromRow, fromCol], to: [row, col], pieceName: pieceToMove.name, color, isDrop: false });
            setIsPromoteModalOpen(true);
          }
        } else {
          commitMove([fromRow, fromCol], [row, col], pieceToMove.name, color, false, false);
        }

      } else if (mode === 'learn' && selectedJoseki) {
        const correctMove = selectedJoseki.moves[currentStep];
        const isMoveCorrect = correctMove.from !== null && correctMove.from[0] === fromRow && correctMove.from[1] === fromCol && correctMove.to[0] === row && correctMove.to[1] === col;

        if (isMoveCorrect) {
          const { canPromote, mustPromote } = checkCanPromote(pieceToMove.name, color, fromRow, row);
          if (canPromote && !mustPromote) {
            setPendingQuizMove({ from: [fromRow, fromCol], to: [row, col], pieceName: pieceToMove.name, color, isDrop: false });
            setIsPromoteModalOpen(true);
          } else {
            const promote = mustPromote;
            const isPromoteCorrect = (correctMove.promote || false) === promote;
            if (isPromoteCorrect) {
              playSound('/sounds/koma.mp3');
              advanceStep(currentStep + 1, selectedJoseki);
            } else {
              setMessage("違います。成るか成らないかの選択が異なります。");
              setHasFailed(true);
            }
          }
        } else {
          setMessage(`違います。もう一度考えてみてください。`);
          setHasFailed(true);
        }
      }
      setSelectedFrom(null);

    } else {
      const piece = board[row][col];
      if (piece) {
        const isPieceColorCorrect = (isSenteTurn && piece.color === 'sente') || (!isSenteTurn && piece.color === 'gote');
        if (isPieceColorCorrect) {
          setSelectedFrom({ type: 'board', row, col });
        }
      }
    }
  };

  // クイズ時の成り決定処理
  const handleQuizPromoteDecision = (promote: boolean) => {
    if (!pendingQuizMove || !selectedJoseki) return;
    const correctMove = selectedJoseki.moves[currentStep];
    const isPromoteCorrect = (correctMove.promote || false) === promote;

    if (isPromoteCorrect) {
      playSound('/sounds/koma.mp3');
      advanceStep(currentStep + 1, selectedJoseki);
    } else {
      setMessage("違います。成るか成らないかの選択が異なります。");
      setHasFailed(true);
    }
    setIsPromoteModalOpen(false);
    setPendingQuizMove(null);
  };

  // 持ち駒クリック
  const handleHandClick = (name: string, color: 'sente' | 'gote') => {
    if (isThinking) return;
    if (mode === 'home') return;
    const isSenteTurn = mode === 'learn' ? (currentStep % 2 === 0) : (recordedMoves.length % 2 === 0);
    const isTurnCorrect = (isSenteTurn && color === 'sente') || (!isSenteTurn && color === 'gote');
    if (!isTurnCorrect) return;

    if (selectedFrom?.type === 'hand' && selectedFrom.name === name && selectedFrom.color === color) {
      setSelectedFrom(null);
    } else {
      setSelectedFrom({ type: 'hand', name: name as PieceType, color });
    }
  };

  // 1手戻す処理
  const handleUndo = () => {
    if (isThinking) return;
    if (mode === 'learn' && selectedJoseki) {
      if (currentStep === selectedJoseki.startStep) return;
      const prevStep = currentStep - 1;
      const state = getGameStateAtStep(selectedJoseki, prevStep);
      setBoard(state.board);
      setSenteHand(state.senteHand);
      setGoteHand(state.goteHand);
      setCurrentStep(prevStep);
      setSelectedFrom(null);
      syncCommentsToStep(prevStep, selectedJoseki);
      setMessage(`巻き戻しました。次の手を考えてみてください。`);

    } else if (mode === 'record') {
      if (recordedMoves.length === 0) return;
      const prevStep = recordedMoves.length - 1;
      const tempProblem: JosekiProblem = {
        id: 'temp', groupId: '', subGroupId: '', title: '', description: '', playerColor: 'sente', startStep: 0, moves: recordedMoves,
        srs: { stage: 0, interval: 0, nextReviewDate: null, lastReviewedAt: null }
      };
      const state = getGameStateAtStep(tempProblem, prevStep);
      setBoard(state.board);
      setSenteHand(state.senteHand);
      setGoteHand(state.goteHand);
      
      const prevMoves = recordedMoves.slice(0, prevStep);
      setRecordedMoves(prevMoves);
      setSelectedFrom(null);

      // 巻き戻したあとの最新手ハイライトを再同期
      if (prevMoves.length > 0) {
        const lastM = prevMoves[prevMoves.length - 1];
        setLastAppliedMove({ from: lastM.from, to: lastM.to });
      } else {
        setLastAppliedMove(null);
      }
    }
  };

  // 将棋盤面と持ち駒ストックを初期配置にリセット
  const resetToInitialBoard = () => {
    setBoard(createInitialBoard());
    setSenteHand(createEmptyHand());
    setGoteHand(createEmptyHand());
    setSelectedFrom(null);
    setLastAppliedMove(null);
  };

  // 学習開始 of 初期化
  const setupLearnMode = (problem: JosekiProblem) => {
    setIsThinking(false);
    setHasFailed(false);
    setUserComment(''); setUserNotation(''); setOpponentComment(''); setOpponentNotation('');
    setLastAppliedMove(null);

    const isAiTurnAtStart = 
      (problem.playerColor === 'gote' && problem.startStep % 2 === 0) ||
      (problem.playerColor === 'sente' && problem.startStep % 2 !== 0);

    if (isAiTurnAtStart) {
      const initialStep = problem.startStep;
      const state = getGameStateAtStep(problem, initialStep);
      setBoard(state.board);
      setSenteHand(state.senteHand);
      setGoteHand(state.goteHand);
      setSelectedFrom(null);
      setCurrentStep(initialStep);

      setIsThinking(true);
      setMessage("相手が考え中...");
      setOpponentComment("相手が考え中...");
      if (initialStep > 0) {
        const prevMove = problem.moves[initialStep - 1];
        setLastAppliedMove({ from: prevMove.from, to: prevMove.to });
      }
      
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
      
      // 【改修要件】タイマー間隔を1300ms（1.3秒）に変更
      autoPlayTimerRef.current = setTimeout(() => {
        playSound('/sounds/koma.mp3');
        advanceStep(initialStep + 1, problem);
      }, 1300);
    } else {
      const initialStep = problem.startStep;
      const state = getGameStateAtStep(problem, initialStep);
      setBoard(state.board);
      setSenteHand(state.senteHand);
      setGoteHand(state.goteHand);
      setSelectedFrom(null);
      setCurrentStep(initialStep);

      if (initialStep > 0) {
        const prevMove = problem.moves[initialStep - 1];
        setLastAppliedMove({ from: prevMove.from, to: prevMove.to });
      }

      if (initialStep >= problem.moves.length) {
        setMessage("🎉 定跡の全手順が完了しています！");
      } else {
        setMessage(`${initialStep + 1}手目: 正しい一手を考えて盤面を操作してください。`);
      }
    }
  };

  return {
    board,
    setBoard,
    senteHand,
    setSenteHand,
    goteHand,
    setGoteHand,
    selectedFrom,
    setSelectedFrom,
    currentStep,
    setCurrentStep,
    message,
    setMessage,
    hasFailed,
    setHasFailed,
    isThinking,
    setIsThinking,
    recordedMoves,
    setRecordedMoves,
    currentComment,
    setCurrentComment,
    newHint,
    setNewHint,
    startStep,
    setStartStep,
    isPromoteModalOpen,
    setIsPromoteModalOpen,
    pendingMove,
    setPendingMove,
    pendingQuizMove,
    setPendingQuizMove,
    userComment,
    opponentComment,
    userNotation,
    opponentNotation,
    handleSquareClick,
    handleHandClick,
    handleQuizPromoteDecision,
    handleUndo,
    setupLearnMode,
    getGameStateAtStep,
    commitMove,
    resetToInitialBoard,
    lastAppliedMove,
    getPreviousStepState // 継盤用の状態取得関数をエクスポート
  };
}