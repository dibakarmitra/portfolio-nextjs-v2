// sections (page content areas)
export { default as Hero } from './sections/Hero';
export { default as About } from './sections/About';
export { default as Skills } from './sections/Skills';
export { default as Projects } from './sections/Projects';
export { default as Notes } from './sections/Notes';
export { default as Experience } from './sections/Experience';
export { default as Education } from './sections/Education';
export { default as Contact } from './sections/Contact';

// common (layout & navigation)
export { default as Navigation } from './common/Navigation';
export { default as Footer } from './common/Footer';

// ui (utilities & primitives)
export { default as Section } from './ui/Section';
export { default as FadeIn } from './ui/FadeIn';
export { default as SplashCursor } from './ui/SplashCursorClient';

// layouts
export { ThemeProvider } from './layouts/ThemeProvider';

// features (feature-specific components)
export { default as AllNotes } from './features/AllNotes';
export { default as AllProjects } from './features/AllProjects';
export { default as NoteDetail } from './features/NoteDetail';
export { default as Resume } from './features/Resume';
export { default as Socials } from './features/Socials';

// error boundaries
export { ErrorBoundary } from './errors/ErrorBoundary';
export { default as ErrorFallback } from './errors/ErrorFallback';
