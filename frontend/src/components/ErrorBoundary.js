// frontend/src/components/ErrorBoundary.js
'use client';

import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('⚠️ [DynamicRenderer ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 shadow-xl space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <h3 className="font-semibold text-amber-100 text-sm sm:text-base">
              The generated wizard encountered an error.
            </h3>
          </div>
          <p className="text-xs text-amber-300/80 leading-relaxed">
            Your form data is completely safe and preserved. You can switch back to the standard form view or retry.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReset) this.props.onReset();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-medium transition cursor-pointer"
            >
              Switch to Standard View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
