import React from 'react';
import { SplashCursor, Footer } from '@/components/web';

export default function WebLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen">
            <SplashCursor />
            {/* Background Grid Pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-grid-pattern opacity-[0.4] dark:opacity-[0.03]"></div>
            <div className="relative z-10">
                {children}
                <Footer />
            </div>
        </div>
    );
}
