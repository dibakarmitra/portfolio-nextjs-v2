import { useState } from 'react';

export interface NavigationState {
    activeView: string;
    setActiveView: (view: string) => void;
}

export const useNavigation = (): NavigationState => {
    const [activeView, setActiveView] = useState('dashboard');

    return {
        activeView,
        setActiveView,
    };
};
