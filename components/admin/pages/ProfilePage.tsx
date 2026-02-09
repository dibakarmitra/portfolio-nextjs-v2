import React, { useState, useCallback, useMemo } from 'react';
import { Save, User, Globe, Github, Linkedin, Mail, Phone, Briefcase, Wand2, Twitter } from 'lucide-react';
import { UserProfile } from '@/types';
import { FormField } from '@/components/admin/ui/FormField';
import { ImageUpload } from '@/components/admin/ui/ImageUpload';
import { polishText } from '@/services/geminiService';

interface ProfilePageProps {
    profile: UserProfile;
    onSave: (profile: UserProfile) => void;
    onDiscard: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = React.memo(
    ({ profile, onSave, onDiscard }) => {
        const [formData, setFormData] = useState<UserProfile>(profile);
        const [isAiLoading, setIsAiLoading] = useState(false);
        const [isAvatarUploading, setIsAvatarUploading] = useState(false);

        // memoize social links object to prevent unnecessary recreations
        const socialLinks = useMemo(() => formData.socials, [formData.socials]);

        // memoize initial values for form fields to prevent unnecessary recalculations
        const initialValues = useMemo(
            () => ({
                displayName: formData.displayName,
                role: formData.role,
                location: formData.location,
                availability: formData.availability,
                avatarUrl: formData.avatarUrl,
                bio: formData.bio,
                email: formData.email,
                phone: formData.phone,
                siteUrl: formData.siteUrl,
                resumeUrl: formData.resumeUrl,
            }),
            [formData]
        );

        const handleChange = useCallback((field: keyof UserProfile, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }, []);

        const handleSocialChange = useCallback(
            (field: keyof UserProfile['socials'], value: string) => {
                setFormData((prev) => ({
                    ...prev,
                    socials: { ...prev.socials, [field]: value },
                }));
            },
            []
        );

        const handleAiPolishBio = useCallback(async () => {
            if (!formData.bio?.trim()) return;

            setIsAiLoading(true);
            try {
                const polishedBio = await polishText(formData.bio);
                setFormData((prev) => ({ ...prev, bio: polishedBio }));
            } catch (error) {
                console.error('Error polishing bio:', error);
            } finally {
                setIsAiLoading(false);
            }
        }, [formData.bio]);

        const handleAvatarUpload = useCallback(async (file: File): Promise<string> => {
            setIsAvatarUploading(true);
            try {
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formDataUpload,
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        return result.data.file.url;
                    } else {
                        throw new Error(result.error?.message || 'Upload failed');
                    }
                } else {
                    throw new Error('Upload failed');
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
                throw error;
            } finally {
                setIsAvatarUploading(false);
            }
        }, []);

        // memoize form sections to prevent unnecessary re-renders
        const ProfileSection = useMemo(
            () => (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                            <User className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            Public Profile
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <FormField
                                label="Display Name"
                                value={initialValues.displayName}
                                onChange={(e) => handleChange('displayName', e.target.value)}
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <FormField
                                label="Professional Role"
                                value={initialValues.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                placeholder="e.g. Full Stack Developer"
                            />
                        </div>
                        <div>
                            <FormField
                                label="Location"
                                value={initialValues.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                placeholder="City, Country"
                            />
                        </div>
                        <div>
                            <FormField
                                label="Availability"
                                value={initialValues.availability}
                                onChange={(e) => handleChange('availability', e.target.value)}
                                placeholder="e.g. Available for freelance work"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <FormField
                            label="Bio"
                            value={initialValues.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            placeholder="Tell us about yourself..."
                            component="textarea"
                            rows={4}
                        />
                        <div className="mt-2 flex justify-end">
                            <button
                                onClick={handleAiPolishBio}
                                disabled={isAiLoading || !formData.bio?.trim()}
                                className="flex items-center px-3 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded hover:bg-purple-200 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-50"
                            >
                                <Wand2
                                    size={12}
                                    className={`mr-1.5 ${isAiLoading ? 'animate-spin' : ''}`}
                                />
                                AI Polish
                            </button>
                        </div>
                    </div>

                    <div className="mt-6">
                        <ImageUpload
                            label="Profile Avatar"
                            value={initialValues.avatarUrl}
                            onChange={(url) => handleChange('avatarUrl', url)}
                            onUpload={handleAvatarUpload}
                            isUploading={isAvatarUploading}
                        />
                    </div>
                </div>
            ),
            [
                initialValues,
                handleAiPolishBio,
                handleAvatarUpload,
                isAiLoading,
                isAvatarUploading,
                formData.bio,
            ]
        );

        const ContactSection = useMemo(
            () => (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
                            <Mail className="text-green-600 dark:text-green-400 w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            Contact Information
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <FormField
                                label="Email"
                                type="email"
                                value={initialValues.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div>
                            <FormField
                                label="Phone"
                                type="tel"
                                value={initialValues.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>
                </div>
            ),
            [initialValues]
        );

        const SocialSection = useMemo(
            () => (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                            <Github className="text-purple-600 dark:text-purple-400 w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            Social Links
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                            <Github size={14} className="text-zinc-400 mr-2" />
                            <input
                                type="text"
                                value={socialLinks.github}
                                onChange={(e) => handleSocialChange('github', e.target.value)}
                                className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                placeholder="GitHub username"
                            />
                        </div>
                        <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                            <Linkedin size={14} className="text-zinc-400 mr-2" />
                            <input
                                type="text"
                                value={socialLinks.linkedin}
                                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                placeholder="LinkedIn profile"
                            />
                        </div>
                        <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                            <Twitter size={14} className="text-zinc-400 mr-2" />
                            <input
                                type="text"
                                value={socialLinks.x}
                                onChange={(e) => handleSocialChange('x', e.target.value)}
                                className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                placeholder="Twitter/X profile"
                            />
                        </div>
                        <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                            <Globe size={14} className="text-zinc-400 mr-2" />
                            <input
                                type="text"
                                value={socialLinks.website}
                                onChange={(e) => handleSocialChange('website', e.target.value)}
                                className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                placeholder="Personal website"
                            />
                        </div>
                    </div>
                </div>
            ),
            [socialLinks, handleSocialChange]
        );

        const SiteSection = useMemo(
            () => (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
                            <Globe className="text-orange-600 dark:text-orange-400 w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            Site Configuration
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                Personal Website
                            </label>
                            <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                <Globe size={14} className="text-zinc-400 mr-2" />
                                <input
                                    type="text"
                                    value={initialValues.siteUrl}
                                    onChange={(e) => handleChange('siteUrl', e.target.value)}
                                    className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                Resume PDF Link
                            </label>
                            <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                <Briefcase size={14} className="text-zinc-400 mr-2" />
                                <input
                                    type="text"
                                    value={initialValues.resumeUrl}
                                    onChange={(e) => handleChange('resumeUrl', e.target.value)}
                                    className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                    placeholder="Link to your resume PDF"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ),
            [initialValues, handleChange]
        );

        const ActionButtons = useMemo(
            () => (
                <div className="flex justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={() => {
                            setFormData(profile);
                            onDiscard();
                        }}
                        className="px-6 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                        Discard Changes
                    </button>
                    <button
                        onClick={() => {
                            onSave(formData);
                        }}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-950 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                    >
                        Save Profile
                    </button>
                </div>
            ),
            [profile, onDiscard, onSave, formData]
        );

        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        Profile Settings
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        Manage your personal information, social links, and site configuration.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {ProfileSection}
                    {ContactSection}
                    {SocialSection}
                    {SiteSection}
                </div>

                {ActionButtons}
            </div>
        );
    }
);
