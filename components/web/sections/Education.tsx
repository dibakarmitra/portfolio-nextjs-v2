'use client';

import React, { useState } from 'react';
import { GraduationCap, ChevronDown } from 'lucide-react';
import Section from '../ui/Section';
import FadeIn from '../ui/FadeIn';
import { EDUCATION } from '@/config/constants';
import { ResumeContent } from '@/types';

interface EducationProps {
    education?: ResumeContent[];
}

const Education: React.FC<EducationProps> = ({ education: dbEducation }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // transform db education to component format or use static
    const educationList =
        dbEducation && dbEducation.length > 0
            ? dbEducation.map((edu) => ({
                  degree: edu.title,
                  school: edu.company || '',
                  year: new Date(edu.date).getFullYear().toString(),
              }))
            : EDUCATION;

    return (
        <Section id="education" title="Education">
            <div className="space-y-8 pl-2">
                {educationList.map((edu, idx) => {
                    const isOpen = expandedIndex === idx;
                    return (
                        <FadeIn key={idx} delay={idx * 100}>
                            <div className="relative border-l border-zinc-200 dark:border-zinc-800 pl-6 pb-2">
                                <div
                                    className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                                        isOpen
                                            ? 'bg-zinc-50 border-zinc-900 dark:bg-zinc-950 dark:border-white'
                                            : 'bg-zinc-200 border-zinc-400 dark:bg-zinc-800 dark:border-zinc-600'
                                    }`}
                                ></div>

                                <div
                                    className="group cursor-pointer flex flex-col sm:flex-row sm:items-start sm:justify-between pr-2"
                                    onClick={() => toggleItem(idx)}
                                >
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {edu.degree}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 sm:mt-0">
                                        <span className="text-xs text-zinc-500 font-mono">
                                            {edu.year}
                                        </span>
                                        <div
                                            className={`text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-transform duration-300 ${isOpen ? '-rotate-180' : ''}`}
                                        >
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                        isOpen
                                            ? 'grid-rows-[1fr] opacity-100 mt-2'
                                            : 'grid-rows-[0fr] opacity-0 mt-0'
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                            {edu.school}
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-2 font-mono">
                                            Relevant Coursework: Data Structures, Algorithms, Web
                                            Development.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    );
                })}
            </div>
        </Section>
    );
};

export default Education;
