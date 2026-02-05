'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    fullWidth?: boolean;
}

const FadeIn: React.FC<FadeInProps> = ({
    children,
    delay = 0,
    className = '',
    direction = 'up',
    fullWidth = false,
}) => {
    const domRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Tween | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const getInitialTransform = useCallback(() => {
        switch (direction) {
            case 'up':
                return { y: 32, opacity: 0 };
            case 'down':
                return { y: -32, opacity: 0 };
            case 'left':
                return { x: -32, opacity: 0 };
            case 'right':
                return { x: 32, opacity: 0 };
            default:
                return { opacity: 0 };
        }
    }, [direction]);

    useEffect(() => {
        if (!domRef.current || domRef.current.dataset.animated === 'true') return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (
                        entry.isIntersecting &&
                        domRef.current &&
                        domRef.current.dataset.animated !== 'true'
                    ) {
                        if (animationRef.current) {
                            animationRef.current.kill();
                        }

                        gsap.set(domRef.current, getInitialTransform());

                        animationRef.current = gsap.to(domRef.current, {
                            duration: 0.7,
                            opacity: 1,
                            y: 0,
                            x: 0,
                            ease: 'power2.out',
                            delay: delay / 1000,
                            overwrite: 'auto',
                        });

                        domRef.current.dataset.animated = 'true';
                        observerRef.current?.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (domRef.current) {
            observerRef.current.observe(domRef.current);
        }

        return () => {
            if (animationRef.current) {
                animationRef.current.kill();
            }
            if (observerRef.current && domRef.current) {
                observerRef.current.unobserve(domRef.current);
                observerRef.current.disconnect();
            }
        };
    }, [delay, getInitialTransform]);

    return (
        <div
            ref={domRef}
            className={`will-change-transform ${fullWidth ? 'w-full' : ''} ${className}`}
            data-animated="false"
        >
            {children}
        </div>
    );
};

export default FadeIn;
