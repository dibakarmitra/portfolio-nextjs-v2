import { useState } from 'react';
import { MediaItem } from '@/types';

export interface MediaState {
    mediaFiles: MediaItem[];
    setMediaFiles: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export const useMedia = (): MediaState => {
    const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);

    return {
        mediaFiles,
        setMediaFiles,
    };
};
