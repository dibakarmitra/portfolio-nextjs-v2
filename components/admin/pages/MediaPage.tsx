import React, { useState, useRef } from 'react';
import useSWR from 'swr';
import { MediaItem } from '@/types';
import { DeleteConfirmDialog } from '@/components/admin/ui/DeleteConfirmDialog';
import { Pagination } from '@/components/admin/ui/Pagination';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useSortAndFilter } from '@/hooks/useSortAndFilter';
import {
    Upload,
    Trash2,
    Link,
    File,
    Image as ImageIcon,
    Check,
    Edit2,
    X,
    Save,
    Calendar,
    Database,
    FileText,
    FileCode,
    FileArchive,
    Music,
    Video,
    ExternalLink,
    Download as DownloadIcon,
    Loader2,
    Eye,
} from 'lucide-react';

interface MediaPageProps {
    onUpload: (files: MediaItem[]) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, data: Partial<MediaItem>) => void;
}

export const MediaPage: React.FC<MediaPageProps> = ({ onUpload, onDelete, onUpdate }) => {
    const { data, error, isLoading, mutate } = useSWR<{
        success: boolean;
        data: { files: MediaItem[] };
    }>('/api/media', async (url: string) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
            return { success: true, data: { files: result.data.files } };
        }
        return result;
    });

    const files = data?.success && data?.data?.files ? data.data.files : [];

    const {
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        sortBy,
        setSortBy,
        currentItems: currentFiles,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useSortAndFilter(files, {
        searchFields: ['name', 'alt', 'caption'],
        filterField: 'type',
        itemsPerPage: 8,
        initialSort: 'newest',
    });

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        fileId: string | null;
        fileName: string;
    }>({ isOpen: false, fileId: null, fileName: '' });

    const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
    const [editName, setEditName] = useState('');
    const [editExtension, setEditExtension] = useState('');
    const [editAlt, setEditAlt] = useState('');
    const [editCaption, setEditCaption] = useState('');
    const [imageDimensions, setImageDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-red-500">Failed to load media files. Please try again.</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Loading media files...</span>
                </div>
            </div>
        );
    }

    const handleCopy = (id: string, url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const openDeleteDialog = (file: MediaItem) => {
        setDeleteDialog({
            isOpen: true,
            fileId: file.id,
            fileName: file.name,
        });
    };

    const closeDeleteDialog = () => {
        setDeleteDialog({
            isOpen: false,
            fileId: null,
            fileName: '',
        });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.fileId) return;

        setDeletingId(deleteDialog.fileId);
        try {
            const response = await fetch(`/api/media/${deleteDialog.fileId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                mutate(
                    (
                        currentData: { success: boolean; data: { files: MediaItem[] } } | undefined
                    ) => {
                        if (!currentData?.success) return currentData;
                        return {
                            ...currentData,
                            data: {
                                files: currentData.data.files.filter(
                                    (f: MediaItem) => f.id !== deleteDialog.fileId
                                ),
                            },
                        };
                    },
                    false
                );

                onDelete(deleteDialog.fileId);
                closeDeleteDialog();
            } else {
                const errorText = await response.text();
                console.error('Failed to delete file:', response.status, errorText);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploading(true);
            const files = Array.from(e.target.files);

            try {
                const uploadPromises = files.map(async (file, index) => {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch('/api/media', {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            return { ...result.data.file, originalIndex: index };
                        }
                    }
                    return null;
                });

                const uploadedFiles = (await Promise.all(uploadPromises)).filter(
                    (file): file is MediaItem => file !== null
                );

                mutate(
                    (
                        currentData: { success: boolean; data: { files: MediaItem[] } } | undefined
                    ) => {
                        if (!currentData?.success) return currentData;
                        return {
                            ...currentData,
                            data: {
                                files: [...uploadedFiles, ...currentData.data.files],
                            },
                        };
                    },
                    false
                );

                onUpload(uploadedFiles);

                if (fileInputRef.current) fileInputRef.current.value = '';
            } catch (error) {
                console.error('Upload error:', error);
            } finally {
                setUploading(false);
            }
        }
    };

    const openEdit = (item: MediaItem) => {
        setEditingItem(item);

        const lastDotIndex = item.name.lastIndexOf('.');
        if (lastDotIndex !== -1 && lastDotIndex > 0) {
            setEditName(item.name.substring(0, lastDotIndex));
            setEditExtension(item.name.substring(lastDotIndex));
        } else {
            setEditName(item.name);
            setEditExtension('');
        }

        setEditAlt(item.alt || '');
        setEditCaption(item.caption || '');
        setImageDimensions(null);
    };

    const closeEdit = () => {
        setEditingItem(null);
        setImageDimensions(null);
        setEditName('');
        setEditExtension('');
        setEditAlt('');
        setEditCaption('');
    };

    const saveEdit = async () => {
        if (editingItem && editName.trim()) {
            const fullName = `${editName.trim()}${editExtension}`;
            setUpdatingId(editingItem.id);

            try {
                const response = await fetch(`/api/media/${editingItem.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: fullName,
                        alt: editAlt,
                        caption: editCaption,
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        onUpdate(editingItem.id, result.data.file);
                        closeEdit();
                    } else {
                        console.error(
                            'Failed to update file:',
                            result.error?.message || 'Unknown error'
                        );
                    }
                } else {
                    const errorText = await response.text();
                    console.error('Failed to update file:', response.status, errorText);
                }
            } catch (error) {
                console.error('Error updating file:', error);
            } finally {
                setUpdatingId(null);
                closeEdit();
            }
        }
    };

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext || ''))
            return <FileText size={24} className="text-zinc-400" />;
        if (['js', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'php'].includes(ext || ''))
            return <FileCode size={24} className="text-zinc-400" />;
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || ''))
            return <FileArchive size={24} className="text-zinc-400" />;
        if (['mp3', 'wav', 'ogg', 'flac'].includes(ext || ''))
            return <Music size={24} className="text-zinc-400" />;
        if (['mp4', 'mov', 'avi', 'webm'].includes(ext || ''))
            return <Video size={24} className="text-zinc-400" />;
        return <File size={24} className="text-zinc-400" />;
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Media Library"
                description="Manage images and files for your content."
                action={
                    <div>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center justify-center px-4 py-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={16} className="mr-2" />
                                    Upload Files
                                </>
                            )}
                        </button>
                    </div>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search media files..."
                filterValue={filterStatus}
                onFilterChange={setFilterStatus}
                filterOptions={[
                    { label: 'All', value: 'all' },
                    { label: 'Images', value: 'image' },
                    { label: 'Files', value: 'file' },
                ]}
                sortValue={sortBy}
                onSortChange={setSortBy}
                sortOptions={[
                    { label: 'Newest First', value: 'newest' },
                    { label: 'Oldest First', value: 'oldest' },
                    { label: 'File Size', value: 'size' },
                ]}
            />

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-950/50">
                                <th className="px-6 py-4">File Details</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {currentFiles.map((file, index) => (
                                <tr
                                    key={`${file.id}-${index}`}
                                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                                >
                                    <td className="px-6 py-4 max-w-md">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-12 shrink-0 rounded overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                {file.type === 'image' ? (
                                                    <img
                                                        src={file.url}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-zinc-400 flex items-center justify-center h-full">
                                                        {getFileIcon(file.name)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                                    {file.name}
                                                </span>
                                                {file.alt && (
                                                    <span className="text-xs text-zinc-500 mt-1 line-clamp-1">
                                                        {file.alt}
                                                    </span>
                                                )}
                                                {file.caption && (
                                                    <span className="text-xs text-zinc-500 mt-1 line-clamp-1">
                                                        {file.caption}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 capitalize">
                                            {file.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                                            <Database
                                                size={14}
                                                className="mr-2 text-zinc-400 dark:text-zinc-600"
                                            />
                                            {file.size}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                                            <Calendar
                                                size={14}
                                                className="mr-2 text-zinc-400 dark:text-zinc-600"
                                            />
                                            {new Date(file.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleCopy(file.id, file.url)}
                                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                                title="Copy URL"
                                            >
                                                {copiedId === file.id ? (
                                                    <Check size={16} />
                                                ) : (
                                                    <Link size={16} />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => window.open(file.url, '_blank')}
                                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                                title="View File"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => openEdit(file)}
                                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                title="Edit Details"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteDialog(file)}
                                                className={`p-2 rounded transition-colors ${
                                                    deletingId === file.id
                                                        ? 'text-zinc-400 cursor-not-allowed'
                                                        : 'text-zinc-400 hover:text-red-600 dark:hover:text-red-400'
                                                }`}
                                                title={
                                                    deletingId === file.id
                                                        ? 'Deleting...'
                                                        : 'Delete'
                                                }
                                                disabled={deletingId === file.id}
                                            >
                                                {deletingId === file.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {currentFiles.length === 0 && (
                    <EmptyState
                        icon={ImageIcon}
                        message="No media files found matching your filters."
                    />
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNext={nextPage}
                    onPrev={prevPage}
                    className="p-4"
                />
            </div>

            {/* Edit Dialog */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-950 w-full max-w-6xl h-[700px] rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row shadow-2xl overflow-hidden">
                        {/* Left: Preview */}
                        <div className="w-full md:w-1/2 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-8">
                            {/* Checkered pattern background for transparency visualization */}
                            <div
                                className="absolute inset-0 opacity-5 pointer-events-none"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
                                    backgroundSize: '20px 20px',
                                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                                }}
                            />

                            {/* Actions Overlay */}
                            <div className="absolute top-4 right-4 flex gap-2 z-20">
                                <a
                                    href={editingItem.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-white/10 dark:bg-black/30 hover:bg-white/20 dark:hover:bg-black/50 text-zinc-600 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-md backdrop-blur-md transition-colors"
                                    title={`Open Original: ${editingItem.url}`}
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <a
                                    href={editingItem.url}
                                    download
                                    className="p-2 bg-white/10 dark:bg-black/30 hover:bg-white/20 dark:hover:bg-black/50 text-zinc-600 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-md backdrop-blur-md transition-colors"
                                    title="Download"
                                >
                                    <DownloadIcon size={16} />
                                </a>
                            </div>

                            {editingItem.type === 'image' ? (
                                <img
                                    src={editingItem.url}
                                    alt={editingItem.name}
                                    className="max-w-full max-h-full object-contain shadow-2xl rounded-sm relative z-10"
                                    onLoad={(e) =>
                                        setImageDimensions({
                                            width: e.currentTarget.naturalWidth,
                                            height: e.currentTarget.naturalHeight,
                                        })
                                    }
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-zinc-400 relative z-10">
                                    {getFileIcon(editingItem.name)}
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                        {editingItem.name}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right: Edit Form */}
                        <div className="w-full md:w-1/2 flex flex-col bg-white dark:bg-zinc-950">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                                    Edit Media Details
                                </h3>
                                <button
                                    onClick={closeEdit}
                                    className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                            File Name
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className={`flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-colors ${editExtension ? 'rounded-l-md border-r-0' : 'rounded-md'}`}
                                                placeholder="Filename"
                                            />
                                            {editExtension && (
                                                <span className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-r-md px-3 py-2.5 text-sm text-zinc-500 font-mono flex items-center">
                                                    {editExtension}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {editingItem.type === 'image' && (
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase flex justify-between">
                                                Alt Text
                                                <span className="text-[10px] normal-case text-zinc-400 font-normal">
                                                    For accessibility & SEO
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={editAlt}
                                                onChange={(e) => setEditAlt(e.target.value)}
                                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-colors"
                                                placeholder="Describe the image..."
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                            Caption / Description
                                        </label>
                                        <textarea
                                            value={editCaption}
                                            onChange={(e) => setEditCaption(e.target.value)}
                                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 resize-none h-24 leading-relaxed transition-colors"
                                            placeholder="Add context or details..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
                                    <h4 className="text-xs font-semibold text-zinc-500 mb-3 uppercase">
                                        File Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                            <Database size={14} className="mr-2 opacity-70" />
                                            {editingItem.size}
                                        </div>
                                        <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                            <Calendar size={14} className="mr-2 opacity-70" />
                                            {new Date(editingItem.date).toLocaleDateString()}
                                        </div>
                                        {imageDimensions && (
                                            <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                                <ImageIcon size={14} className="mr-2 opacity-70" />
                                                {imageDimensions.width} x {imageDimensions.height}{' '}
                                                px
                                            </div>
                                        )}
                                        <div className="col-span-2 flex items-center text-sm text-zinc-600 dark:text-zinc-400 break-all">
                                            <Link size={14} className="mr-2 opacity-70 shrink-0" />
                                            <a
                                                href={editingItem.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="truncate hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline"
                                                title={editingItem.url}
                                            >
                                                {editingItem.url}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
                                <button
                                    onClick={closeEdit}
                                    className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveEdit}
                                    disabled={updatingId === editingItem?.id}
                                    className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-600 dark:disabled:bg-zinc-700 rounded-md shadow-lg shadow-zinc-900/10 dark:shadow-white/5 transition-colors flex items-center"
                                >
                                    {updatingId === editingItem?.id ? (
                                        <>
                                            <Loader2 size={16} className="mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} className="mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDelete}
                title="Delete Media File"
                message={`Are you sure you want to delete "${deleteDialog.fileName}"? This action cannot be undone.`}
            />
        </div>
    );
};
