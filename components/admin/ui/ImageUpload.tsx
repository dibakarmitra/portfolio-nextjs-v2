'use client';
import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onUpload?: (file: File) => Promise<string>;
    label?: string;
    id?: string;
    isUploading?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    onUpload,
    label = 'Image',
    id = 'image-upload',
    isUploading = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localUploading, setLocalUploading] = useState(false);

    const uploading = isUploading || localUploading;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUpload) {
            setLocalUploading(true);
            try {
                const url = await onUpload(file);
                onChange(url);
            } catch (error) {
                console.error('Upload failed', error);
            } finally {
                setLocalUploading(false);
            }
        }
    };

    return (
        <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                {label}
            </label>
            <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors relative group">
                    <ImageIcon size={14} className="text-zinc-400 mr-2" />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                        placeholder="https://... or upload"
                    />
                    {value && (
                        <button
                            onClick={() => onChange('')}
                            className="p-1 hover:text-red-500 text-zinc-400"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {onUpload && (
                    <>
                        <input
                            type="file"
                            id={id}
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 size={14} className="mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={14} className="mr-2" />
                                    Upload
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
