import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './button';


interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-background/50 backdrop-blur-xl border border-primary/20 rounded-lg p-8 max-w-2xl w-full">
            {/* Simple border decoration */}
            <div className="absolute inset-0 border-2 border-primary/20 rounded-lg"></div>
            <div className="absolute inset-4 border border-primary/10 rounded"></div>
            
            <div className="relative z-10 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4 text-red-400">⚠️</div>
                <h1 className="text-2xl font-bold text-red-400 mb-2">
                  System Error Detected
                </h1>
                <p className="text-sm opacity-70 mb-4">
                  An unexpected error has occurred in the command center
                </p>
              </div>

              <div className="bg-background/30 border border-red-500/20 rounded p-4 mb-6 text-left">
                <h3 className="text-sm font-bold text-red-400 mb-2">Error Details:</h3>
                <div className="text-xs font-mono opacity-80 break-all">
                  {this.state.error?.message || 'Unknown error occurred'}
                </div>
                {this.state.errorInfo && (
                  <details className="mt-3">
                    <summary className="text-xs text-primary cursor-pointer">
                      Stack Trace
                    </summary>
                    <pre className="text-xs opacity-60 mt-2 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={this.handleReset}
                  variant="default"
                  shape="default"
                >
                  Reset System
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="secondary"
                  shape="default"
                >
                  Reload Page
                </Button>
              </div>

              <div className="mt-6 text-xs opacity-50">
                Error ID: {Date.now().toString(36)}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 