"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="text-center py-12 space-y-2">
          <p className="font-heading text-sm text-ink-muted">Something went wrong</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="brut-btn text-xs"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
