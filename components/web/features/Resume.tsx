'use client';

import React from 'react';
import Link from 'next/link';
import {
    Mail,
    MapPin,
    Linkedin,
    Github,
    Printer,
    ArrowLeft,
    ExternalLink,
    Globe,
    Phone,
} from 'lucide-react';
import {
    PROFILE,
    EXPERIENCE,
    EDUCATION,
    SKILLS,
    PROJECTS,
    LANGUAGES,
    STRENGTHS,
    HOBBIES,
} from '@/config/constants';
import { PortfolioData } from '@/services/portfolioService';

interface ResumeProps {
    data?: PortfolioData;
}

const Resume: React.FC<ResumeProps> = ({ data }) => {
    // use data from props or fallback to static constants
    const profile = data?.profile
        ? {
              name: data.profile.displayName,
              role: data.profile.role,
              location: data.profile.location,
              phone: data.profile.phone,
              email: data.profile.email,
              bio: data.profile.bio,
              socials: Object.entries(data.profile.socials || {}).map(([platform, url]) => ({
                  platform: platform.charAt(0).toUpperCase() + platform.slice(1),
                  url: url.startsWith('http') ? url : `https://${url}`,
                  icon: platform.toLowerCase(),
              })),
          }
        : PROFILE;

    const experience = data?.resume?.experience?.length
        ? data.resume.experience.map((exp) => ({
              role: exp.title,
              company: exp.company || '',
              period: exp.endDate
                  ? `${new Date(exp.date).getFullYear()} - ${new Date(exp.endDate).getFullYear()}`
                  : 'Present',
              current: !exp.endDate,
              description: exp.content
                  .split('\n')
                  .filter((line) => line.trim().startsWith('-'))
                  .map((line) => line.trim().substring(1).trim()),
          }))
        : EXPERIENCE;

    const education = data?.resume?.education?.length
        ? data.resume.education.map((edu) => ({
              degree: edu.title,
              school: edu.company || '',
              year: new Date(edu.date).getFullYear().toString(),
          }))
        : EDUCATION;

    const skills = data?.resume?.skills?.length
        ? (() => {
              const grouped: Record<string, string[]> = {};
              data.resume.skills.forEach((s) => {
                  const cat = s.category || 'Other';
                  if (!grouped[cat]) grouped[cat] = [];
                  grouped[cat].push(s.title);
              });
              return Object.entries(grouped).map(([category, items]) => ({ category, items }));
          })()
        : SKILLS;

    const projects = data?.resume?.projects?.length
        ? data.resume.projects.map((p) => ({
              title: p.title,
              description: p.excerpt,
              tech: p.tags?.map((t) => t.name) || [],
              link: p.liveUrl,
              isFeatured: p.category === 'featured',
          }))
        : PROJECTS;

    const strengths = data?.resume?.strengths?.length
        ? data.resume.strengths.map((s) => s.title)
        : STRENGTHS;

    const languages = data?.resume?.languages?.length
        ? data.resume.languages.map(
              (l) =>
                  `${l.title} (${l.proficiencyLevel ? l.proficiencyLevel.charAt(0).toUpperCase() + l.proficiencyLevel.slice(1) : 'Fluent'})`
          )
        : LANGUAGES;

    const getSocial = (platform: string) =>
        profile.socials.find(
            (s: any) => s.platform === platform || s.icon === platform.toLowerCase()
        );
    const github = getSocial('GitHub') || getSocial('github');
    const linkedin = getSocial('LinkedIn') || getSocial('linkedin');
    const website = profile.socials.find(
        (s: any) =>
            s.platform === 'Website' ||
            s.platform === 'Home Page' ||
            s.icon === 'layout' ||
            s.icon === 'website'
    );

    return (
        <div className="bg-zinc-50 min-h-screen py-8 px-4 md:px-8 font-sans text-zinc-900 print:bg-white print:p-0">
            <style>
                {`
                @media print {
                    @page {
                        margin: 15mm;
                        size: auto;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .print-reset-width {
                        max-width: none !important;
                        width: 100% !important;
                        margin: 0 !important;
                    }
                    h3, h4 {
                        break-after: avoid;
                    }
                    section {
                        break-inside: auto;
                    }
                    li {
                        break-inside: avoid;
                    }
                }
            `}
            </style>
            <div className="max-w-[210mm] mx-auto print-reset-width">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 print:hidden">
                    <Link
                        href="/"
                        className="flex items-center text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Back to Portfolio
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center bg-zinc-900 text-white px-5 py-2 rounded-lg hover:bg-zinc-700 transition-colors shadow-sm cursor-pointer"
                    >
                        <Printer size={18} className="mr-2" /> Print / Save PDF
                    </button>
                </div>

                <div className="bg-white shadow-2xl print:shadow-none p-8 md:p-12 print:p-0 rounded-lg">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row print:flex-row justify-between items-start border-b-2 border-zinc-900 pb-6 mb-8 gap-6">
                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 uppercase tracking-tighter leading-none mb-2">
                                    {profile.name}
                                </h1>
                                <p className="text-xl text-blue-700 font-semibold tracking-wide">
                                    {profile.role}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1.5 text-sm text-zinc-600">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-zinc-400" />
                                    <span>{profile.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-zinc-400" />
                                    <span>{profile.phone}</span>
                                </div>
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                >
                                    <Mail size={14} className="text-zinc-400" />
                                    <span>{profile.email}</span>
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 md:mt-0 print:mt-0">
                            {linkedin && (
                                <a
                                    href={linkedin.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-zinc-400 hover:text-blue-700 transition-colors"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin size={22} />
                                </a>
                            )}
                            {github && (
                                <a
                                    href={github.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-zinc-400 hover:text-zinc-900 transition-colors"
                                    aria-label="GitHub"
                                >
                                    <Github size={22} />
                                </a>
                            )}
                            {website && (
                                <a
                                    href={website.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-zinc-400 hover:text-blue-600 transition-colors"
                                    aria-label="Portfolio"
                                >
                                    <Globe size={22} />
                                </a>
                            )}
                        </div>
                    </header>

                    {/* Profile Section */}
                    <section className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-200 pb-1">
                            Profile
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed text-justify">
                            {profile.bio}
                        </p>
                    </section>

                    {/* Resume Body */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] print:grid-cols-[1fr_2fr] gap-8 print:gap-6">
                        {/* Left Column */}
                        <div className="space-y-8 print:space-y-6">
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-200 pb-1">
                                    Skills
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((grp, i) => (
                                        <div key={i} className="break-inside-avoid">
                                            <h4 className="font-bold text-zinc-900 text-xs mb-2">
                                                {grp.category}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {grp.items.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-zinc-100 rounded text-xs text-zinc-700 print:border print:border-zinc-200 print:bg-transparent"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-200 pb-1">
                                    Strengths
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {strengths.map((strength, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-zinc-100 rounded text-xs text-zinc-700 print:border print:border-zinc-200 print:bg-transparent"
                                        >
                                            {strength}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-200 pb-1">
                                    Languages
                                </h3>
                                <div className="space-y-1">
                                    {languages.map((lang, idx) => (
                                        <div key={idx} className="text-sm text-zinc-700">
                                            {lang}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-200 pb-1">
                                    Hobbies
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {HOBBIES.map((hobby, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-zinc-100 rounded text-xs text-zinc-700 print:border print:border-zinc-200 print:bg-transparent"
                                        >
                                            {hobby}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8 print:space-y-6">
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-200 pb-1">
                                    Work Experience
                                </h3>
                                <div className="space-y-6 print:space-y-5">
                                    {experience.map((exp, i) => (
                                        <div
                                            key={i}
                                            className="relative pl-4 border-l-2 border-zinc-100 print:border-zinc-200 break-inside-avoid"
                                        >
                                            <div
                                                className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${exp.current ? 'bg-blue-600' : 'bg-zinc-300'}`}
                                            ></div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                                <h4 className="text-base font-bold text-zinc-900">
                                                    {exp.role}
                                                </h4>
                                                <span className="text-xs font-medium text-zinc-500 font-mono bg-zinc-50 px-2 py-0.5 rounded print:bg-transparent print:p-0">
                                                    {exp.period}
                                                </span>
                                            </div>
                                            <div className="text-blue-700 font-medium text-sm mb-2">
                                                {exp.company}
                                            </div>
                                            <ul className="list-disc list-outside ml-4 space-y-1 text-zinc-700 text-sm leading-relaxed marker:text-zinc-400">
                                                {exp.description.map((point, idx) => (
                                                    <li key={idx} className="pl-1">
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-200 pb-1">
                                    Education
                                </h3>
                                <div className="space-y-4">
                                    {education.map((edu, i) => (
                                        <div key={i} className="break-inside-avoid">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                                <div className="font-bold text-zinc-900 text-sm">
                                                    {edu.degree}
                                                </div>
                                                <div className="text-zinc-400 text-xs font-mono">
                                                    {edu.year}
                                                </div>
                                            </div>
                                            <div className="text-zinc-600 text-xs">
                                                {edu.school}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-200 pb-1">
                                    Featured Projects
                                </h3>
                                <div className="space-y-5">
                                    {projects
                                        .filter((p) => p.isFeatured)
                                        .slice(0, 4)
                                        .map((proj, i) => (
                                            <div key={i} className="break-inside-avoid">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-sm font-bold text-zinc-900">
                                                        {proj.title}
                                                    </h4>
                                                    {proj.link && (
                                                        <a
                                                            href={proj.link}
                                                            target="_blank"
                                                            className="text-blue-600 print:hidden"
                                                        >
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    )}
                                                </div>
                                                <p className="text-sm text-zinc-700 mb-2 leading-relaxed">
                                                    {proj.description}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {proj.tech.map((t, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-[10px] font-mono text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5"
                                                        >
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-400 print:hidden">
                        <span>
                            &copy; {new Date().getFullYear()} {profile.name}
                        </span>
                        <span>Generated via Portfolio App</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resume;
