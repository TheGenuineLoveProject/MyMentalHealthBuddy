/**
 * Form Validation Hook
 * Real-time validation with helpful error messages and auto-save
 */

import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';

interface ValidationRule<T> {
  validator: (value: T) => boolean | Promise<boolean>;
  message: string;
}

interface FieldValidation {
  value: any;
  error: string | null;
  touched: boolean;
  validating: boolean;
}

interface UseFormValidationOptions<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  autoSave?: boolean;
  autoSaveDelay?: number;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  autoSave = false,
  autoSaveDelay = 2000,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Auto-save timer
  useEffect(() => {
    if (!autoSave || !isDirty) return;

    const timer = setTimeout(async () => {
      try {
        setAutoSaveStatus('saving');
        if (onSubmit) {
          await onSubmit(values);
        }
        setAutoSaveStatus('saved');
        setIsDirty(false);
        
        // Reset status after 2 seconds
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch (error) {
        setAutoSaveStatus('error');
        console.error('Auto-save failed:', error);
      }
    }, autoSaveDelay);

    return () => clearTimeout(timer);
  }, [values, autoSave, autoSaveDelay, isDirty, onSubmit]);

  // Validate a single field
  const validateField = useCallback(
    async (name: keyof T, value: any): Promise<string | null> => {
      if (!validationSchema) return null;

      try {
        // Validate the full form with partial data
        const partialData = { ...values, [name]: value };
        await validationSchema.parseAsync(partialData);
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Find error for this specific field
          const fieldError = error.errors.find(err => err.path[0] === name);
          return fieldError?.message || null;
        }
        return 'Validation error';
      }
    },
    [validationSchema, values]
  );

  // Validate all fields
  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validationSchema) return true;

    setIsValidating(true);
    try {
      await validationSchema.parseAsync(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof T] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [values, validationSchema]);

  // Handle field change
  const handleChange = useCallback(
    async (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setIsDirty(true);

      if (validateOnChange) {
        const error = await validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error || undefined }));
      }
    },
    [validateOnChange, validateField]
  );

  // Handle field blur
  const handleBlur = useCallback(
    async (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validateOnBlur) {
        const error = await validateField(name, values[name]);
        setErrors((prev) => ({ ...prev, [name]: error || undefined }));
      }
    },
    [validateOnBlur, validateField, values]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const allTouched: Partial<Record<keyof T, boolean>> = {};
      Object.keys(values).forEach((key) => {
        allTouched[key as keyof T] = true;
      });
      setTouched(allTouched);

      // Validate
      const isValid = await validateForm();
      if (!isValid) {
        return;
      }

      // Submit
      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
          throw error;
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateForm, onSubmit]
  );

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
    setAutoSaveStatus('idle');
  }, [initialValues]);

  // Set field value programmatically
  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  }, []);

  // Set field error programmatically
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    isDirty,
    autoSaveStatus,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    validateForm,
    validateField,
  };
}
