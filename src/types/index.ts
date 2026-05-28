// src/types/index.ts

/**
 * 将棋定跡学習アプリ 共通型定義ファイル
 * すべてのコンポーネント、ロジックはこのデータ構造を基準に動作します。
 */

// 1. 駒の最小単位
export type Piece = {
  name: string;             // 駒の漢字名（例: "歩", "と", "龍"）
  color: 'sente' | 'gote';  // 先手（手前）または 後手（奥）
};

// 2. 将棋盤面（9x9の格子）の状態
export type BoardState = (Piece | null)[][];

// 3. 持ち駒（駒台）のストック枚数
export type Hand = { [key: string]: number };

// 4. 盤面で選択されているマスの状態（盤面か、持ち駒台か）
export type SelectedFrom =
  | { type: 'board'; row: number; col: number }
  | { type: 'hand'; name: string; color: 'sente' | 'gote' }
  | null;

// 5. 1手ごとの着手（移動・駒打ち）データ
export type Move = {
  notation: string;              // 符号テキスト（例: "▲7六歩"）
  from: [number, number] | null; // 移動元の位置 [行, 列]。駒打ちの場合は null
  to: [number, number];          // 移動先の位置 [行, 列]
  piece: string;                 // 動かす、または打つ駒の名前
  promote?: boolean;             // 成る場合は true
  comment?: string;              // この1手に対する解説コメント（巨大表示用）
  hint?: string;                 // この1手に対するスクラッチヒント用
};

// 6. 記憶システム (SRS) の学習進捗ステータス
export type SRSStatus = {
  stage: number;                  // 学習レベル（0: 未着手, 1〜7: 習得度レベル）
  interval: number;               // 復習のインターバル（日単位、例: 0日, 1日, 3日, 7日など）
  nextReviewDate: string | null;  // 次回の復習予定日時（ISO文字列、未着手はnull）
  lastReviewedAt: string | null;  // 最後に復習した日時（ISO文字列）
  hiddenFromReview?: boolean;     // 【新設要件】復習非表示フラグ
};

// 7. 孫：個別の定跡問題（クイズ）
export type JosekiProblem = {
  id: string;                    // 問題の一意なID
  groupId: string;               // 紐づく親：戦法グループ（JosekiGroup）のID
  subGroupId: string;            // 紐づく子：戦型グループ（SubGroup）のID
  title: string;                 // 定跡のタイトル（例: 「対エルモ急戦基本」）
  description: string;           // 定跡の説明文
  playerColor: 'sente' | 'gote'; // あなたの担当手番（先手/後手）
  startStep: number;             // 何手目からクイズを開始するか（デフォルトは 0 = 初手）
  moves: Move[];                 // 正解の手順（1手ずつの着手配列）
  srs: SRSStatus;                // この問題個別のSRS復習ステータス
  finalComment?: string;         // 定跡完了時の総括・まとめコメント (省略可)
};

// 8. 子：戦型・囲いなどのフォルダグループ
export type SubGroup = {
  id: string;                    // 子グループの一意なID
  groupId: string;               // 紐づく親グループ（JosekiGroup）のID
  name: string;                  // 戦型名（例: "急戦対策", "持久戦"）
  description: string;           // 簡単な説明
};

// 9. 親：戦法グループ
export type JosekiGroup = {
  id: string;                    // 親グループの一意なID（例: "shiken-bisya"）
  name: string;                  // 戦法名（例: "四間飛車"）
  description: string;           // 戦法全体の簡単な説明
};