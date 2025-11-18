'use client'

import * as React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Input } from './input'
import { Textarea } from './textarea'
import { Label } from './label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  name: string
  label?: string
  placeholder?: string
  type?: string
  className?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
}

export function FormInput({
  name,
  label,
  placeholder,
  type = 'text',
  className,
  required,
  disabled,
  helperText,
}: FormFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="block">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(error && 'border-destructive focus-visible:ring-destructive')}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          />
        )}
      />
      {helperText && !error && (
        <p id={`${name}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  )
}

export function FormTextarea({
  name,
  label,
  placeholder,
  className,
  required,
  disabled,
  helperText,
}: Omit<FormFieldProps, 'type'>) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="block">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(error && 'border-destructive focus-visible:ring-destructive')}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          />
        )}
      />
      {helperText && !error && (
        <p id={`${name}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  )
}

interface FormCheckboxProps {
  name: string
  label: string
  className?: string
  disabled?: boolean
}

export function FormCheckbox({ name, label, className, disabled }: FormCheckboxProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="checkbox"
            id={name}
            disabled={disabled}
            checked={field.value}
            onChange={field.onChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!!error}
          />
        )}
      />
      <Label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </Label>
      {error && (
        <p className="text-sm text-destructive ml-2">{error.message as string}</p>
      )}
    </div>
  )
}
