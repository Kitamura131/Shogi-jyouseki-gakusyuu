// src/hooks/useAppState.ts
import { useReducer } from 'react';
import { JosekiProblem } from '../types/shogi';
import { BOARD_SIZE } from '../utils/constants';

/**
 * アプリ全体の状態を管理するカスタムフック
 * 20+ の useState を一つの useReducer に統合し、状態の関係性を明確にする
 */

export type AppMode = 'home' | 'learn' | 'record';
export type ClearStep = 'not_cleared' | 'anki_select' | 'action_select';

export type AppState = {
  // モード管理
  mode: AppMode;
  isAdmin: boolean;

  // 定跡選択
  selectedJoseki: JosekiProblem | null;
  previewJoseki: JosekiProblem | null;

  // UI状態
  boardWidth: number;
  isSettingOpen: boolean;
  isHintRevealed: boolean;
  isSubBoardOpen: boolean;
  isExportOpen: boolean;
  exportText: string;

  // クリア状態管理
  clearStep: ClearStep;

  // レコーダー状態
  editingProblemId: string | null;
  selectedGroupId: string;
  selectedSubGroupId: string;
  newTitle: string;
  newDescription: string;
  newFinalComment: string;
  recorderPlayerColor: 'sente' | 'gote';
};

export type AppAction =
  | { type: 'SET_MODE'; payload: AppMode }
  | { type: 'SET_SELECTED_JOSEKI'; payload: JosekiProblem | null }
  | { type: 'SET_PREVIEW_JOSEKI'; payload: JosekiProblem | null }
  | { type: 'SET_BOARD_WIDTH'; payload: number }
  | { type: 'SET_SETTING_OPEN'; payload: boolean }
  | { type: 'SET_HINT_REVEALED'; payload: boolean }
  | { type: 'SET_SUB_BOARD_OPEN'; payload: boolean }
  | { type: 'SET_EXPORT_OPEN'; payload: boolean }
  | { type: 'SET_EXPORT_TEXT'; payload: string }
  | { type: 'SET_CLEAR_STEP'; payload: ClearStep }
  | { type: 'SET_EDITING_PROBLEM_ID'; payload: string | null }
  | { type: 'SET_SELECTED_GROUP_ID'; payload: string }
  | { type: 'SET_SELECTED_SUB_GROUP_ID'; payload: string }
  | { type: 'SET_NEW_TITLE'; payload: string }
  | { type: 'SET_NEW_DESCRIPTION'; payload: string }
  | { type: 'SET_NEW_FINAL_COMMENT'; payload: string }
  | { type: 'SET_RECORDER_PLAYER_COLOR'; payload: 'sente' | 'gote' }
  | { type: 'RESET_RECORDING_FORM' }
  | { type: 'RESET_TO_HOME' };

const initialState: AppState = {
  mode: 'home',
  isAdmin: false,
  selectedJoseki: null,
  previewJoseki: null,
  boardWidth: BOARD_SIZE.DEFAULT,
  isSettingOpen: false,
  isHintRevealed: false,
  isSubBoardOpen: false,
  isExportOpen: false,
  exportText: '',
  clearStep: 'not_cleared',
  editingProblemId: null,
  selectedGroupId: '',
  selectedSubGroupId: '',
  newTitle: '',
  newDescription: '',
  newFinalComment: '',
  recorderPlayerColor: 'sente',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };

    case 'SET_SELECTED_JOSEKI':
      return { ...state, selectedJoseki: action.payload };

    case 'SET_PREVIEW_JOSEKI':
      return { ...state, previewJoseki: action.payload };

    case 'SET_BOARD_WIDTH':
      return { ...state, boardWidth: action.payload };

    case 'SET_SETTING_OPEN':
      return { ...state, isSettingOpen: action.payload };

    case 'SET_HINT_REVEALED':
      return { ...state, isHintRevealed: action.payload };

    case 'SET_SUB_BOARD_OPEN':
      return { ...state, isSubBoardOpen: action.payload };

    case 'SET_EXPORT_OPEN':
      return { ...state, isExportOpen: action.payload };

    case 'SET_EXPORT_TEXT':
      return { ...state, exportText: action.payload };

    case 'SET_CLEAR_STEP':
      return { ...state, clearStep: action.payload };

    case 'SET_EDITING_PROBLEM_ID':
      return { ...state, editingProblemId: action.payload };

    case 'SET_SELECTED_GROUP_ID':
      return { ...state, selectedGroupId: action.payload };

    case 'SET_SELECTED_SUB_GROUP_ID':
      return { ...state, selectedSubGroupId: action.payload };

    case 'SET_NEW_TITLE':
      return { ...state, newTitle: action.payload };

    case 'SET_NEW_DESCRIPTION':
      return { ...state, newDescription: action.payload };

    case 'SET_NEW_FINAL_COMMENT':
      return { ...state, newFinalComment: action.payload };

    case 'SET_RECORDER_PLAYER_COLOR':
      return { ...state, recorderPlayerColor: action.payload };

    case 'RESET_RECORDING_FORM':
      return {
        ...state,
        editingProblemId: null,
        selectedGroupId: '',
        selectedSubGroupId: '',
        newTitle: '',
        newDescription: '',
        newFinalComment: '',
        recorderPlayerColor: 'sente',
      };

    case 'RESET_TO_HOME':
      return {
        ...state,
        mode: 'home',
        selectedJoseki: null,
        previewJoseki: null,
        isSettingOpen: false,
        isHintRevealed: false,
        isSubBoardOpen: false,
        clearStep: 'not_cleared',
      };

    default:
      return state;
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return { state, dispatch };
}
