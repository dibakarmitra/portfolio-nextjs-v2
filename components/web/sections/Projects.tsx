'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Github, Folder, ArrowRight, ChevronDown } from 'lucide-react';
import Section from '../ui/Section';
import FadeIn from '../ui/FadeIn';
import { PROJECTS } from '@/config/constants';
import { ResumeContent } from '@/types';

interface ProjectsProps {
    projects?: ResumeContent[];
}

const Projects: React.FC<ProjectsProps> = ({ projects: dbProjects }) => {
    const [expandedItems, setExpandedItems] = useState<number[]>([0]);

    // transform db projects to component format or use static
    const projects =
        dbProjects && dbProjects.length > 0
            ? dbProjects.map((p) => ({
                  title: p.title,
                  date: new Date(p.date).getFullYear().toString(),
                  description: p.excerpt || '',
                  tech: [] as string[],
                  points:
                      p.content
                          ?.split('\n')
                          .filter((line: string) => line.trim().startsWith('-'))
                          .map((line: string) => line.trim().substring(1).trim()) || [],
                  link: p.liveUrl,
                  repo: p.repoUrl,
                  isFeatured: p.category === 'featured',
              }))
            : PROJECTS;

    const toggleItem = (index: number) => {
        setExpandedItems((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const featuredProjects = projects.filter((p) => p.isFeatured);
    const otherProjects = projects.filter((p) => !p.isFeatured);

    return (
        <Section
            id="projects"
            title="Featured Projects"
            count={projects.length}
            rightElement={
                <Link
                    href="/projects"
                    className="group flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                >
                    View All
                    <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </Link>
            }
        >
            <div className="space-y-4">
                {featuredProjects.map((project, index) => {
                    const isOpen = expandedItems.includes(index);
                    return (
                        <FadeIn key={index} delay={index * 100}>
                            <div className="group bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
                                <div
                                    onClick={() => toggleItem(index)}
                                    className="flex items-center justify-between p-4 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-md flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                                            <Folder size={16} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-xs text-zinc-500 font-mono">
                                                {project.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {project.link && (
                                            <Link
                                                href={project.link}
                                                target="_blank"
                                                className="text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <ArrowUpRight size={16} />
                                            </Link>
                                        )}
                                        {project.repo && (
                                            <Link
                                                href={project.repo}
                                                target="_blank"
                                                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Github size={16} />
                                            </Link>
                                        )}
                                        <div
                                            className={`text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${isOpen ? '-rotate-180' : ''}`}
                                        >
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-4 pb-4 space-y-4">
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                {project.description}
                                            </p>

                                            {project.points && project.points.length > 0 && (
                                                <ul className="space-y-1">
                                                    {project.points.map(
                                                        (point: string, i: number) => (
                                                            <li
                                                                key={i}
                                                                className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start"
                                                            >
                                                                <span className="mr-2 mt-1.5 w-1 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full shrink-0"></span>
                                                                {point}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}

                                            {project.tech && project.tech.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.tech.map((tech: string, i: number) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] text-zinc-600 dark:text-zinc-300 font-mono"
                                                        >
                                                            {tech}
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

            {otherProjects.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                        Other Projects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {otherProjects.map((project, index) => (
                            <FadeIn key={index} delay={index * 50}>
                                <div className="group p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center text-zinc-400">
                                            <Folder size={14} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {project.link && (
                                                <Link
                                                    href={project.link}
                                                    target="_blank"
                                                    className="text-zinc-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <ArrowUpRight size={14} />
                                                </Link>
                                            )}
                                            {project.repo && (
                                                <Link
                                                    href={project.repo}
                                                    target="_blank"
                                                    className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                                >
                                                    <Github size={14} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                                        {project.description}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            )}

            <FadeIn delay={200}>
                <div className="mt-6 text-center">
                    <Link
                        href="https://github.com/dibakarmitra"
                        target="_blank"
                        className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition-colors"
                    >
                        View all projects on GitHub
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </FadeIn>
        </Section>
    );
};

export default Projects;
