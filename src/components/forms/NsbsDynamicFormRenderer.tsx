// src/components/forms/NsbsDynamicFormRenderer.tsx
// Developed by Luccas A E | 2025
// Purpose: Renders a form dynamically based on a JSON-like schema or configuration object.
// Features: Supports various input types (text, select, checkbox, etc.), sections, basic validation rules from schema. Highly extensible for complex admin forms.
// UI/UX Focus: Allows for rapid creation of consistent forms, reduces boilerplate, ensures consistent styling and behavior.
// Adherence to NSBS Principles: Enables efficient and standardized form creation for administrative tasks.

'use client'; // For form state and interaction

import React, { ReactNode } from 'react';
import { useForm, SubmitHandler, FieldValues, Path, UseFormRegister, FieldErrors } from 'react-hook-form';
import { NsbsButton } from '@/components/ui/NsbsButton';
import { NsbsFormSection } from './NsbsFormSection'; // Assuming this component exists
import { NsbsProfileFormField } from '@/components/user/NsbsProfileFormField'; // Example field
import { cn } from '@/lib/utils';

export type FormFieldType = 
  | 'text' | 'email' | 'password' | 'number' | 'textarea' 
  | 'select' | 'checkbox' | 'radioGroup' | 'date' | 'custom';

export interface FormFieldOption {
  value: string | number;
  label: string;
}

export interface FormField<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  defaultValue?: any;
  options?: FormFieldOption[]; // For select, radioGroup
  validation?: RegisterOptions<TFieldValues, Path<TFieldValues>>; // React Hook Form validation rules
  helperText?: string;
  className?: string; // Class for the field wrapper
  inputClassName?: string; // Class for the input element itself
  renderCustom?: (props: {
    register: UseFormRegister<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    fieldName: Path<TFieldValues>;
    fieldConfig: FormField<TFieldValues>;
  }) => ReactNode; // For entirely custom field rendering
}

export interface FormSectionSchema<TFieldValues extends FieldValues = FieldValues> {
  title: string;
  description?: string;
  fields: FormField<TFieldValues>[];
}

export interface FormSchema<TFieldValues extends FieldValues = FieldValues> {
  sections: FormSectionSchema<TFieldValues>[];
}

export interface NsbsDynamicFormRendererProps<TFieldValues extends FieldValues = FieldValues> {
  schema: FormSchema<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  defaultValues?: TFieldValues; // Default values for the entire form
  isLoading?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  formClassName?: string;
  globalFormError?: string | null;
}

// A minimal re-implementation of RegisterOptions for this component's scope
// In a real app, import this from react-hook-form directly if possible.
type RegisterOptions<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
> = Partial<{
  required: string | boolean;
  min: number | { value: number; message: string };
  max: number | { value: number; message: string };
  minLength: number | { value: number; message: string };
  maxLength: number | { value: number; message: string };
  pattern: RegExp | { value: RegExp; message: string };
  validate: (value: TFieldValues[TFieldName], formValues: TFieldValues) => boolean | string | Promise<boolean | string>;
}>;


export const NsbsDynamicFormRenderer = <TFieldValues extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  isLoading = false,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  onCancel,
  formClassName,
  globalFormError,
}: NsbsDynamicFormRendererProps<TFieldValues>) => {
  const { register, handleSubmit, formState: { errors }, control } = useForm<TFieldValues>({ defaultValues });

  const renderField = (field: FormField<TFieldValues>, sectionIndex: number, fieldIndex: number): ReactNode => {
    const fieldName = field.name;
    const error = errors[fieldName];
    const errorMessage = typeof error?.message === 'string' ? error.message : undefined;

    if (field.renderCustom) {
      return field.renderCustom({ register, errors, fieldName, fieldConfig: field });
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'date':
        return (
          <NsbsProfileFormField // Reusing for basic input structure
            key={`${sectionIndex}-${fieldIndex}-${String(fieldName)}`}
            name={String(fieldName)}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            helperText={field.helperText}
            errorMessage={errorMessage}
            className={field.inputClassName}
            {...register(fieldName, field.validation as any)} // Cast needed due to complex RHF types
          />
        );
      case 'textarea':
        return (
          <div key={`${sectionIndex}-${fieldIndex}-${String(fieldName)}`} className={cn("form-field-wrapper", field.className)}>
            <label htmlFor={String(fieldName)} className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">{field.label}</label>
            <textarea
              id={String(fieldName)}
              placeholder={field.placeholder}
              defaultValue={field.defaultValue}
              className={cn("block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset sm:text-sm",
                errorMessage ? "ring-red-500 dark:ring-red-400 focus:ring-red-500 dark:focus:ring-red-400" : "ring-gray-300 dark:ring-gray-600 focus:ring-blue-600 dark:focus:ring-blue-500",
                field.inputClassName)}
              {...register(fieldName, field.validation as any)}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? `${String(fieldName)}-error` : field.helperText ? `${String(fieldName)}-helper` : undefined}
            />
            {errorMessage && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400" id={`${String(fieldName)}-error`}>{errorMessage}</p>}
            {field.helperText && !errorMessage && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={`${String(fieldName)}-helper`}>{field.helperText}</p>}
          </div>
        );
      case 'select':
        return (
          <div key={`${sectionIndex}-${fieldIndex}-${String(fieldName)}`} className={cn("form-field-wrapper", field.className)}>
            <label htmlFor={String(fieldName)} className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">{field.label}</label>
            <select
              id={String(fieldName)}
              defaultValue={field.defaultValue}
              className={cn("block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset dark:bg-gray-700 focus:ring-2 focus:ring-inset sm:text-sm",
                errorMessage ? "ring-red-500 dark:ring-red-400 focus:ring-red-500 dark:focus:ring-red-400" : "ring-gray-300 dark:ring-gray-600 focus:ring-blue-600 dark:focus:ring-blue-500",
                field.inputClassName)}
              {...register(fieldName, field.validation as any)}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? `${String(fieldName)}-error` : field.helperText ? `${String(fieldName)}-helper` : undefined}
            >
              {field.placeholder && <option value="">{field.placeholder}</option>}
              {field.options?.map(opt => <option key={opt.value.toString()} value={opt.value}>{opt.label}</option>)}
            </select>
            {errorMessage && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400" id={`${String(fieldName)}-error`}>{errorMessage}</p>}
            {field.helperText && !errorMessage && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={`${String(fieldName)}-helper`}>{field.helperText}</p>}
          </div>
        );
      // Add cases for 'checkbox', 'radioGroup' etc. as needed, potentially using Radix primitives
      default:
        return <p key={`${sectionIndex}-${fieldIndex}-${String(fieldName)}`} className="text-red-500">Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("nsbs-dynamic-form space-y-10", formClassName)} noValidate>
      {globalFormError && (
         <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm mb-6">
          {globalFormError}
        </div>
      )}
      {schema.sections.map((section, sectionIndex) => (
        <NsbsFormSection
          key={sectionIndex}
          title={section.title}
          description={section.description}
          hasBorder={sectionIndex > 0}
        >
          {section.fields.map((field, fieldIndex) => renderField(field, sectionIndex, fieldIndex))}
        </NsbsFormSection>
      ))}
      <div className="flex justify-end items-center gap-x-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
        {onCancel && (
          <NsbsButton type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelButtonText}
          </NsbsButton>
        )}
        <NsbsButton type="submit" variant="default" isLoading={isLoading} disabled={isLoading}>
          {submitButtonText}
        </NsbsButton>
      </div>
    </form>
  );
};

export default NsbsDynamicFormRenderer;
