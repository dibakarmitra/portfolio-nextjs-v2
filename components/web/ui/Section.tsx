import React from 'react';

interface SectionProps {
    id: string;
    className?: string;
    children: React.ReactNode;
    title?: string;
    count?: number;
    rightElement?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
    id,
    className = '',
    children,
    title,
    count,
    rightElement,
}) => {
    return (
        <section id={id} className={`scroll-mt-24 py-10 ${className}`}>
            {(title || rightElement) && (
                <div className="flex justify-between items-baseline mb-6">
                    {title && (
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-baseline">
                            {title}
                            {count !== undefined && (
                                <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400 font-normal">
                                    ({count})
                                </span>
                            )}
                        </h2>
                    )}
                    {rightElement}
                </div>
            )}
            {children}
        </section>
    );
};

export default Section;
