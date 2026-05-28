// 互換性のための再エクスポート — 正規の型定義は types/index.ts に統合されています
// 旧コードからの import { ... } from '../types/shogi' がそのまま動作するよう、エイリアス付きで公開します

export type { Move, SRSStatus, JosekiProblem, Piece, BoardState, Hand, SelectedFrom } from './index';

// 旧名称の型エイリアス（initialJoseki.ts, josekiData.ts 等で使用）
export type { JosekiGroup as TacticsGroup, SubGroup as TacticsSubGroup } from './index';