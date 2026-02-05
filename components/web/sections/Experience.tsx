'use client';

import React, { useState } from 'react';
import { Briefcase, ArrowUpRight, Lightbulb, ChevronDown } from 'lucide-react';
import Section from '../ui/Section';
import FadeIn from '../ui/FadeIn';
import { EXPERIENCE } from '@/config/constants';
import { ResumeContent } from '@/types';

interface ExperienceProps {
    experiences?: ResumeContent[];
}

const Experience: React.FC<ExperienceProps> = ({ experiences: dbExperiences }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    const toggleItem = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // transform db experiences to component format or use static
    const experiences =
        dbExperiences && dbExperiences.length > 0
            ? dbExperiences.map((exp) => ({
                  role: exp.title,
                  company: exp.company || '',
                  period: exp.endDate
                      ? `${new Date(exp.date).getFullYear()} - ${new Date(exp.endDate).getFullYear()}`
                      : 'Present',
                  type: exp.category || 'Full-Time',
                  current: !exp.endDate,
                  description:
                      exp.content
                          ?.split('\n')
                          .filter((line: string) => line.trim().startsWith('-'))
                          .map((line: string) => line.trim().substring(1).trim()) || [],
                  skills: [] as string[],
              }))
            : EXPERIENCE;

    return (
        <Section id="experience" title="Experience">
            <div className="space-y-8 pl-2">
                {experiences.map((exp, index) => {
                    const isOpen = expandedIndex === index;

                    return (
                        <FadeIn key={index} delay={index * 100}>
                            <div className="relative border-l border-zinc-200 dark:border-zinc-800 pl-6 pb-2 transition-all">
                                <div
                                    className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                                        isOpen || exp.current
                                            ? 'bg-zinc-50 border-zinc-900 dark:bg-zinc-950 dark:border-white'
                                            : 'bg-zinc-200 border-zinc-400 dark:bg-zinc-800 dark:border-zinc-600'
                                    }`}
                                ></div>

                                <div
                                    onClick={() => toggleItem(index)}
                                    className="group cursor-pointer flex flex-col sm:flex-row sm:items-start sm:justify-between pr-2"
                                >
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {exp.role === 'Looking For an Opportunity' && (
                                                <Lightbulb size={16} className="text-yellow-500" />
                                            )}
                                            {exp.company}
                                            {exp.company !== 'Looking For an Opportunity' && (
                                                <ArrowUpRight
                                                    size={14}
                                                    className="text-zinc-400 dark:text-zinc-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                                />
                                            )}
                                        </h3>
                                        <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">
                                            {exp.role}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                        <span className="text-xs text-zinc-500 font-mono whitespace-nowrap">
                                            {exp.period}
                                        </span>
                                        <div
                                            className={`text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-transform duration-300 ${isOpen ? '-rotate-180' : ''}`}
                                        >
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                        isOpen
                                            ? 'grid-rows-[1fr] opacity-100 mt-4'
                                            : 'grid-rows-[0fr] opacity-0 mt-0'
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="space-y-4 pb-2">
                                            <div className="text-xs text-zinc-500 font-mono border-b border-zinc-200 dark:border-zinc-800/50 pb-2 mb-2 inline-block">
                                                {exp.type}
                                            </div>

                                            {exp.description.length > 0 && (
                                                <ul className="space-y-2">
                                                    {exp.description.map(
                                                        (desc: string, i: number) => (
                                                            <li
                                                                key={i}
                                                                className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex items-start"
                                                            >
                                                                <span className="mr-2 mt-1.5 w-1 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full shrink-0"></span>
                                                                {desc}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}

                                            {exp.skills && exp.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-2">
                                                    {exp.skills.map((skill: string) => (
                                                        <span
                                                            key={skill}
                                                            className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-[10px] text-zinc-600 dark:text-zinc-300 font-mono"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
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

export default Experience;
