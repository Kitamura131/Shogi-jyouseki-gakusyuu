// src/components/Learn/SubBoardModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Board, { BoardState, Hand, SelectedFrom } from '../Board';

interface SubBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBoard: BoardState;
  initialSenteHand: Hand;
  initialGoteHand: Hand;
  isFlipped: boolean;
}

export function SubBoardModal({
  isOpen,
  onClose,
  initialBoard,
  initialSenteHand,
  initialGoteHand,
  isFlipped,
}: SubBoardModalProps) {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [senteHand, setSenteHand] = useState<Hand>(initialSenteHand);
  const [goteHand, setGoteHand] = useState<Hand>(initialGoteHand);
  const [selectedFrom, setSelectedFrom] = useState<SelectedFrom>(null);
  const [boardWidth, setBoardWidth] = useState<number>(340); // 継盤スライダー初期幅

  // 指し手履歴を記録して「一手戻す」を実装するためのヒストリーState
  const [history, setHistory] = useState<{ board: BoardState; senteHand: Hand; goteHand: Hand }[]>([]);

  // 表示位置のプリセット調整用State
  const [positionPreset, setPositionPreset] = useState<'center' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'>('center');

  useEffect(() => {
    if (isOpen) {
      setBoard(JSON.parse(JSON.stringify(initialBoard)));
      setSenteHand({ ...initialSenteHand });
      setGoteHand({ ...initialGoteHand });
      setSelectedFrom(null);
      setHistory([]);
    }
  }, [isOpen, initialBoard, initialSenteHand, initialGoteHand]);

  if (!isOpen) return null;

  const saveToHistory = () => {
    setHistory([...history, {
      board: JSON.parse(JSON.stringify(board)),
      senteHand: { ...senteHand },
      goteHand: { ...goteHand }
    }]);
  };

  // 駒の成り・強制成りの判定
  const checkCanPromote = (pieceName: string, color: 'sente' | 'gote', fromRow: number, toRow: number) => {
    const promotable = ["歩", "香", "桂", "銀", "角", "飛"];
    if (!promotable.includes(pieceName)) return { canPromote: false, mustPromote: false };
    const isInEnemyZone = (r: number) => color === 'sente' ? r <= 2 : r >= 6;
    const touched = isInEnemyZone(fromRow) || isInEnemyZone(toRow);
    if (!touched) return { canPromote: false, mustPromote: false };
    let mustPromote = false;
    if (pieceName === "歩" || pieceName === "香") mustPromote = color === 'sente' ? toRow === 0 : toRow === 8;
    else if (pieceName === "桂") mustPromote = color === 'sente' ? toRow <= 1 : toRow >= 7;
    return { canPromote: true, mustPromote };
  };

  // 継盤上でのクリック・駒移動ロジック
  const handleSquareClick = (row: number, col: number) => {
    const color = board[row][col]?.color || 'sente';

    if (selectedFrom?.type === 'hand') {
      const { name, color: pieceColor } = selectedFrom;
      if (board[row][col] !== null) {
        setSelectedFrom(null);
        return;
      }
      saveToHistory();
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = { name, color: pieceColor };
      const hand = pieceColor === 'sente' ? senteHand : goteHand;
      const setHand = pieceColor === 'sente' ? setSenteHand : setGoteHand;
      setHand({ ...hand, [name]: Math.max(0, (hand[name] || 1) - 1) });
      setBoard(newBoard);
      setSelectedFrom(null);

    } else if (selectedFrom?.type === 'board') {
      const { row: fromRow, col: fromCol } = selectedFrom;
      if (fromRow === row && fromCol === col) {
        setSelectedFrom(null);
        return;
      }
      const piece = board[fromRow][fromCol];
      if (!piece) return;

      saveToHistory();
      const newBoard = board.map(r => [...r]);
      const targetPiece = newBoard[row][col];

      // 【バグ改修】成駒をとった時の元の駒への復元変換
      if (targetPiece) {
        const takerColor = piece.color;
        const takerHand = takerColor === 'sente' ? senteHand : goteHand;
        const setTakerHand = takerColor === 'sente' ? setSenteHand : setGoteHand;
        
        let baseName = targetPiece.name;
        if (baseName === "龍") baseName = "飛";
        else if (baseName === "馬") baseName = "角";
        else if (baseName === "と") baseName = "歩";
        else {
          baseName = baseName.replace("成", "");
        }
        setTakerHand({ ...takerHand, [baseName]: (takerHand[baseName] || 0) + 1 });
      }

      // 成り判定
      const { canPromote, mustPromote } = checkCanPromote(piece.name, piece.color, fromRow, row);
      let finalName = piece.name;
      if (canPromote) {
        if (mustPromote || window.confirm("駒を成りますか？")) {
          if (piece.name === "歩") finalName = "と";
          else if (piece.name === "飛") finalName = "龍";
          else if (piece.name === "角") finalName = "馬";
          else if (!piece.name.startsWith("成")) finalName = "成" + piece.name;
        }
      }

      newBoard[row][col] = { name: finalName, color: piece.color };
      newBoard[fromRow][fromCol] = null;
      setBoard(newBoard);
      setSelectedFrom(null);

    } else {
      const piece = board[row][col];
      if (piece) {
        setSelectedFrom({ type: 'board', row, col });
      }
    }
  };

  const handleHandClick = (name: string, color: 'sente' | 'gote') => {
    setSelectedFrom({ type: 'hand', name, color });
  };

  // 一手戻す
  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setBoard(prev.board);
    setSenteHand(prev.senteHand);
    setGoteHand(prev.goteHand);
    setHistory(history.slice(0, -1));
    setSelectedFrom(null);
  };

  // プリセットによる位置移動クラス決定
  const getPositionClass = () => {
    switch (positionPreset) {
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'top-right': return 'top-6 right-6';
      case 'bottom-right': return 'bottom-6 right-6';
      case 'top-left': return 'top-6 left-6';
      case 'bottom-left': return 'bottom-6 left-6';
    }
  };

  return (
    <div className={`fixed z-[9999] bg-[#FAF7F0] border-4 border-amber-800 rounded-3xl p-5 shadow-2xl transition-all duration-300 ${getPositionClass()}`}>
      <div className="flex flex-col gap-3 font-sans">
        
        {/* 継盤ヘッダーと位置調整コントローラー */}
        <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">👁️検討用継盤</span>
            <span className="text-[10px] text-amber-900/40 bg-amber-50 px-1.5 py-0.5 rounded">
              {history.length}手検討中
            </span>
          </div>
          
          {/* 位置ワーププリセットボタン */}
          <div className="flex items-center gap-1 bg-amber-900/5 p-1 rounded-xl">
            <span className="text-[9px] text-gray-500 font-bold px-1">配置:</span>
            <button onClick={() => setPositionPreset('top-left')} className={`px-1 text-[10px] rounded ${positionPreset === 'top-left' ? 'bg-amber-600 text-white' : 'hover:bg-amber-100'}`} title="左上に移動">↖</button>
            <button onClick={() => setPositionPreset('top-right')} className={`px-1 text-[10px] rounded ${positionPreset === 'top-right' ? 'bg-amber-600 text-white' : 'hover:bg-amber-100'}`} title="右上に移動">↗</button>
            <button onClick={() => setPositionPreset('center')} className={`px-1 text-[10px] rounded ${positionPreset === 'center' ? 'bg-amber-600 text-white' : 'hover:bg-amber-100'}`} title="中央に移動">✛</button>
            <button onClick={() => setPositionPreset('bottom-left')} className={`px-1 text-[10px] rounded ${positionPreset === 'bottom-left' ? 'bg-amber-600 text-white' : 'hover:bg-amber-100'}`} title="左下に移動">↙</button>
            <button onClick={() => setPositionPreset('bottom-right')} className={`px-1 text-[10px] rounded ${positionPreset === 'bottom-right' ? 'bg-amber-600 text-white' : 'hover:bg-amber-100'}`} title="右下に移動">↘</button>
          </div>
        </div>

        {/* 継盤用の将棋盤描画 (Boardを再利用) */}
        <div className="p-2 bg-white/20 rounded-2xl border border-amber-900/5">
          <Board
            board={board}
            senteHand={senteHand}
            goteHand={goteHand}
            selectedFrom={selectedFrom}
            onSquareClick={handleSquareClick}
            onHandClick={handleHandClick}
            boardWidth={boardWidth}
            isFlipped={isFlipped}
            lastAppliedMove={null} // 検討盤はハイライトなし
          />
        </div>

        {/* 継盤下のスライダー ＆ 操作ボタン */}
        <div className="space-y-3 pt-2">
          {/* サイズスライダー */}
          <div className="flex items-center gap-3 bg-white/80 border border-amber-900/5 px-3 py-1.5 rounded-xl shadow-sm">
            <span className="text-[9px] font-bold text-gray-400">継盤 小</span>
            <input
              type="range" min="250" max="480" step="10"
              value={boardWidth}
              onChange={(e) => setBoardWidth(Number(e.target.value))}
              className="flex-grow accent-amber-700 h-1 bg-gray-200 rounded-lg cursor-pointer"
            />
            <span className="text-[9px] font-bold text-gray-400">継盤 大</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="py-2 px-3 bg-[#111827] hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              ↩ 検討を1手戻す
            </button>
            <button
              onClick={onClose}
              className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              ❌ 検討を終了する（閉じる）
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}