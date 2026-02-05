'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Note, MediaItem, UserProfile } from '@/types';
import { useAuth } from '@/context/auth';
import { useNavigation } from '@/context/navigation';
import { useTheme } from '@/context/theme';
import { useNotes } from '@/context/notes';
import { useNotifications } from '@/context/notifications';
import { useMedia } from '@/context/media';
import { useProfile } from '@/context/profile';
import { useSettings } from '@/context/settings';
import { useDialogs } from '@/context/dialogs';
import { useResume } from '@/context/resume';

export interface ContextState {
    // authentication
    isAuthenticated: boolean;
    setIsAuthenticated: (val: boolean) => void;

    // navigation
    activeView: string;
    setActiveView: (view: string) => void;

    // theme
    isDarkMode: boolean;
    setIsDarkMode: (val: boolean) => void;

    // notes management
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    isEditorOpen: boolean;
    setIsEditorOpen: (val: boolean) => void;
    editingNote: Note | null;
    setEditingNote: (note: Note | null) => void;
    newNoteType: any;
    setNewNoteType: (type: any) => void;
    handleEdit: (item: any) => void;
    handleNew: (type: any) => void;
    isLoading: boolean;
    refreshNotes: () => Promise<void>;

    // media management
    mediaFiles: MediaItem[];
    setMediaFiles: React.Dispatch<React.SetStateAction<MediaItem[]>>;

    // user profile
    userProfile: UserProfile;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
    isProfileLoading: boolean;
    refreshProfile: () => Promise<void>;

    // settings
    settings: any;
    setSettings: React.Dispatch<React.SetStateAction<any>>;
    isSettingsLoading: boolean;
    refreshSettings: () => Promise<void>;
    updateSettings: (data: any) => Promise<void>;
    resetSettings: () => Promise<void>;

    // notifications
    toasts: any[];
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    removeToast: (id: string) => void;

    // dialogs
    deleteId: string | number | null;
    setDeleteId: (id: string | number | null) => void;
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (val: boolean) => void;
    handleDelete: (id: string | number) => void;

    // resume management
    resumeContents: any[];
    setResumeContents: React.Dispatch<React.SetStateAction<any[]>>;
    groupedResumeContents: Record<string, any[]>;
    setGroupedResumeContents: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
    isResumeLoading: boolean;
    refreshResumeContents: () => Promise<void>;
    getResumeContentsByType: (type: any) => any[];
    updateResumeContentStatus: (id: number, status: string) => Promise<void>;
}

const Context = createContext<ContextState | undefined>(undefined);

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();
    const navigation = useNavigation();
    const theme = useTheme();
    const notes = useNotes();
    const notifications = useNotifications();
    const media = useMedia();
    const profile = useProfile();
    const settings = useSettings();
    const dialogs = useDialogs();
    const resume = useResume();
    const pathname = usePathname();

    useEffect(() => {
        if (!auth.isAuthenticated) return;

        if (pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
            return;
        }

        if (pathname?.startsWith('/admin') && !profile.userProfile.displayName) {
            profile.refreshProfile();
        }

        if (pathname?.startsWith('/admin')) {
            if (!settings.settings || Object.keys(settings.settings).length === 0) {
                settings.refreshSettings();
            }
        }

        if (pathname?.startsWith('/admin/notes') || pathname?.startsWith('/admin/dashboard')) {
            if (notes.notes.length === 0) {
                notes.refreshNotes();
            }
        }

        if (
            pathname?.startsWith('/admin/resume') ||
            pathname?.startsWith('/admin/experience') ||
            pathname?.startsWith('/admin/education') ||
            pathname?.startsWith('/admin/skills') ||
            pathname?.startsWith('/admin/projects') ||
            pathname?.startsWith('/admin/strengths') ||
            pathname?.startsWith('/admin/awards') ||
            pathname?.startsWith('/admin/languages') ||
            pathname?.startsWith('/admin/testimonials') ||
            pathname?.startsWith('/admin/certifications')
        ) {
            if (resume.resumeContents.length === 0) {
                resume.refreshResumeContents();
            }
        }
    }, [auth.isAuthenticated, pathname]);

    const contextValue: ContextState = {
        ...auth,
        ...navigation,
        ...theme,
        ...notes,
        ...media,
        ...profile,
        ...settings,
        ...notifications,
        ...dialogs,
        ...resume,
    };

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useContextState = (): ContextState => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useContextState must be used within a ContextProvider');
    }
    return context;
};
