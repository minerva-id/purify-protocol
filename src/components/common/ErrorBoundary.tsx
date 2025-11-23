"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You can log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="text-red-400" size={32} />
              <h1 className="text-3xl font-bold text-red-400">Something went wrong</h1>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
              </p>

              {this.state.error && (
                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <p className="text-sm font-mono text-red-300 break-all">
                    {this.state.error.message || 'Unknown error'}
                  </p>
                  {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                    <details className="mt-4">
                      <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                        Stack Trace
                      </summary>
                      <pre className="text-xs text-gray-500 mt-2 overflow-auto max-h-64">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={this.handleReset}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <RefreshCw size={18} />
                <span>Try Again</span>
              </button>

              <Link
                href="/"
                className="flex items-center space-x-2 bg-transparent border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Home size={18} />
                <span>Go Home</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

