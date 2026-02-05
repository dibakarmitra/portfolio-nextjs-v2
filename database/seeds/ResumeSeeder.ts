import { db } from '@/config/database';
import type { Knex } from 'knex';

export async function seed(knex: Knex) {
    await knex('resume_contents').del();

    const now = new Date();

    const resumeContents = [
        // experience
        {
            title: 'Senior Software Engineer',
            type: 'experience',
            status: 'published',
            date: new Date('2022-01-01'),
            excerpt: 'Led development of scalable web applications using modern technologies.',
            content: `- Developed and maintained backend systems using Node.js and Python.
                - Designed and implemented RESTful APIs and microservices.
                - Collaborated with cross-functional teams to deliver high-quality software solutions.`,
            company: 'TechCorp Solutions',
            location: 'San Francisco, CA',
            end_date: null,
            category: 'Full-Time',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Frontend Developer',
            type: 'experience',
            status: 'published',
            date: new Date('2020-03-01'),
            excerpt:
                'Built responsive web applications using React and modern frontend frameworks.',
            content: `- Developed responsive web applications using React, Vue.js, and Angular.
                - Collaborated with UX/UI designers to implement pixel-perfect interfaces.
                - Optimized application performance and improved user experience.
                - Implemented automated testing and CI/CD pipelines.`,
            company: 'Digital Innovations Inc.',
            location: 'New York, NY',
            end_date: '2022-01-01',
            category: 'Full-Time',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Freelance Web Developer',
            type: 'experience',
            status: 'published',
            date: new Date('2019-01-01'),
            excerpt: 'Provided custom web development services for small businesses.',
            content: `- Developed custom websites and web applications for clients.
                - Implemented responsive design principles for mobile compatibility.
                - Provided ongoing maintenance and technical support.
                - Managed client relationships and project delivery.`,
            company: 'Freelance Consulting',
            location: 'Remote',
            end_date: '2020-03-01',
            category: 'Freelance',
            created_at: now,
            updated_at: now,
        },

        // projects
        {
            title: 'E-Commerce Platform',
            type: 'project',
            status: 'published',
            date: new Date('2021-06-01'),
            excerpt:
                'Full-featured e-commerce platform with payment integration and inventory management.',
            content: `- Built with React, Node.js, and MongoDB
                - Integrated Stripe payment processing
                - Real-time inventory management system
                - Admin dashboard for product management`,
            live_url: 'https://ecommerce-demo.example.com',
            repo_url: 'https://github.com/johndoe/ecommerce-platform',
            category: 'featured',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Task Management App',
            type: 'project',
            status: 'published',
            date: new Date('2020-09-01'),
            excerpt:
                'Collaborative task management application with real-time updates and team features.',
            content: `- Real-time collaboration with WebSocket
                - Drag-and-drop task organization
                - Team assignment and progress tracking
                - Mobile-responsive design`,
            live_url: 'https://taskmanager.example.com',
            repo_url: 'https://github.com/johndoe/task-manager',
            category: 'featured',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Portfolio Website',
            type: 'project',
            status: 'published',
            date: new Date('2019-05-01'),
            excerpt: 'Modern portfolio website showcasing projects and skills.',
            content: `- Built with Next.js and Tailwind CSS
                - Responsive design for all devices
                - Dark mode support
                - Smooth animations and transitions`,
            live_url: 'https://portfolio.example.com',
            repo_url: 'https://github.com/johndoe/portfolio',
            category: 'other',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Weather Dashboard',
            type: 'project',
            status: 'published',
            date: new Date('2018-12-01'),
            excerpt: 'Interactive weather dashboard with location-based forecasts.',
            content: `- Real-time weather data from OpenWeatherMap API
                - Location detection and geocoding
                - Interactive charts and visualizations
                - Responsive design for mobile and desktop`,
            live_url: 'https://weather.example.com',
            repo_url: 'https://github.com/johndoe/weather-dashboard',
            category: 'other',
            created_at: now,
            updated_at: now,
        },

        // education
        {
            title: 'Master of Computer Science',
            type: 'education',
            status: 'published',
            date: new Date('2018-05-01'),
            excerpt: 'Advanced studies in computer science with focus on software engineering.',
            content:
                'Completed Masters degree with coursework in algorithms, distributed systems, and machine learning.',
            company: 'Stanford University',
            location: 'Stanford, CA',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Bachelor of Science in Computer Engineering',
            type: 'education',
            status: 'published',
            date: new Date('2016-05-01'),
            excerpt:
                'Undergraduate degree in computer engineering with emphasis on software development.',
            content:
                'Graduated with honors, completed capstone project on web application security.',
            company: 'University of California, Berkeley',
            location: 'Berkeley, CA',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'High School Diploma',
            type: 'education',
            status: 'published',
            date: new Date('2012-06-01'),
            excerpt: 'Completed high school education with focus on mathematics and sciences.',
            content: 'Graduated with distinction, participated in science fair competitions.',
            company: 'Lincoln High School',
            location: 'San Jose, CA',
            created_at: now,
            updated_at: now,
        },

        // skills
        {
            title: 'PHP',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'Server-side scripting language',
            content: 'Expert in PHP development with 4+ years of experience.',
            proficiency: 90,
            category: 'Backend',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Laravel',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'PHP Framework',
            content: 'Advanced Laravel development including APIs, queues, and events.',
            proficiency: 95,
            category: 'Backend',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Python',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'Programming language',
            content: 'Python development with Django framework.',
            proficiency: 75,
            category: 'Backend',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Django',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'Python Web Framework',
            content: 'Experience building web applications with Django.',
            proficiency: 70,
            category: 'Backend',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'JavaScript',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'Programming language',
            content: 'Modern JavaScript including ES6+ features.',
            proficiency: 80,
            category: 'Frontend',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'React',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'JavaScript Library',
            content: 'React development with hooks, context, and modern patterns.',
            proficiency: 75,
            category: 'Frontend',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'MySQL',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'Relational Database',
            content: 'Database design, optimization, and complex queries.',
            proficiency: 85,
            category: 'Database',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'PostgreSQL',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'Relational Database',
            content: 'Advanced PostgreSQL including JSON operations.',
            proficiency: 80,
            category: 'Database',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'MongoDB',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'NoSQL Database',
            content: 'Document-based database design and queries.',
            proficiency: 70,
            category: 'Database',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Docker',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'Containerization',
            content: 'Container management and Docker Compose.',
            proficiency: 65,
            category: 'DevOps',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'AWS',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'Cloud Platform',
            content: 'EC2, S3, RDS, and Lambda services.',
            proficiency: 60,
            category: 'DevOps',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Git',
            type: 'skill',
            status: 'published',
            date: now,
            excerpt: 'Version Control',
            content: 'Git workflows, branching strategies, and collaboration.',
            proficiency: 90,
            category: 'Tools',
            created_at: now,
            updated_at: now,
        },

        // strengths
        {
            title: 'Problem Solving',
            type: 'strength',
            status: 'published',
            date: now,
            excerpt: 'Analytical approach to complex challenges',
            content:
                'Strong analytical skills to break down complex problems into manageable solutions.',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Backend Architecture',
            type: 'strength',
            status: 'published',
            date: now,
            excerpt: 'Designing scalable backend systems',
            content: 'Experience in designing and implementing scalable backend architectures.',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Database Optimization',
            type: 'strength',
            status: 'published',
            date: now,
            excerpt: 'Query and schema optimization',
            content: 'Expertise in optimizing database queries and schema design for performance.',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'API Design',
            type: 'strength',
            status: 'published',
            date: now,
            excerpt: 'RESTful API development',
            content: 'Designing clean, well-documented RESTful APIs.',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Team Collaboration',
            type: 'strength',
            status: 'published',
            date: now,
            excerpt: 'Effective teamwork',
            content:
                'Excellent communication and collaboration skills within cross-functional teams.',
            created_at: now,
            updated_at: now,
        },

        // languages
        {
            title: 'English',
            type: 'language',
            status: 'published',
            date: now,
            excerpt: 'Professional working proficiency',
            content: 'Fluent in reading, writing, and speaking English.',
            proficiency_level: 'fluent',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Bengali',
            type: 'language',
            status: 'published',
            date: now,
            excerpt: 'Native language',
            content: 'Native speaker of Bengali.',
            proficiency_level: 'native',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Hindi',
            type: 'language',
            status: 'published',
            date: now,
            excerpt: 'Fluent proficiency',
            content: 'Fluent in Hindi for daily communication.',
            proficiency_level: 'fluent',
            created_at: now,
            updated_at: now,
        },

        // certifications
        {
            title: 'AWS Certified Cloud Practitioner',
            type: 'certification',
            status: 'published',
            date: new Date('2023-06-01'),
            excerpt: 'Foundational cloud skills certification',
            content: 'Demonstrated foundational understanding of AWS Cloud services.',
            issuer: 'Amazon Web Services',
            verification_url: 'https://aws.amazon.com/verification',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Laravel Certified Developer',
            type: 'certification',
            status: 'published',
            date: new Date('2022-03-01'),
            excerpt: 'Official Laravel certification',
            content: 'Certified expertise in Laravel framework development.',
            issuer: 'Laravel',
            verification_url: 'https://certification.laravel.com',
            created_at: now,
            updated_at: now,
        },

        // testimonials
        {
            title: 'Great Developer',
            type: 'testimonial',
            status: 'published',
            date: new Date('2024-01-15'),
            excerpt: 'Dibakar is an exceptional developer.',
            content:
                'Dibakar is an exceptional developer who consistently delivers high-quality code. His attention to detail and problem-solving skills make him an invaluable team member.',
            person_name: 'Rahul Sharma',
            person_position: 'CTO at TechStartup',
            person_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
            created_at: now,
            updated_at: now,
        },
        {
            title: 'Reliable and Professional',
            type: 'testimonial',
            status: 'published',
            date: new Date('2023-08-20'),
            excerpt: 'Working with Dibakar was a pleasure.',
            content:
                'Working with Dibakar was a pleasure. He understood our requirements perfectly and delivered the project on time with excellent quality.',
            person_name: 'Priya Patel',
            person_position: 'Product Manager at Taxolawgy',
            person_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
            created_at: now,
            updated_at: now,
        },

        // awards
        {
            title: 'Employee of the Quarter',
            type: 'award',
            status: 'published',
            date: new Date('2023-09-01'),
            excerpt: 'Recognized for outstanding performance',
            content:
                'Awarded Employee of the Quarter for exceptional contributions to the team and project delivery.',
            issuer: 'Taxolawgy Inc.',
            created_at: now,
            updated_at: now,
        },
    ];

    await db('resume_contents').insert(resumeContents);
    console.log('Resume contents seeded successfully');
}
