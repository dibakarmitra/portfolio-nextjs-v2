'use client';
import React, { useState } from 'react';
import { Note, ResumeContent } from '@/types';
import { Github, ExternalLink, Calendar, Eye, Code2, ImageOff } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { ActionButtons } from '../ui/ActionButtons';

interface ProjectCardProps {
    project: ResumeContent | Note;
    onEdit: (note: any) => void;
    onDelete: (id: string | number) => void;
    onStatusChange: (id: string | number, status: any) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    onEdit,
    onDelete,
    onStatusChange,
}) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/50 flex flex-col relative h-full">
            {/* Action Overlay (Visible on Hover) */}
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-black/60 p-1.5 rounded-lg backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-xl transform translate-y-[-10px] group-hover:translate-y-0 duration-200">
                <ActionButtons
                    onEdit={() => onEdit(project)}
                    onDelete={() => onDelete(project.id)}
                    onStatusChange={() =>
                        onStatusChange(
                            project.id,
                            project.status === 'published' ? 'draft' : 'published'
                        )
                    }
                    status={project.status}
                />
            </div>

            {/* Thumbnail */}
            <div className="h-48 w-full bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden group/image border-b border-zinc-200 dark:border-zinc-800">
                {project.imageUrl && !imageError ? (
                    <>
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                            onError={() => setImageError(true)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-950 relative">
                        <div className="relative z-10 p-4 rounded-full bg-white/50 dark:bg-white/5 mb-3 ring-1 ring-black/5 dark:ring-white/10 group-hover:bg-white/80 dark:group-hover:bg-white/10 transition-colors backdrop-blur-sm">
                            {imageError ? (
                                <ImageOff className="w-8 h-8 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                            ) : (
                                <Code2 className="w-8 h-8 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                            )}
                        </div>
                    </div>
                )}

                <div className="absolute top-3 left-3 z-10">
                    <StatusBadge status={project.status} className="shadow-lg backdrop-blur-md" />
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {project.title}
                    </h3>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
                    {project.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                        <span
                            key={typeof tag === 'string' ? tag : tag.id}
                            className="px-2 py-1 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50"
                        >
                            {typeof tag === 'string' ? tag : tag.name}
                        </span>
                    ))}
                    {project.tags.length > 3 && (
                        <span className="px-2 py-1 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 border border-zinc-200 dark:border-zinc-700/50">
                            +{project.tags.length - 3}
                        </span>
                    )}
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                        {project.repoUrl && (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                                title="View Code"
                            >
                                <Github size={16} />
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                                title="View Live Site"
                            >
                                <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                        <span className="flex items-center">
                            <Calendar size={12} className="mr-1.5" />
                            {new Date(project.date).getFullYear()}
                        </span>
                        <span className="flex items-center">
                            <Eye size={12} className="mr-1.5" />
                            {project.views?.toLocaleString() || 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
