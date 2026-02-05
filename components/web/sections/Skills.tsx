'use client';

import Image from 'next/image';
import Section from '../ui/Section';
import FadeIn from '../ui/FadeIn';
import { SKILLS } from '@/config/constants';
import { ResumeContent } from '@/types';

interface SkillsProps {
    skills?: ResumeContent[];
}

const Skills: React.FC<SkillsProps> = ({ skills: dbSkills }) => {
    // flattening skills for the single "tech stack" look from reference
    // use db skills if available, otherwise fall back to static
    const allSkills =
        dbSkills && dbSkills.length > 0
            ? dbSkills.map((s) => s.title)
            : SKILLS.flatMap((s) => s.items);

    const getIconSlug = (name: string): string => {
        const map: Record<string, string> = {
            'Next.js': 'nextdotjs',
            'Node.js': 'nodedotjs',
            React: 'react',
            TypeScript: 'typescript',
            JavaScript: 'javascript',
            'Tailwind CSS': 'tailwindcss',
            PostgreSQL: 'postgresql',
            MongoDB: 'mongodb',
            Docker: 'docker',
            AWS: 'amazonaws',
            Figma: 'figma',
            Git: 'git',
            Redux: 'redux',
            GraphQL: 'graphql',
            Python: 'python',
            'Shadcn UI': 'shadcnui',
            GSAP: 'greensock',
            Prisma: 'prisma',
            'VS Code': 'visualstudiocode',
            HTML: 'html5',
            CSS: 'css',
            'RESTful API': 'restapi',
            WordPress: 'wordpress',
            jQuery: 'jquery',
            PHP: 'php',
            Laravel: 'laravel',
            Django: 'django',
            MySQL: 'mysql',
            Bootstrap: 'bootstrap',
            Linux: 'linux',
            Redis: 'redis',
            Postman: 'postman',
        };
        return map[name] || name.toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    const isDarkIcon = (slug: string) => {
        // these icons are black/dark by default and need inversion in dark mode to be visible
        return ['nextdotjs', 'shadcnui', 'github', 'amazonaws', 'greensock', 'vercel'].includes(
            slug
        );
    };

    return (
        <Section id="tech-stack" title="Tech Stack">
            <FadeIn>
                <div className="flex flex-wrap gap-3">
                    {allSkills.map((skill, index) => {
                        const slug = getIconSlug(skill);
                        const invertInDark = isDarkIcon(slug);

                        return (
                            <div
                                key={index}
                                className="group relative flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors gap-2"
                                title={skill}
                            >
                                <div
                                    className={`relative w-4 h-4 transition-all opacity-70 group-hover:opacity-100 ${invertInDark ? 'dark:invert' : ''}`}
                                >
                                    <Image
                                        src={`https://cdn.simpleicons.org/${slug}`}
                                        alt={`${skill} icon`}
                                        fill
                                        className="object-contain"
                                        sizes="16px"
                                    />
                                </div>
                                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 cursor-default">
                                    {skill}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </FadeIn>
        </Section>
    );
};

export default Skills;
