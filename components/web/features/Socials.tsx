'use client';

import React from 'react';
import { Github, Linkedin, Twitter, ExternalLink, Code, Book, Layout } from 'lucide-react';
import { PROFILE } from '@/config/constants';
import FadeIn from '../ui/FadeIn';

interface SocialsProps {
    socials?: Record<string, string>;
}

const Socials: React.FC<SocialsProps> = ({ socials: dbSocials }) => {
    // transform db socials to the format needed, or use static
    const socials =
        dbSocials && Object.keys(dbSocials).length > 0
            ? Object.entries(dbSocials)
                  .filter(([_, url]) => url)
                  .map(([platform, url]) => ({
                      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
                      url: url.startsWith('http') ? url : `https://${url}`,
                      icon: platform.toLowerCase(),
                      username:
                          url
                              .replace(/^https?:\/\//, '')
                              .split('/')
                              .pop() || url,
                  }))
            : PROFILE.socials;

    const getIcon = (icon: string) => {
        switch (icon) {
            case 'github':
                return <Github size={20} />;
            case 'linkedin':
                return <Linkedin size={20} />;
            case 'twitter':
                return <Twitter size={20} />;
            case 'code':
                return <Code size={20} />;
            case 'book':
                return <Book size={20} />;
            case 'layout':
            case 'website':
                return <Layout size={20} />;
            default:
                return <ExternalLink size={20} />;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {socials.map((social, idx) => (
                <FadeIn key={social.platform} delay={idx * 50}>
                    <a
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Visit ${social.platform} profile`}
                        className="flex items-center p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all group"
                    >
                        <div className="bg-zinc-100 dark:bg-zinc-950 p-2 rounded-md text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                            {getIcon(social.icon)}
                        </div>
                        <div className="ml-4 flex-grow">
                            <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                {social.platform}
                            </div>
                            <p className="text-xs text-zinc-500">{social.username}</p>
                        </div>
                        <ExternalLink
                            size={16}
                            className="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400"
                        />
                    </a>
                </FadeIn>
            ))}
        </div>
    );
};

export default Socials;
