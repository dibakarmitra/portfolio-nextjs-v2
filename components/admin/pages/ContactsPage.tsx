'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Calendar, User, MessageSquare } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { PageLoading } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';
import { ActionButtons } from '../ui/ActionButtons';
import { useContextState } from '@/context';
import { ContactMessage } from '@/services/contactsService';

export const ContactsPage: React.FC = () => {
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast, setIsDeleteDialogOpen, setDeleteId } = useContextState();

    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/contacts');
            const result = await response.json();
            if (result.success) {
                setContacts(result.data);
            } else {
                addToast(result.error?.message || 'Failed to fetch contacts', 'error');
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
            addToast('Failed to load contacts', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    // Note: The actual deletion is handled in AdminLayout via the global handleDeleteConfirm
    // but since that logic expects string UUIDs for notes or integer IDs for resume,
    // we might need to ensure it handles '/api/contacts' as well, or we handle it here.
    // Looking at AdminLayout, it currently only handles /api/resume and /api/notes.
    // Let's create a local delete handler for simplicity or update AdminLayout.
    // For now, let's update AdminLayout to be more generic or just handle it here.

    // I will update AdminLayout later if needed, but for now I'll just use a local handler
    // to be safe and avoid breaking existing logic. Actually, let's use a local one for now.

    const deleteContact = async (id: number) => {
        try {
            const response = await fetch(`/api/contacts?id=${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.success) {
                setContacts((prev) => prev.filter((c) => c.id !== id));
                addToast('Contact message deleted', 'success');
            } else {
                addToast(result.error?.message || 'Failed to delete', 'error');
            }
        } catch (error) {
            addToast('Failed to delete contact', 'error');
        }
    };

    if (isLoading) return <PageLoading />;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Contact Messages"
                description="View and manage messages from your portfolio contact form."
            />

            {contacts.length === 0 ? (
                <EmptyState
                    message="When users contact you through your website, their messages will appear here."
                    icon={Mail}
                />
            ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                                    <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                                        Message
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {contacts.map((contact) => (
                                    <tr
                                        key={contact.id}
                                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                                            {new Date(contact.created_at!).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                                            {contact.name}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {contact.email}
                                        </td>
                                        <td
                                            className="px-6 py-4 text-zinc-600 dark:text-zinc-400 max-w-xs truncate"
                                            title={contact.message}
                                        >
                                            {contact.message}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => deleteContact(contact.id!)}
                                                className="p-2 text-zinc-400 hover:text-red-500 transition-colors inline-flex"
                                                title="Delete Message"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
