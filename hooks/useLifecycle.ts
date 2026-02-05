import React, { useEffect } from 'react';

export function useMount(callback: () => void | (() => void)) {
    useEffect(() => {
        return callback();
    }, []);
}

export function useUnmount(callback: () => void) {
    useEffect(() => {
        return callback;
    }, []);
}

export function useUpdateEffect(callback: () => void, dependencies: any[]) {
    const isFirstRender = React.useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        return callback();
    }, dependencies);
}
