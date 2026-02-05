'use client';

import React, { useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Lock,
    Mail,
    ArrowRight,
    Loader2,
    ShieldCheck,
    AlertCircle,
    ArrowLeft,
    CheckCircle,
} from 'lucide-react';
import { FormField } from '@/components/admin/ui/FormField';
import { useContextState } from '@/context';

type AuthView = 'login' | 'forgot' | 'sent';

export default function LoginPage() {
    const { setIsAuthenticated } = useContextState();
    const router = useRouter();
    const [authView, setAuthView] = useState<AuthView>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (!res || res.error) {
            setError('Invalid email or password');
            setIsLoading(false);
            return;
        }

        await getSession();

        setIsAuthenticated(true);
        router.push('/admin/dashboard');
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // logic need to add

        setIsLoading(false);
        setAuthView('sent');
    };

    const renderContent = () => {
        switch (authView) {
            case 'login':
                return (
                    <>
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20">
                                <ShieldCheck className="text-white w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                Welcome Back
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
                                Sign in to manage your portfolio content.
                            </p>
                        </div>

                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <FormField
                                label="Email Address"
                                type="email"
                                icon={Mail}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                autoComplete="username"
                            />

                            <FormField
                                label="Password"
                                type="password"
                                icon={Lock}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />

                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 cursor-pointer select-none group">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded text-blue-600 border-zinc-100 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500"
                                    />
                                    <span className="text-xs text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">
                                        Remember me
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setError('');
                                        setAuthView('forgot');
                                    }}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg mt-6 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800/50 text-center">
                            <p className="text-xs text-zinc-500 dark:text-zinc-600">
                                Demo Credentials:{' '}
                                <span className="font-mono text-zinc-700 dark:text-zinc-400">
                                    admin@portfolio.dev
                                </span>{' '}
                                /{' '}
                                <span className="font-mono text-zinc-700 dark:text-zinc-400">
                                    any
                                </span>
                            </p>
                        </div>
                    </>
                );

            case 'forgot':
                return (
                    <>
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
                                <Lock className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                Reset Password
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 text-center">
                                Enter your email address and we'll send you instructions to reset
                                your password.
                            </p>
                        </div>

                        <form onSubmit={handleForgotSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <FormField
                                label="Email Address"
                                type="email"
                                icon={Mail}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg mt-6 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        <span>Sending Link...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Reset Link</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setError('');
                                    setAuthView('login');
                                }}
                                className="w-full text-zinc-600 dark:text-zinc-400 font-medium py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Login</span>
                            </button>
                        </form>
                    </>
                );

            case 'sent':
                return (
                    <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="text-green-600 dark:text-green-400 w-8 h-8" />
                        </div>

                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                            Check your email
                        </h1>

                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
                            We have sent a password reset link to <br />
                            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                                {email}
                            </span>
                            .
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setError('');
                                setAuthView('login');
                            }}
                            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Login</span>
                        </button>

                        <p className="text-xs text-zinc-400 mt-6">
                            Did not receive the email?{' '}
                            <button
                                onClick={() => setAuthView('forgot')}
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Click to resend
                            </button>
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
                {renderContent()}
            </div>
        </div>
    );
}
