'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

const SplashCursor = dynamic(() => import('./SplashCursor').then((mod) => mod.default), {
    ssr: false,
});

export default SplashCursor;
