// 座標 [row, col] を将棋の符号のマス目（例: "7六"）に変換する関数
export const getSquareName = (row: number, col: number): string => {
  const cols = ["9", "8", "7", "6", "5", "4", "3", "2", "1"];
  const rows = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
  return cols[col] + rows[row];
};

// 座標から簡易的な将棋の符号（例: "▲7六歩"）を自動生成する関数
export const generateNotation = (
  from: [number, number] | null,
  to: [number, number],
  pieceName: string,
  isSente: boolean
): string => {
  const mark = isSente ? "▲" : "△";
  const toName = getSquareName(to[0], to[1]);
  
  if (from === null) {
    // 駒打ちの場合
    return `${mark}${toName}${pieceName}打`;
  }
  
  return `${mark}${toName}${pieceName}`;
};