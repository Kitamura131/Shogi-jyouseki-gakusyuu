'use client';

import React from 'react';

type Piece = {
  name: string;
  color: 'sente' | 'gote';
};

export type BoardState = (Piece | null)[][];
export type Hand = { [key: string]: number };
export type SelectedFrom =
  | { type: 'board'; row: number; col: number }
  | { type: 'hand'; name: string; color: 'sente' | 'gote' }
  | null;

type BoardProps = {
  board: BoardState;
  senteHand: Hand;
  goteHand: Hand;
  selectedFrom: SelectedFrom;
  onSquareClick: (row: number, col: number) => void;
  onHandClick: (name: string, color: 'sente' | 'gote') => void;
  boardWidth: number;
  isFlipped?: boolean; // 盤面を180度反転させるフラグ
  lastAppliedMove?: { from: [number, number] | null; to: [number, number] } | null;
};

const pieceImageMap: { [key: string]: string } = {
  "歩": "hu", "と": "to", "香": "kyou", "成香": "narikyou",
  "桂": "kei", "成桂": "narikei", "銀": "gin", "成銀": "narigin",
  "金": "kin", "角": "kaku", "馬": "uma", "飛": "hi", "龍": "ryu",
  "王": "gyoku", "玉": "gyoku"
};

export default function Board({
  board,
  senteHand,
  goteHand,
  selectedFrom,
  onSquareClick,
  onHandClick,
  boardWidth,
  isFlipped = false,
  lastAppliedMove
}: BoardProps) {
  const colsNormal = ["9", "8", "7", "6", "5", "4", "3", "2", "1"];
  const colsFlipped = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const cols = isFlipped ? colsFlipped : colsNormal;

  const rowsNormal = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const rowsFlipped = ["九", "八", "七", "六", "五", "四", "三", "二", "一"];
  const rows = isFlipped ? rowsFlipped : rowsNormal;

  const starPositions = [[2, 2], [2, 6], [6, 2], [6, 6]];
  const handPieceTypes = ["飛", "角", "金", "銀", "桂", "香", "歩"];

  // 【プロ比例設計】盤面サイズに基づいて、美しくバランスの取れた駒台スケールを算出
  const handWidth = boardWidth * 0.17;       // 2列対応の幅
  const handPieceSize = boardWidth * 0.09;   // 2列用の駒サイズ
  const handHeight = boardWidth * 0.88;      // 盤面の88%の高さに制限（間延び防止）

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-center select-none w-full">
      
      {/* A. 上側の駒台 (PC時：2列グリッドでコンパクトに上詰め、スマホ時：横1列) */}
      <div 
        className="w-full md:w-auto flex justify-around md:justify-start gap-1 p-2.5 bg-[#FAF7F0] border border-amber-900/10 rounded-2xl shadow-sm transition-all duration-150 md:grid md:grid-cols-2 md:content-start max-md:!h-auto"
        style={{ 
          width: `clamp(85px, ${handWidth}px, 140px)`,
          height: `${handHeight}px` // PC表示時の高さを適用
        }}
      >
        <div className="text-[9px] font-bold text-gray-400 md:text-center select-none col-span-2 mb-1 hidden md:block">
          {isFlipped ? "先手台(奥)" : "後手台(奥)"}
        </div>
        {handPieceTypes.map((name) => {
          const targetColor = isFlipped ? 'sente' : 'gote';
          const hand = isFlipped ? senteHand : goteHand;
          const count = hand[name] || 0;
          const isSelected = selectedFrom?.type === 'hand' && selectedFrom.name === name && selectedFrom.color === targetColor;
          const imgName = pieceImageMap[name];

          return (
            <div
              key={name}
              onClick={() => count > 0 && onHandClick(name, targetColor)}
              className={`
                flex md:flex-col items-center justify-center p-1.5 rounded-xl cursor-pointer transition-all duration-150 border
                ${count === 0 ? 'opacity-20 pointer-events-none' : ''}
                ${isSelected ? 'bg-amber-200 border-amber-500 shadow-md scale-105' : 'bg-white hover:bg-amber-50 border-gray-100'}
              `}
              style={{ minWidth: '34px' }}
            >
              <img 
                src={`/pieces/${imgName}.png`}
                alt={name}
                className="aspect-square object-contain rotate-180"
                style={{ width: `${handPieceSize}px`, height: `${handPieceSize}px` }}
              />
              <span className="text-[10px] mt-0.5 md:ml-0 text-gray-400 font-sans font-bold">×{count}</span>
            </div>
          );
        })}
      </div>

      {/* B. 将棋盤エリア */}
      <div 
        className="relative aspect-square pt-6 pr-6 pl-2 pb-2 transition-all duration-150 flex-shrink-0"
        style={{ 
          width: `${boardWidth}px`, 
          height: `${boardWidth}px`,
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vw - 32px)' 
        }}
      >
        {/* 横軸目盛り */}
        <div className="absolute top-0 left-2 right-6 h-6 flex justify-between items-center text-[11px] font-bold text-amber-900/60 font-sans">
          {cols.map((num, i) => (
            <div key={i} className="w-[11.11%] text-center">{num}</div>
          ))}
        </div>

        {/* 縦軸目盛り */}
        <div className="absolute top-6 bottom-2 right-0 w-6 flex flex-col justify-between items-center text-[10px] font-bold text-amber-900/60 font-sans">
          {rows.map((kanji, i) => (
            <div key={i} className="h-[11.11%] flex items-center justify-center">{kanji}</div>
          ))}
        </div>

        {/* 将棋盤本体 */}
        <div className="w-full h-full bg-[#E5C799] p-1 border-2 border-[#B08A4F]/40 rounded-lg shadow-md grid grid-cols-9 gap-[1px] relative overflow-hidden">
          {Array(9).fill(null).map((_, y) => {
            const rowIndex = isFlipped ? 8 - y : y;

            return Array(9).fill(null).map((_, x) => {
              const colIndex = isFlipped ? 8 - x : x;
              const piece = board[rowIndex][colIndex];

              const isSelected =
                selectedFrom?.type === 'board' &&
                selectedFrom.row === rowIndex &&
                selectedFrom.col === colIndex;

              // ★ 最後に動いた駒の「移動元(from)」と「移動先(to)」の判定
              const isLastFrom = lastAppliedMove?.from && lastAppliedMove.from[0] === rowIndex && lastAppliedMove.from[1] === colIndex;
              const isLastTo = lastAppliedMove?.to && lastAppliedMove.to[0] === rowIndex && lastAppliedMove.to[1] === colIndex;

              const isStar = starPositions.some(([r, c]) => r === rowIndex && c === colIndex);

              // マスの背景色・枠線を決定するロジック（選択状態 > 移動先 > 移動元 > 通常）
              let squareBgClass = isSelected ? 'bg-amber-200/90' : 'bg-[#EBC791] hover:bg-[#F3D6A8]';
              if (!isSelected) {
                if (isLastTo) {
                  squareBgClass = "bg-emerald-300/40 border-2 border-emerald-500/50";
                } else if (isLastFrom) {
                  squareBgClass = "bg-amber-500/20";
                }
              }

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                  className={`
                    aspect-square flex items-center justify-center cursor-pointer relative transition-all duration-150 ${squareBgClass}
                    border-[0.5px] border-[#B08A4F]/20
                  `}
                >
                  {isStar && <div className="absolute w-1.5 h-1.5 bg-[#B08A4F]/50 rounded-full" />}

                  {piece && (
                    <img
                      src={`/pieces/${pieceImageMap[piece.name]}.png`}
                      alt={piece.name}
                      className={`
                        w-[90%] h-[90%] object-contain transition-transform duration-100
                        ${isFlipped
                            ? (piece.color === 'sente' ? 'rotate-180' : '')
                            : (piece.color === 'gote' ? 'rotate-180' : '')
                        }
                      `}
                    />
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>

      {/* C. 下側の駒台 (PC時：2列グリッドでコンパクトに上詰め、スマホ時：横1列) */}
      <div 
        className="w-full md:w-auto flex justify-around md:justify-start gap-1 p-2.5 bg-[#FAF7F0] border border-amber-900/10 rounded-2xl shadow-sm transition-all duration-150 md:grid md:grid-cols-2 md:content-start max-md:!h-auto"
        style={{ 
          width: `clamp(85px, ${handWidth}px, 140px)`,
          height: `${handHeight}px`
        }}
      >
        <div className="text-[9px] font-bold text-gray-400 md:text-center select-none col-span-2 mb-1 hidden md:block">
          {isFlipped ? "後手台(手前)" : "先手台(手前)"}
        </div>
        {handPieceTypes.map((name) => {
          const targetColor = isFlipped ? 'gote' : 'sente';
          const hand = isFlipped ? goteHand : senteHand;
          const count = hand[name] || 0;
          const isSelected = selectedFrom?.type === 'hand' && selectedFrom.name === name && selectedFrom.color === targetColor;
          const imgName = pieceImageMap[name];

          return (
            <div
              key={name}
              onClick={() => count > 0 && onHandClick(name, targetColor)}
              className={`
                flex md:flex-col items-center justify-center p-1.5 rounded-xl cursor-pointer transition-all duration-150 border
                ${count === 0 ? 'opacity-20 pointer-events-none' : ''}
                ${isSelected ? 'bg-amber-200 border-amber-500 shadow-md scale-105' : 'bg-white hover:bg-amber-50 border-gray-100'}
              `}
              style={{ minWidth: '34px' }}
            >
              <img 
                src={`/pieces/${imgName}.png`}
                alt={name}
                className="aspect-square object-contain"
                style={{ width: `${handPieceSize}px`, height: `${handPieceSize}px` }}
              />
              <span className="text-[10px] ml-1 md:ml-0 text-gray-400 font-sans font-bold">×{count}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}