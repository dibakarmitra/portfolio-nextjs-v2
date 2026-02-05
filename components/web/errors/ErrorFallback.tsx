'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorFallbackProps {
    error?: Error;
    reset?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset }) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <div className="mb-4 inline-block p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>

                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    Oops! Something went wrong
                </h1>

                <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                    We encountered an unexpected error. Please try again or contact support if the
                    problem persists.
                </p>

                {error && process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded text-left">
                        <p className="text-xs text-red-800 dark:text-red-200 font-mono break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    {reset && (
                        <button
                            onClick={reset}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Try Again
                        </button>
                    )}

                    <a
                        href="/"
                        className="flex-1 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium transition-colors"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ErrorFallback;
