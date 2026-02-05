'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FadeIn } from '@/components/web';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <FadeIn>
                <div className="text-center max-w-md mx-auto">
                    <div className="relative mb-6 inline-block">
                        <h1 className="text-9xl font-extrabold text-zinc-100 dark:text-zinc-900 select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold text-zinc-300 dark:text-zinc-700">
                                ¯\_(ツ)_/¯
                            </span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                        Page not found
                    </h2>

                    <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                        The page you are looking for does not exist or has been moved.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back to Home
                    </Link>
                </div>
            </FadeIn>
        </div>
    );
}
