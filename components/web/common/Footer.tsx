'use client';

import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="max-w-3xl mx-auto px-6 mt-20 text-center text-xs text-zinc-500 dark:text-zinc-400 font-mono pb-8 print:hidden">
            <p>Crafted with Next.js, TypeScript & Tailwind CSS</p>
            <p className="mt-4">
                Built by{' '}
                <a
                    href="https://github.com/dibakarmitra"
                    className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                    Dibakar Mitra
                </a>
                . The source code is available on{' '}
                <a
                    href="https://github.com/dibakarmitra/portfolio-nextjs-v2"
                    className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
                .
            </p>
            <div className="flex justify-center gap-4 mt-2">
                <a
                    href="/feed/rss.xml"
                    className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    RSS
                </a>
                <span>•</span>
                <a
                    href="/feed/atom.xml"
                    className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Atom
                </a>
                <span>•</span>
                <a
                    href="/feed/feed.json"
                    className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    JSON
                </a>
            </div>
        </footer>
    );
};

export default Footer;
