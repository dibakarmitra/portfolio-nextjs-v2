import { PROFILE } from '@/config/constants';

export default function Loading() {
    const initials = PROFILE.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-50 dark:bg-[#0a0a0a]">
            <div className="relative flex items-center justify-center mb-4">
                <div className="absolute w-16 h-16 border-4 border-zinc-200 dark:border-zinc-800 rounded-full"></div>

                <div className="absolute w-16 h-16 border-4 border-t-blue-600 dark:border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>

                <div className="font-mono font-bold text-xl text-zinc-900 dark:text-zinc-100 animate-pulse tracking-widest">
                    {initials}
                </div>
            </div>

            <p className="text-xs font-mono text-zinc-400 dark:text-zinc-600 tracking-wider uppercase animate-pulse">
                Loading
            </p>
        </div>
    );
}
