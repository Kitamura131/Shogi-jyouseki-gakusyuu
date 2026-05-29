'use client';

import React, { ReactNode, Component, ErrorInfo } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // エラーをログ出力（本番環境ではSentryなどに送信）
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
          <div className="max-w-md bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-serif font-black text-gray-900 mb-3">
              予期しないエラーが発生しました
            </h1>
            <p className="text-gray-600 text-sm mb-4">
              {this.state.error.message || '原因不明のエラーが発生しました。'}
            </p>
            <details className="text-left bg-gray-100 rounded-lg p-3 mb-6 text-xs text-gray-700 max-h-32 overflow-auto">
              <summary className="cursor-pointer font-semibold">詳細を表示</summary>
              <pre className="mt-2 text-[11px] whitespace-pre-wrap break-words">
                {this.state.error.stack}
              </pre>
            </details>
            <button
              onClick={this.handleReset}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              アプリを再スタート
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full mt-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors"
            >
              ページをリロード
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
