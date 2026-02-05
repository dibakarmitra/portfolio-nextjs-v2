import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface AuthState {
    isAuthenticated: boolean;
    setIsAuthenticated: (val: boolean) => void;
}

export const useAuth = (): AuthState => {
    const { data: session, status } = useSession();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            setIsAuthenticated(true);
        } else if (status === 'unauthenticated') {
            setIsAuthenticated(false);
        }
    }, [status]);

    return {
        isAuthenticated,
        setIsAuthenticated,
    };
};
