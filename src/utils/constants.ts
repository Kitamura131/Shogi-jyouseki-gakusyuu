/**
 * アプリケーション共通定数ファイル
 * ハードコーディング（マジックナンバー）を一元管理し、仕様変更を一瞬で行えるようにします。
 */

// 1. LocalStorageのキー名（データベース住所の一元管理）
export const STORAGE_KEYS = {
  PROBLEMS: 'shogi_joseki_problems_v3',       // 登録されている全定跡データの保存キー
  GROUPS: 'shogi_tactics_groups_v3',          // ユーザー定義の親戦法グループの保存キー
  SUB_GROUPS: 'shogi_tactics_sub_groups_v3',  // ユーザー定義の子戦型フォルダの保存キー
  BOARD_WIDTH: 'shogi_board_width',           // 盤面サイズ記憶用の保存キー
} as const;

// 2. 将棋盤サイズ調整用リミッター
export const BOARD_SIZE = {
  DEFAULT: 450, // 最初の盤面の初期サイズ(px)
  MIN: 320,     // 可変スライダーの最小値(px)
  MAX: 800,     // 可変スライダーの最大値(px)
  STEP: 10,     // スライダーの目盛りのきざみ幅(px)
} as const;

// 3. 入力フォームのバリデーション制限値
export const VALIDATION_LIMITS = {
  TITLE_MAX: 50,       // 定跡タイトルの最大文字数
  DESCRIPTION_MAX: 200, // 説明文・解説の最大文字数
  COMMENT_MAX: 150,     // 1手ごとのコメントの最大文字数
} as const;

// 4. 記憶システム (SRS) の復習スケジュール設計（日単位）
// stageが上がるごとに、この配列のインデックスに対応した日数が自動でセットされます
// 0: 未着手, 1: 1日後, 2: 3日後, 3: 7日後, 4: 14日後, 5: 30日後, 6: 60日後, 7: 120日後（マスター）
export const SRS_INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120] as const;