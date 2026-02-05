import { useState, useCallback, ChangeEvent } from 'react';

export interface FormErrors {
    [key: string]: string;
}

interface UseFormOptions<T> {
    initialValues: T;
    onSubmit?: (values: T) => Promise<void> | void;
    validate?: (values: T) => FormErrors;
}

export function useForm<T extends Record<string, any>>({
    initialValues,
    onSubmit,
    validate,
}: UseFormOptions<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as any);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value, type } = e.target;
            const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

            setValues((prev) => ({
                ...prev,
                [name]: finalValue,
            }));
        },
        []
    );

    const handleBlur = useCallback((e: ChangeEvent<any>) => {
        const { name } = e.target;
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (validate) {
                const newErrors = validate(values);
                setErrors(newErrors);

                if (Object.keys(newErrors).length > 0) {
                    return;
                }
            }

            if (onSubmit) {
                setIsSubmitting(true);
                try {
                    await onSubmit(values);
                } finally {
                    setIsSubmitting(false);
                }
            }
        },
        [values, validate, onSubmit]
    );

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({} as any);
    }, [initialValues]);

    const setFieldValue = useCallback((field: keyof T, value: any) => {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        setFieldValue,
        setValues,
    };
}
