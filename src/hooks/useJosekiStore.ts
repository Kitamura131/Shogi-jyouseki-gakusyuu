// src/hooks/useJosekiStore.ts

'use client';

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
  const [loading, setLoading] = useState<boolean>(true);

  // --- 2. 起動時のLocalStorage初期ロード ＆ 自動セットアップ ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        let loadedGroups: JosekiGroup[] = initialTacticsGroups;
        let loadedSubGroups: SubGroup[] = initialTacticsSubGroups;
        let loadedProblems: JosekiProblem[] = initialJosekiProblems;
        let needsSave = false;

        try {
          const storedGroups = localStorage.getItem(STORAGE_KEYS.GROUPS);
          if (storedGroups) {
            loadedGroups = JSON.parse(storedGroups);
            if (!Array.isArray(loadedGroups)) throw new Error('Invalid groups format');
          } else {
            needsSave = true;
          }
        } catch (parseErr) {
          console.warn('Failed to parse stored groups, using defaults:', parseErr);
          loadedGroups = initialTacticsGroups;
          needsSave = true;
        }

        try {
          const storedSubGroups = localStorage.getItem(STORAGE_KEYS.SUB_GROUPS);
          if (storedSubGroups) {
            loadedSubGroups = JSON.parse(storedSubGroups);
            if (!Array.isArray(loadedSubGroups)) throw new Error('Invalid subGroups format');
          } else {
            needsSave = true;
          }
        } catch (parseErr) {
          console.warn('Failed to parse stored subGroups, using defaults:', parseErr);
          loadedSubGroups = initialTacticsSubGroups;
          needsSave = true;
        }

        try {
          const storedProblems = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
          if (storedProblems) {
            loadedProblems = JSON.parse(storedProblems);
            if (!Array.isArray(loadedProblems)) throw new Error('Invalid problems format');
          } else {
            needsSave = true;
          }
        } catch (parseErr) {
          console.warn('Failed to parse stored problems, using defaults:', parseErr);
          loadedProblems = initialJosekiProblems;
          needsSave = true;
        }

        if (needsSave) {
          try {
            localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(loadedGroups));
            localStorage.setItem(STORAGE_KEYS.SUB_GROUPS, JSON.stringify(loadedSubGroups));
            localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(loadedProblems));
          } catch (storageErr) {
            console.error('Failed to save data to localStorage:', storageErr);
          }
        }

        setJosekiGroups(loadedGroups);
        setSubGroups(loadedSubGroups);
        setProblems(loadedProblems);
      } catch (err) {
        console.error('Unexpected error during storage initialization:', err);
        setJosekiGroups(initialTacticsGroups);
        setSubGroups(initialTacticsSubGroups);
        setProblems(initialJosekiProblems);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  // --- 3. 定跡問題（孫・JosekiProblem）の追加 ＆ 編集 ---
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
      updatedProblems = problems.map((p) => {
        if (p.id === editingId) {
          return {
            ...baseProblem,
            srs: p.srs
          };
        }
        return p;
      });
    } else {
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

  // 定跡問題（孫）のコピー
  const copyProblem = (problemId: string) => {
    const originalProblem = problems.find(p => p.id === problemId);
    if (!originalProblem) {
      console.warn(`Problem with ID ${problemId} not found`);
      return;
    }

    const newProblem: JosekiProblem = {
      ...originalProblem,
      id: `custom-${Date.now()}`,
      title: `${originalProblem.title} (コピー)`,
      srs: { stage: 0, interval: 0, nextReviewDate: null, lastReviewedAt: null }
    };

    const updated = [...problems, newProblem];
    setProblems(updated);
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updated));
  };

  // --- 4. 親グループ（戦法・JosekiGroup）の追加 ＆ 編集 ---
  const saveGroup = (id: string | null, name: string) => {
    let updated: JosekiGroup[] = [];
    if (id) {
      updated = josekiGroups.map(g => g.id === id ? { ...g, name } : g);
    } else {
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

  // 親グループの削除（カスケード連動削除）
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
      updated = subGroups.map(sg => sg.id === id ? { ...sg, name } : sg);
    } else {
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

  // 子グループの削除（カスケード連動削除）
  const deleteSubGroup = (subGroupId: string) => {
    const updatedSubGroups = subGroups.filter(sg => sg.id !== subGroupId);
    const updatedProblems = problems.filter(p => p.subGroupId !== subGroupId);

    setSubGroups(updatedSubGroups);
    setProblems(updatedProblems);

    localStorage.setItem(STORAGE_KEYS.SUB_GROUPS, JSON.stringify(updatedSubGroups));
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updatedProblems));
  };

  // --- 【新設】親グループ（戦法・JosekiGroup）の順序変更ロジック ---
  const moveGroupOrder = (groupId: string, direction: 'up' | 'down') => {
    const index = josekiGroups.findIndex(g => g.id === groupId);
    if (index === -1) return;

    let swapWithIndex = -1;
    if (direction === 'up' && index > 0) {
      swapWithIndex = index - 1;
    } else if (direction === 'down' && index < josekiGroups.length - 1) {
      swapWithIndex = index + 1;
    }

    if (swapWithIndex !== -1) {
      const updated = [...josekiGroups];
      const temp = updated[index];
      updated[index] = updated[swapWithIndex];
      updated[swapWithIndex] = temp;

      setJosekiGroups(updated);
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(updated));
    }
  };

  // --- 子グループ（戦型・SubGroup）の順序変更ロジック（同一戦法内のみ） ---
  const moveSubGroupOrder = (subGroupId: string, direction: 'up' | 'down') => {
    const index = subGroups.findIndex(sg => sg.id === subGroupId);
    if (index === -1) return;

    const targetSubGroup = subGroups[index];
    const parentGroupId = targetSubGroup.groupId;

    const siblingIndices = subGroups
      .map((sg, i) => sg.groupId === parentGroupId ? i : -1)
      .filter(i => i !== -1);

    const siblingPos = siblingIndices.indexOf(index);
    if (siblingPos === -1) return;

    let swapWithSiblingPos = -1;
    if (direction === 'up' && siblingPos > 0) {
      swapWithSiblingPos = siblingPos - 1;
    } else if (direction === 'down' && siblingPos < siblingIndices.length - 1) {
      swapWithSiblingPos = siblingPos + 1;
    }

    if (swapWithSiblingPos !== -1) {
      const swapIndex = siblingIndices[swapWithSiblingPos];
      const updated = [...subGroups];
      
      const temp = updated[index];
      updated[index] = updated[swapIndex];
      updated[swapIndex] = temp;

      setSubGroups(updated);
      localStorage.setItem(STORAGE_KEYS.SUB_GROUPS, JSON.stringify(updated));
    }
  };

  // --- 孫グループ（定跡問題・JosekiProblem）の順序変更ロジック（同一戦型内のみ） ---
  const moveProblemOrder = (problemId: string, direction: 'up' | 'down') => {
    const index = problems.findIndex(p => p.id === problemId);
    if (index === -1) return;

    const targetProblem = problems[index];
    const parentSubGroupId = targetProblem.subGroupId;

    const siblingIndices = problems
      .map((p, i) => p.subGroupId === parentSubGroupId ? i : -1)
      .filter(i => i !== -1);

    const siblingPos = siblingIndices.indexOf(index);
    if (siblingPos === -1) return;

    let swapWithSiblingPos = -1;
    if (direction === 'up' && siblingPos > 0) {
      swapWithSiblingPos = siblingPos - 1;
    } else if (direction === 'down' && siblingPos < siblingIndices.length - 1) {
      swapWithSiblingPos = siblingPos + 1;
    }

    if (swapWithSiblingPos !== -1) {
      const swapIndex = siblingIndices[swapWithSiblingPos];
      const updated = [...problems];
      
      const temp = updated[index];
      updated[index] = updated[swapIndex];
      updated[swapIndex] = temp;

      setProblems(updated);
      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updated));
    }
  };

  // --- 6. 記憶システム (SRS) スケジュール手動アップデート（タイムトラベル用） ---
  const timeTravelReviewDates = () => {
    const updatedProblems = problems.map((prob) => {
      if (!prob.srs.nextReviewDate) return prob;

      const originalDate = new Date(prob.srs.nextReviewDate);
      originalDate.setDate(originalDate.getDate() - 1);

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

    return updatedSrsStatus;
  };

  return {
    problems,
    setProblems,
    josekiGroups,
    subGroups,
    loading,
    saveProblem,
    deleteProblem,
    copyProblem,
    saveGroup,
    deleteGroup,
    saveSubGroup,
    deleteSubGroup,
    moveGroupOrder,    // 親階層並び替えを公開
    moveSubGroupOrder, // 子階層並び替えを公開
    moveProblemOrder,  // 孫階層並び替えを公開
    timeTravelReviewDates,
    updateProblemSrs
  };
}