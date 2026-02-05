import { useState, useMemo, useCallback } from 'react';
import { ResumeContent, ResumeContentType } from '@/types';

export interface ResumeState {
    resumeContents: ResumeContent[];
    setResumeContents: React.Dispatch<React.SetStateAction<ResumeContent[]>>;
    groupedResumeContents: Record<ResumeContentType, ResumeContent[]>;
    setGroupedResumeContents: React.Dispatch<
        React.SetStateAction<Record<ResumeContentType, ResumeContent[]>>
    >;
    isResumeLoading: boolean;
    refreshResumeContents: () => Promise<void>;
    getResumeContentsByType: (type: ResumeContentType) => ResumeContent[];
    updateResumeContentStatus: (id: number, status: string) => Promise<void>;
}

export const useResume = (): ResumeState => {
    const [resumeContents, setResumeContents] = useState<ResumeContent[]>([]);
    const [groupedResumeContents, setGroupedResumeContents] = useState<
        Record<ResumeContentType, ResumeContent[]>
    >({
        [ResumeContentType.EXPERIENCE]: [],
        [ResumeContentType.PROJECT]: [],
        [ResumeContentType.EDUCATION]: [],
        [ResumeContentType.SKILL]: [],
        [ResumeContentType.CERTIFICATION]: [],
        [ResumeContentType.AWARD]: [],
        [ResumeContentType.TESTIMONIAL]: [],
        [ResumeContentType.LANGUAGE]: [],
        [ResumeContentType.STRENGTH]: [],
    });
    const [isResumeLoading, setIsResumeLoading] = useState(true);

    const refreshResumeContents = useCallback(async () => {
        try {
            setIsResumeLoading(true);
            const response = await fetch('/api/resume?grouped=true');

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setGroupedResumeContents(result.data);

                    // also flatten for general use
                    const allContents = Object.values(result.data).flat() as ResumeContent[];
                    setResumeContents(allContents);
                } else {
                    console.error(
                        'Failed to fetch resume contents:',
                        result.error?.message || 'Unknown error'
                    );
                }
            } else {
                console.error('Failed to fetch resume contents');
            }
        } catch (error) {
            console.error('Error fetching resume contents:', error);
        } finally {
            setIsResumeLoading(false);
        }
    }, []);

    const updateResumeContentStatus = useCallback(async (id: number, status: string) => {
        try {
            const response = await fetch(`/api/resume/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                await refreshResumeContents();
            } else {
                console.error('Failed to update resume content status');
            }
        } catch (error) {
            console.error('Error updating resume content status:', error);
        }
    }, [refreshResumeContents]);

    const getResumeContentsByType = useCallback(
        (type: ResumeContentType): ResumeContent[] => {
            return groupedResumeContents[type] || [];
        },
        [groupedResumeContents]
    );

    // memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            resumeContents,
            setResumeContents,
            groupedResumeContents,
            setGroupedResumeContents,
            isResumeLoading,
            refreshResumeContents,
            getResumeContentsByType,
            updateResumeContentStatus,
        }),
        [
            resumeContents,
            groupedResumeContents,
            isResumeLoading,
            refreshResumeContents,
            getResumeContentsByType,
            updateResumeContentStatus,
        ]
    );

    return contextValue;
};
