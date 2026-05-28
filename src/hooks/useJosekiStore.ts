// src/hooks/useJosekiStore.ts

'use client'; // ブラウザのLocalStorageを扱うため、クライアント側で動作するようにします

import { useState, useEffect } from 'react';
import { JosekiProblem, JosekiGroup, SubGroup, SRSStatus } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { calculateNextReview, calculateAnkiReview, AnkiSelection } from '../utils/srsEngine';
import { initialJosekiProblems, initialTacticsGroups, initialTacticsSubGroups } from '../data/initialJoseki';

export function useJosekiStore() {
  // --- 1. アプリ全体で使用する「データベース」のState ---
  const [problems, setProblems] = useState<JosekiProblem[]>([]);
  const [josekiGroups, setJosekiGroups] = useState<JosekiGroup[]>([]);
  const [subGroups, setSubGroups] = useState<SubGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // ロード中かどうか

  // --- 2. 起動時のLocalStorage初期ロード ＆ 自動セットアップ ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedGroups = localStorage.getItem(STORAGE_KEYS.GROUPS);
        const storedSubGroups = localStorage.getItem(STORAGE_KEYS.SUB_GROUPS);
        const storedProblems = localStorage.getItem(STORAGE_KEYS.PROBLEMS);

        if (storedGroups && storedSubGroups && storedProblems) {
          // すでにデータがある場合は、保存されているデータをロード
          setJosekiGroups(JSON.parse(storedGroups));
          setSubGroups(JSON.parse(storedSubGroups));
          setProblems(JSON.parse(storedProblems));
        } else {
          // 初回起動時：静的な初期マスタデータを自動でLocalStorageにセットアップ
          localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(initialTacticsGroups));
          localStorage.setItem(STORAGE_KEYS.SUB_GROUPS, JSON.stringify(initialTacticsSubGroups));
          localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(initialJosekiProblems));
          
          setJosekiGroups(initialTacticsGroups);
          setSubGroups(initialTacticsSubGroups);
          setProblems(initialJosekiProblems);
        }
      } catch (err) {
        console.error("LocalStorageの読み込みに失敗しました:", err);
      } finally {
        setLoading(false); // ロード完了
      }
    }
  }, []);

  // --- 3. 定跡問題（孫・JosekiProblem）の追加 ＆ 編集（上書きマージ保存） ---
  const saveProblem = (
    editingId: string | null,
    groupId: string,
    subGroupId: string,
    title: string,
    description: string,
    playerColor: 'sente' | 'gote',
    startStep: number,
    moves: any[]
  ) => {
    // 新規定跡の基礎データ
    const baseProblem: Omit<JosekiProblem, 'srs'> = {
      id: editingId || `custom-${Date.now()}`,
      groupId,
      subGroupId,
      title,
      description: description || "自分で登録したオリジナル定跡です。",
      playerColor,
      startStep,
      moves,
    };

    let updatedProblems: JosekiProblem[] = [];

    if (editingId) {
      // 【編集上書き保存（マージ）】: 既存の「学習履歴(srs)」を破壊せずにそのまま引き継ぐ
      updatedProblems = problems.map((p) => {
        if (p.id === editingId) {
          return {
            ...baseProblem,
            srs: p.srs // 【重要】既存の学習レベルや復習スケジュールを死守
          };
        }
        return p;
      });
    } else {
      // 新規追加保存：未着手のSRS初期値（stage: 0）をセット
      const newProblem: JosekiProblem = {
        ...baseProblem,
        srs: { stage: 0, interval: 0, nextReviewDate: null, lastReviewedAt: null }
      };
      updatedProblems = [...problems, newProblem];
    }

    setProblems(updatedProblems);
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updatedProblems));
  };

  // 定跡問題（孫）の削除
  const deleteProblem = (problemId: string) => {
    const updated = problems.filter(p => p.id !== problemId);
    setProblems(updated);
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updated));
  };

  // --- 4. 親グループ（戦法・JosekiGroup）の追加 ＆ 編集 ---
  const saveGroup = (id: string | null, name: string) => {
    let updated: JosekiGroup[] = [];
    if (id) {
      // 編集上書き
      updated = josekiGroups.map(g => g.id === id ? { ...g, name } : g);
    } else {
      // 新規作成
      const newGroup: JosekiGroup = {
        id: `group-${Date.now()}`,
        name,
        description: "自分で追加した戦法グループです。"
      };
      updated = [...josekiGroups, newGroup];
    }
    setJosekiGroups(updated);
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(updated));
  };

  // 親グループの削除（所属する子戦型・孫定跡の【一斉カスケード連動削除】による安全設計）
  const deleteGroup = (groupId: string) => {
    const updatedGroups = josekiGroups.filter(g => g.id !== groupId);
    const updatedSubGroups = subGroups.filter(sg => sg.groupId !== groupId);
    const updatedProblems = problems.filter(p => p.groupId !== groupId);

    setJosekiGroups(updatedGroups);
    setSubGroups(updatedSubGroups);
    setProblems(updatedProblems);

    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(updatedGroups));
    localStorage.setItem(STORAGE_KEYS.SUB_GROUPS, JSON.stringify(updatedSubGroups));
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updatedProblems));
  };

  // --- 5. 子グループ（戦型・SubGroup）の追加 ＆ 編集 ---
  const saveSubGroup = (id: string | null, groupId: string, name: string) => {
    let updated: SubGroup[] = [];
    if (id) {
      // 編集上書き
      updated = subGroups.map(sg => sg.id === id ? { ...sg, name } : sg);
    } else {
      // 新規作成
      const newSub: SubGroup = {
        id: `sub-${Date.now()}`,
        groupId,
        name,
        description: "自分で追加した戦型です。"
      };
      updated = [...subGroups, newSub];
    }
    setSubGroups(updated);
    localStorage.setItem(STORAGE_KEYS.SUB_GROUPS, JSON.stringify(updated));
  };

  // 子グループの削除（所属する孫定跡の【一斉カスケード連動削除】による安全設計）
  const deleteSubGroup = (subGroupId: string) => {
    const updatedSubGroups = subGroups.filter(sg => sg.id !== subGroupId);
    const updatedProblems = problems.filter(p => p.subGroupId !== subGroupId);

    setSubGroups(updatedSubGroups);
    setProblems(updatedProblems);

    localStorage.setItem(STORAGE_KEYS.SUB_GROUPS, JSON.stringify(updatedSubGroups));
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updatedProblems));
  };

  // --- 6. 記憶システム (SRS) スケジュール手動アップデート（タイムトラベル用） ---
  const timeTravelReviewDates = () => {
    const updatedProblems = problems.map((prob) => {
      if (!prob.srs.nextReviewDate) return prob; // 未着手はスキップ

      const originalDate = new Date(prob.srs.nextReviewDate);
      originalDate.setDate(originalDate.getDate() - 1); // 24時間過去（1日前）に巻き戻す

      return {
        ...prob,
        srs: {
          ...prob.srs,
          nextReviewDate: originalDate.toISOString()
        }
      };
    });

    setProblems(updatedProblems);
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updatedProblems));
  };

  // --- 7. 学習完了時のSRS進捗アップデートロジック ---
  const updateProblemSrs = (problemId: string, isPerfect: boolean, selection?: AnkiSelection) => {
    let updatedSrsStatus: SRSStatus | null = null;

    const updatedProblems = problems.map((prob) => {
      if (prob.id === problemId) {
        // srsEngineのロジックを安全に実行
        const nextSrs = selection 
          ? calculateAnkiReview(prob.srs, selection) 
          : calculateNextReview(prob.srs, isPerfect);
          
        updatedSrsStatus = nextSrs;
        return { ...prob, srs: nextSrs };
      }
      return prob;
    });

    setProblems(updatedProblems);
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updatedProblems));

    return updatedSrsStatus; // 画面側（page.tsx）に更新結果を返して、お祝いメッセージに利用できるようにします
  };

  // 画面側（page.tsx）から呼び出せる変数や関数を公開します
  return {
    problems,
    setProblems, // ★【エラー解消】外部のpage.tsxからproblemsを自由に更新・セットできるようセッターをエクスポート追加しました
    josekiGroups,
    subGroups,
    loading,
    saveProblem,
    deleteProblem,
    saveGroup,
    deleteGroup,
    saveSubGroup,
    deleteSubGroup,
    timeTravelReviewDates,
    updateProblemSrs
  };
}