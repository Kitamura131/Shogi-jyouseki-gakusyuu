// src/utils/boardEngine.ts
import { JosekiProblem, BoardState, PieceType } from '../types';

/**
 * 初期盤面を生成（駒の初期配置）
 */
export function createInitialBoard(): BoardState {
  const emptyRow = () => Array(9).fill(null);
  const board: BoardState = Array(9).fill(null).map(() => emptyRow());

  // 後手（gote）の初期配置
  const goteFirstRow: PieceType[] = ['香', '桂', '銀', '金', '玉', '金', '銀', '桂', '香'];
  for (let i = 0; i < 9; i++) {
    board[0][i] = { name: goteFirstRow[i], color: 'gote' };
  }
  board[1][1] = { name: '飛', color: 'gote' };
  board[1][7] = { name: '角', color: 'gote' };
  for (let i = 0; i < 9; i++) {
    board[2][i] = { name: '歩', color: 'gote' };
  }

  // 先手（sente）の初期配置
  for (let i = 0; i < 9; i++) {
    board[6][i] = { name: '歩', color: 'sente' };
  }
  board[7][1] = { name: '角', color: 'sente' };
  board[7][7] = { name: '飛', color: 'sente' };
  const senteFirstRow: PieceType[] = ['香', '桂', '銀', '金', '玉', '金', '銀', '桂', '香'];
  for (let i = 0; i < 9; i++) {
    board[8][i] = { name: senteFirstRow[i], color: 'sente' };
  }

  return board;
}

/**
 * 指定されたステップまでの局面を生成
 * @param problem 定跡問題
 * @param step 実行するステップ数（0からの手数）
 * @returns ボード状態と持ち駒
 */
export function getGameStateAtStep(problem: JosekiProblem, step: number): BoardState {
  const board = createInitialBoard();
  const targetStep = Math.min(step, problem.moves.length);

  for (let i = 0; i < targetStep; i++) {
    const move = problem.moves[i];
    if (!move) break;

    const playerColor = i % 2 === 0 ? 'sente' : 'gote';

    if (move.from === null) {
      // 駒打ち
      board[move.to[0]][move.to[1]] = { name: move.piece, color: playerColor };
    } else {
      // 通常の移動
      const [fromRow, fromCol] = move.from;
      const [toRow, toCol] = move.to;
      const movingPiece = board[fromRow][fromCol];

      if (!movingPiece) {
        console.warn(
          `Warning: Piece not found at (${fromRow}, ${fromCol}) for move ${move.notation}`
        );
        continue;
      }

      let finalName = movingPiece.name;
      if (move.promote) {
        finalName = getPiecePromotion(movingPiece.name);
      }

      board[toRow][toCol] = { name: finalName, color: movingPiece.color };
      board[fromRow][fromCol] = null;
    }
  }

  return board;
}

/**
 * 駒を成った場合の名前を返す
 */
function getPiecePromotion(pieceName: PieceType): PieceType {
  const promotionMap: Record<PieceType, PieceType> = {
    歩: 'と',
    香: '成香',
    桂: '成桂',
    銀: '成銀',
    金: '金',
    角: '馬',
    飛: '龍',
    玉: '玉',
    と: 'と',
    成香: '成香',
    成桂: '成桂',
    成銀: '成銀',
    龍: '龍',
    馬: '馬',
  };

  return promotionMap[pieceName] || pieceName;
}
