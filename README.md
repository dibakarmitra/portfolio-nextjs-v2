# Portfolio Next.js V2

A modern, feature-rich portfolio application with an admin panel built with Next.js, TypeScript, and Cloudflare R2 storage. Uses SQLite database with Knex.js for data management.

## Features

- **Admin Dashboard**: Manage all portfolio content with an intuitive admin interface
- **Blog/Notes**: Write and publish blog posts with categories and tags
- **Projects**: Showcase your projects with detailed information
- **Resume**: Display your professional experience, education, skills, and certifications
- **Media Management**: Upload and manage images and other media files to Cloudflare R2 storage
- **SQLite Database**: Local SQLite database for data persistence with Knex.js ORM
- **Dark Mode**: Support for light and dark themes
- **Responsive Design**: Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js 16.1.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Knex.js
- **Storage**: Cloudflare R2
- **Authentication**: NextAuth.js
- **Markdown**: MDX with rehype and remark plugins

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the required environment variables
3. Run `npm install` to install dependencies
4. Run `npm run migrate` to set up the database
5. Run `npm run dev` to start the development server

## Environment Variables

- `AUTH_SECRET`: Authentication secret key
- `CLOUDFLARE_R2_ENDPOINT`: Cloudflare R2 endpoint
- `CLOUDFLARE_R2_ACCESS_KEY_ID`: Cloudflare R2 access key ID
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`: Cloudflare R2 secret access key
- `CLOUDFLARE_R2_BUCKET_NAME`: Cloudflare R2 bucket name
- `CLOUDFLARE_R2_PUBLIC_URL`: Cloudflare R2 public URL
- `GEMINI_API_KEY`: Google Gemini API key (optional for AI features)
- `RESEND_API_KEY`: Resend API key (optional for email features)

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run migrate`: Run database migrations
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
