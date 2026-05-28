// src/utils/srsEngine.ts

import { SRSStatus } from '../types/shogi';

// ステージごとの復習間隔（日単位）
// 0: 未着手、1: 1日後、2: 3日後、3: 7日後、4: 14日後、5: 30日後、6: 60日後、7: 120日後（マスター）
export const REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120];

export type AnkiSelection = 'again' | 'good'; // 'again' = 自信無し, 'good' = 自信あり

/**
 * 復習結果に基づいて、次のSRS学習ステータスを計算します（従来互換用）。
 */
export function calculateNextReview(currentSrs: SRSStatus, isPerfect: boolean): SRSStatus {
  const now = new Date();
  
  let nextStage = currentSrs.stage;

  if (isPerfect) {
    nextStage = Math.min(7, nextStage + 1);
  } else {
    nextStage = Math.max(0, nextStage - 1);
  }

  const nextInterval = REVIEW_INTERVALS[nextStage];

  const nextReviewDate = new Date();
  nextReviewDate.setDate(now.getDate() + nextInterval);

  return {
    stage: nextStage,
    interval: nextInterval,
    nextReviewDate: nextReviewDate.toISOString(),
    lastReviewedAt: now.toISOString()
  };
}

/**
 * 【改修要件】Anki風の2択（自信あり・自信無し）に基づいて、次の学習レベルと復習日時を算出します。
 * @param currentSrs 現在のSRSステータス
 * @param selection ユーザーが選択した難易度 ('again': 自信無し, 'good': 自信あり)
 */
export function calculateAnkiReview(currentSrs: SRSStatus, selection: AnkiSelection): SRSStatus {
  const now = new Date();
  let nextStage = currentSrs.stage;

  switch (selection) {
    case 'again':
      // 自信無し: レベルを1つ下げる（最低0）、復習日程は一律「1日後」にする
      nextStage = Math.max(0, nextStage - 1);
      break;

    case 'good':
      // 自信あり: レベルを1つ上げる（最大7）、復習日程は対応する日数後
      nextStage = Math.min(7, nextStage + 1);
      break;
  }

  const nextInterval = REVIEW_INTERVALS[nextStage];
  const nextReviewDate = new Date();

  if (selection === 'again') {
    // 自信無しは一律1日後
    nextReviewDate.setDate(now.getDate() + 1);
  } else {
    // 自信あり：1つ上がったステージに対応する日数後
    nextReviewDate.setDate(now.getDate() + nextInterval);
  }

  return {
    stage: nextStage,
    interval: selection === 'again' ? 1 : nextInterval,
    nextReviewDate: nextReviewDate.toISOString(),
    lastReviewedAt: now.toISOString()
  };
}