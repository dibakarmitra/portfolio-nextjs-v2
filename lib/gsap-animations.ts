import gsap from 'gsap';

/**
 * Kill all animations on element(s) to prevent conflicts
 */
export const killAnimations = (element: Element | Element[]) => {
    gsap.killTweensOf(element);
};

/**
 * Fade in animation - reveals element with opacity and optional transform
 */
export const fadeIn = (
    element: Element | Element[],
    {
        duration = 0.7,
        delay = 0,
        direction = 'none',
        overwrite = 'auto',
    }: {
        duration?: number;
        delay?: number;
        direction?: 'up' | 'down' | 'left' | 'right' | 'none';
        overwrite?: 'auto' | boolean;
    } = {}
) => {
    const getInitialTransform = () => {
        switch (direction) {
            case 'up':
                return { y: 32 };
            case 'down':
                return { y: -32 };
            case 'left':
                return { x: -32 };
            case 'right':
                return { x: 32 };
            default:
                return {};
        }
    };

    killAnimations(element);
    gsap.set(element, { opacity: 0, ...getInitialTransform() });
    return gsap.to(element, {
        duration,
        opacity: 1,
        y: 0,
        x: 0,
        ease: 'power2.out',
        delay,
        overwrite,
    });
};

/**
 * Slide animation - moves element from one position to another
 */
export const slide = (
    element: Element | Element[],
    {
        duration = 0.6,
        delay = 0,
        from = { x: 0, y: 0 },
        to = { x: 0, y: 0 },
        ease = 'power2.inOut',
    }: {
        duration?: number;
        delay?: number;
        from?: { x?: number; y?: number };
        to?: { x?: number; y?: number };
        ease?: string;
    } = {}
) => {
    killAnimations(element);
    gsap.set(element, from);
    return gsap.to(element, {
        duration,
        ...to,
        ease,
        delay,
        overwrite: 'auto',
    });
};

/**
 * Scale animation - grows or shrinks element
 */
export const scale = (
    element: Element | Element[],
    {
        duration = 0.4,
        delay = 0,
        from = 1,
        to = 1,
        ease = 'back.out',
    }: {
        duration?: number;
        delay?: number;
        from?: number;
        to?: number;
        ease?: string;
    } = {}
) => {
    killAnimations(element);
    gsap.set(element, { scale: from });
    return gsap.to(element, {
        duration,
        scale: to,
        ease,
        delay,
        overwrite: 'auto',
    });
};

/**
 * Rotate animation - spins element
 */
export const rotate = (
    element: Element | Element[],
    {
        duration = 0.8,
        delay = 0,
        degrees = 360,
        ease = 'power1.inOut',
    }: {
        duration?: number;
        delay?: number;
        degrees?: number;
        ease?: string;
    } = {}
) => {
    killAnimations(element);
    return gsap.to(element, {
        duration,
        rotation: degrees,
        ease,
        delay,
        overwrite: 'auto',
    });
};

/**
 * Pulse animation - grows and shrinks repeatedly
 */
export const pulse = (
    element: Element | Element[],
    {
        duration = 0.6,
        delay = 0,
        scale = 1.1,
        repeat = -1,
    }: {
        duration?: number;
        delay?: number;
        scale?: number;
        repeat?: number;
    } = {}
) => {
    killAnimations(element);
    return gsap.to(element, {
        duration,
        scale,
        yoyo: true,
        repeat,
        ease: 'sine.inOut',
        delay,
        overwrite: 'auto',
    });
};

/**
 * Stagger animation - animates multiple elements with delay between each
 */
export const stagger = (
    elements: Element[],
    {
        duration = 0.7,
        staggerDelay = 0.1,
        direction = 'up',
        ease = 'power2.out',
    }: {
        duration?: number;
        staggerDelay?: number;
        direction?: 'up' | 'down' | 'left' | 'right';
        ease?: string;
    } = {}
) => {
    const getInitialTransform = () => {
        switch (direction) {
            case 'up':
                return { y: 32 };
            case 'down':
                return { y: -32 };
            case 'left':
                return { x: -32 };
            case 'right':
                return { x: 32 };
            default:
                return {};
        }
    };

    killAnimations(elements);
    gsap.set(elements, { opacity: 0, ...getInitialTransform() });

    return gsap.to(elements, {
        duration,
        opacity: 1,
        y: 0,
        x: 0,
        ease,
        stagger: staggerDelay,
        overwrite: 'auto',
    });
};

/**
 * Flip animation - flips element on X or Y axis
 */
export const flip = (
    element: Element | Element[],
    {
        duration = 0.6,
        delay = 0,
        axis = 'y',
        ease = 'back.out',
    }: {
        duration?: number;
        delay?: number;
        axis?: 'x' | 'y';
        ease?: string;
    } = {}
) => {
    killAnimations(element);
    const rotationKey = axis === 'y' ? 'rotationY' : 'rotationX';
    return gsap.to(element, {
        duration,
        [rotationKey]: 360,
        ease,
        delay,
        overwrite: 'auto',
    });
};

/**
 * Bounce animation - creates a bouncy effect
 */
export const bounce = (
    element: Element | Element[],
    {
        duration = 0.8,
        delay = 0,
        distance = 20,
        bounces = 3,
    }: {
        duration?: number;
        delay?: number;
        distance?: number;
        bounces?: number;
    } = {}
) => {
    killAnimations(element);
    return gsap.to(element, {
        duration,
        y: distance,
        ease: `back.out(${bounces})`,
        delay,
        overwrite: 'auto',
    });
};
