'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    LogOut,
    Terminal,
    GraduationCap,
    Cpu,
    FolderGit2,
    Image,
    Award,
    BadgeCheck,
    MessageSquare,
    MessageSquareQuote,
    BookOpen,
    Star,
    Languages,
    Zap,
    Cylinder, // For database/categories
    Tag, // For tags
    Sun,
    Moon,
    User,
    UserCheck,
    Settings,
} from 'lucide-react';
import { logoutAction } from '@/app/admin/actions/logout';
import { useContextState } from '@/context';
import { useAppSettings } from '@/hooks/useAppSettings';
// import { SiteInfo } from '@/components/admin/common/SiteInfo';

export const Sidebar: React.FC<{ isMobileOpen?: boolean }> = ({ isMobileOpen = false }) => {
    const { isDarkMode, setIsDarkMode, userProfile, setIsAuthenticated } = useContextState();
    const { site } = useAppSettings();
    const pathname = usePathname();
    const router = useRouter();

    const menuGroups = [
        {
            label: 'Overview',
            items: [
                {
                    id: 'dashboard',
                    label: 'Dashboard',
                    icon: LayoutDashboard,
                    href: '/admin/dashboard',
                },
            ],
        },
        {
            label: 'Resume',
            items: [
                {
                    id: 'experience',
                    label: 'Experience',
                    icon: Briefcase,
                    href: '/admin/experience',
                },
                { id: 'projects', label: 'Projects', icon: FolderGit2, href: '/admin/projects' },
                {
                    id: 'education',
                    label: 'Education',
                    icon: GraduationCap,
                    href: '/admin/education',
                },
                { id: 'skills', label: 'Skills', icon: Cpu, href: '/admin/skills' },
                { id: 'languages', label: 'Languages', icon: Languages, href: '/admin/languages' },
                { id: 'strengths', label: 'Strengths', icon: Zap, href: '/admin/strengths' },
                {
                    id: 'certifications',
                    label: 'Certifications',
                    icon: BadgeCheck,
                    href: '/admin/certifications',
                },
                { id: 'awards', label: 'Awards', icon: Award, href: '/admin/awards' },
                {
                    id: 'testimonials',
                    label: 'Testimonials',
                    icon: MessageSquareQuote,
                    href: '/admin/testimonials',
                },
            ],
        },
        {
            label: 'Content',
            items: [
                { id: 'notes', label: 'Notes / Blog', icon: FileText, href: '/admin/notes' },
                {
                    id: 'categories',
                    label: 'Categories',
                    icon: Cylinder,
                    href: '/admin/categories',
                },
                { id: 'tags', label: 'Tags', icon: Tag, href: '/admin/tags' },
                { id: 'contacts', label: 'Contacts', icon: MessageSquare, href: '/admin/contacts' },
                { id: 'media', label: 'Media', icon: Image, href: '/admin/media' },
            ],
        },
        {
            label: 'System',
            items: [
                { id: 'profile', label: 'Profile', icon: User, href: '/admin/profile' },
                { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
                { id: 'logs', label: 'Logs', icon: Terminal, href: '/admin/logs' },
            ],
        },
    ];

    const onSignOut = async () => {
        setIsAuthenticated(false);
        await logoutAction();
    };

    // const toggleTheme = () => {
    //   setIsDarkMode(!isDarkMode);
    //   if (!isDarkMode) {
    //     document.documentElement.classList.add('dark');
    //     localStorage.theme = 'dark';
    //   } else {
    //     document.documentElement.classList.remove('dark');
    //     localStorage.theme = 'light';
    //   }
    // };

    const { theme, systemTheme, setTheme } = useTheme();
    const toggleTheme = () => {
        const current = theme === 'system' ? systemTheme : theme;

        setTheme(current === 'dark' ? 'light' : 'dark');
    };

    const getInitials = (name: string) => {
        if (!name) return '';
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <aside
            className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-colors duration-200 ${isMobileOpen ? 'block' : 'hidden'} lg:block`}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center mr-3 text-white overflow-hidden shrink-0">
                            {userProfile.avatarUrl && userProfile.avatarUrl.startsWith('http') ? (
                                <img
                                    src={userProfile.avatarUrl}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="font-bold text-xs">
                                    {getInitials(userProfile.displayName)}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white truncate">
                                {userProfile.displayName}
                            </span>
                            <span className="text-[10px] text-zinc-500 truncate">{site.name}</span>
                        </div>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                    {menuGroups.map((group, groupIndex) => (
                        <div key={group.label} className={groupIndex > 0 ? 'mt-8' : ''}>
                            <div className="mb-2 px-2 text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">
                                {group.label}
                            </div>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            className={`
                        w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                        ${
                            isActive
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }
                      `}
                                        >
                                            <Icon
                                                className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'}`}
                                            />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
                    <form action={onSignOut}>
                        <button
                            type="submit"
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
};
