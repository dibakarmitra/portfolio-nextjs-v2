'use client';

import React, { useState } from 'react';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { AlertCircle } from 'lucide-react';

interface FormErrors {
    [key: string]: string;
}

interface DynamicFormProps {
    title?: string;
    description?: string;
    fields: {
        name: string;
        label: string;
        type?: 'text' | 'email' | 'number' | 'textarea' | 'date';
        placeholder?: string;
        required?: boolean;
        validation?: (value: string) => string | null;
    }[];
    onSubmit: (values: Record<string, string>) => Promise<void>;
    submitText?: string;
    isLoading?: boolean;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
    title,
    description,
    fields,
    onSubmit,
    submitText = 'Submit',
    isLoading = false,
}) => {
    const [values, setValues] = useState<Record<string, string>>(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
    );
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitError, setSubmitError] = useState('');

    const handleChange = (name: string, value: string) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        fields.forEach((field) => {
            const value = values[field.name];

            if (field.required && !value.trim()) {
                newErrors[field.name] = `${field.label} is required`;
                return;
            }

            if (value && field.validation) {
                const error = field.validation(value);
                if (error) {
                    newErrors[field.name] = error;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(values);
            setValues(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {title && <h2 className="text-xl font-bold text-zinc-100">{title}</h2>}
            {description && <p className="text-sm text-zinc-400">{description}</p>}

            {submitError && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertCircle size={20} className="text-red-500" />
                    <p className="text-sm text-red-200">{submitError}</p>
                </div>
            )}

            <div className="space-y-4">
                {fields.map((field) => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium text-zinc-200 mb-2">
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {field.type === 'textarea' ? (
                            <textarea
                                value={values[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                disabled={isLoading}
                                rows={4}
                                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <FormField
                                label={field.label}
                                type={field.type || 'text'}
                                value={values[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                disabled={isLoading}
                            />
                        )}

                        {errors[field.name] && (
                            <p className="mt-1 text-xs text-red-400">{errors[field.name]}</p>
                        )}
                    </div>
                ))}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Submitting...' : submitText}
            </Button>
        </form>
    );
};
