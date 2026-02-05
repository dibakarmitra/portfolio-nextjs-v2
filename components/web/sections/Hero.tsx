'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Mail,
    MapPin,
    Phone,
    Briefcase,
    Globe,
    CheckCircle2,
    FileText,
    BadgeCheck,
} from 'lucide-react';
import { PROFILE } from '@/config/constants';
import FadeIn from '../ui/FadeIn';
import { UserProfile } from '@/types';

interface HeroProps {
    profile?: UserProfile | null;
}

const Hero: React.FC<HeroProps> = ({ profile: dbProfile }) => {
    const profile = dbProfile
        ? {
              name: dbProfile.displayName,
              role: dbProfile.role,
              location: dbProfile.location,
              phone: dbProfile.phone,
              email: dbProfile.email,
              website: dbProfile.siteUrl?.replace('https://', '').replace('http://', ''),
              avatar: dbProfile.avatarUrl,
              resumeUrl: dbProfile.resumeUrl,
          }
        : PROFILE;

    return (
        <div id="home" className="pt-24 pb-10">
            <FadeIn>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 overflow-hidden shadow-xl relative">
                            <Image
                                src={profile.avatar}
                                alt={profile.name}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 128px, 160px"
                            />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-white dark:bg-zinc-900 rounded-full p-1 shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-blue-500 fill-current" />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-grow space-y-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {profile.name}
                                </h1>
                                <BadgeCheck
                                    className="w-6 h-6 text-blue-500"
                                    aria-label="Verified"
                                />
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-500 text-sm mt-1">
                                Tech blogger sharing insights and tutorials regularly.
                            </p>
                        </div>

                        <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
                            <div className="flex items-center gap-3">
                                <Briefcase size={16} className="text-zinc-400 dark:text-zinc-500" />
                                <span>{profile.role}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-zinc-400 dark:text-zinc-500" />
                                <span>{profile.location}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-zinc-400 dark:text-zinc-500" />
                                <span>{profile.phone}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-zinc-400 dark:text-zinc-500" />
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                                >
                                    {profile.email}
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <Globe size={16} className="text-zinc-400 dark:text-zinc-500" />
                                <a
                                    href={`https://${profile.website}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                                >
                                    {profile.website}
                                </a>
                            </div>

                            {profile.resumeUrl && (
                                <div className="flex items-center gap-3 pt-2">
                                    <Link
                                        href="/resume"
                                        className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        <FileText size={14} /> View Resume
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};

export default Hero;
