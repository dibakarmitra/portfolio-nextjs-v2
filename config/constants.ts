import { Profile, Experience, Project, SkillCategory, Note } from '@/types/web';
import { env } from './env';

const AVATAR_URL =
    env.OWNER_AVATAR ||
    'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=b6e3f4';
export const DEFAULT_NOTE_COVER =
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000';

export const PROFILE: Profile = {
    name: env.OWNER_NAME,
    role: env.OWNER_ROLE,
    location: env.OWNER_LOCATION,
    phone: env.OWNER_PHONE,
    bio: env.OWNER_BIO,
    email: env.OWNER_EMAIL,
    website: env.OWNER_WEBSITE,
    avatar: AVATAR_URL,
    resumeUrl: '#resume',
    socials: [
        {
            platform: 'LinkedIn',
            username: 'johndoe',
            url: 'https://linkedin.com/in/johndoe',
            icon: 'linkedin',
        },
        {
            platform: 'GitHub',
            username: 'johndoe',
            url: 'https://github.com/johndoe',
            icon: 'github',
        },
    ],
};

export const SKILLS: SkillCategory[] = [
    {
        category: 'Tech Stack',
        items: [
            'JavaScript',
            'TypeScript',
            'React',
            'Next.js',
            'Node.js',
            'PostgreSQL',
            'Tailwind CSS',
        ],
    },
    {
        category: 'Tools',
        items: ['Git', 'Docker', 'VS Code', 'Postman'],
    },
];

export const STRENGTHS = [
    'Problem Solving',
    'Architecture Design',
    'Team Leadership',
    'Communication',
];

export const LANGUAGES = ['English (Professional)', 'Spanish (Basic)'];

export const HOBBIES = ['Coding', 'Reading', 'Hiking'];

export const EXPERIENCE: Experience[] = [
    {
        role: 'Senior Developer',
        company: 'Tech Solutions Inc.',
        period: '2022 - Present',
        type: 'Full-Time',
        current: true,
        description: [
            'Led development of cloud-native applications.',
            'Mentored junior developers and improved code quality.',
            'Architected scalable backend systems using Node.js.',
        ],
        skills: ['Node.js', 'AWS', 'System Design'],
    },
    {
        role: 'Full Stack Developer',
        company: 'Web Innovation Co.',
        period: '2019 - 2022',
        type: 'Full-Time',
        description: [
            'Developed responsive web applications using React.',
            'Implemented RESTful APIs and integrated with third-party services.',
        ],
        skills: ['React', 'Express', 'MongoDB'],
    },
];

export const PROJECTS: Project[] = [
    {
        title: 'Project Alpha',
        date: '2023',
        description:
            'A comprehensive management system for small businesses to track inventory and sales.',
        tech: ['React', 'Next.js', 'PostgreSQL'],
        points: [
            'Real-time inventory tracking',
            'Sales reporting and analytics',
            'Multi-user support',
        ],
        link: 'https://example.com/project-alpha',
        isFeatured: true,
    },
    {
        title: 'Beta App',
        date: '2022',
        description: 'A mobile-first social platform for connecting local enthusiasts.',
        tech: ['React Native', 'Firebase'],
        points: ['Location-based matching', 'Instant messaging'],
        link: 'https://example.com/beta-app',
        isFeatured: true,
    },
];

export const EDUCATION = [
    {
        degree: 'Master of Science in Computer Science',
        school: 'University of Tech',
        year: '2020',
    },
    {
        degree: 'Bachelor of Science in Information Technology',
        school: 'State University',
        year: '2018',
    },
];

export const CONTENT_TYPES = {
    NOTE: 'note',
    EXPERIENCE: 'experience',
    PROJECT: 'project',
    EDUCATION: 'education',
    SKILL: 'skill',
    CERTIFICATION: 'certification',
    AWARD: 'award',
    STRENGTH: 'strength',
    LANGUAGE: 'language',
    TESTIMONIAL: 'testimonial',
};

export const PUBLICATION_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
};

export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 211,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
    GENERIC: 'Something went wrong. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.',
};

export const SUCCESS_MESSAGES = {
    GENERIC: 'Operation completed successfully.',
    SAVED: 'Changes saved successfully.',
    DELETED: 'Resource deleted successfully.',
};

export const PATTERNS = {
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    INPUT: 'yyyy-MM-dd',
};

export const CACHE_KEYS = {
    SETTINGS: 'app-settings',
    PROFILE: 'user-profile',
};
