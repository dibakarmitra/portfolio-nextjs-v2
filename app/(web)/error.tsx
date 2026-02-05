'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { FadeIn } from '@/components/web';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <FadeIn>
                <div className="text-center max-w-md mx-auto">
                    <div className="relative mb-6 inline-block">
                        <h1 className="text-9xl font-extrabold text-zinc-100 dark:text-zinc-900 select-none">
                            500
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <AlertTriangle size={64} className="text-zinc-300 dark:text-zinc-700" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                        Something went wrong
                    </h2>

                    <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                        We encountered an unexpected error. Please try again later.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={reset}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-zinc-200 dark:shadow-zinc-900/50"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                        >
                            <ArrowLeft size={16} className="mr-2" /> Back to Home
                        </Link>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
