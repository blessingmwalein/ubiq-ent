import * as yup from 'yup'

// Auth validation schemas
export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  
  password_confirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  password: yup
    .string()
    .required('Password is required'),
  
  remember: yup.boolean().default(false),
})

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
})

export const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  
  password_confirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  
  token: yup.string().required(),
})

// Profile validation schemas
export const createProfileSchema = yup.object({
  name: yup
    .string()
    .required('Profile name is required')
    .max(50, 'Profile name must not exceed 50 characters'),
  
  avatar: yup.string().url('Please enter a valid URL').optional(),
  
  is_kids: yup.boolean().default(false),
  
  language: yup.string().default('en'),
  
  autoplay_next: yup.boolean().default(true),
  
  subtitle_preference: yup.string().optional(),
})

export const updateProfileSchema = yup.object({
  name: yup
    .string()
    .max(50, 'Profile name must not exceed 50 characters')
    .optional(),
  
  avatar: yup.string().url('Please enter a valid URL').optional(),
  
  autoplay_next: yup.boolean().optional(),
  
  subtitle_preference: yup.string().optional(),
})

// User account validation schemas
export const updateUserProfileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters')
    .optional(),
  
  email: yup
    .string()
    .email('Please enter a valid email address')
    .optional(),
})

export const updatePasswordSchema = yup.object({
  current_password: yup
    .string()
    .required('Current password is required'),
  
  password: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  
  password_confirmation: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

// Settings validation schema
export const userSettingsSchema = yup.object({
  email_notifications: yup.boolean().optional(),
  push_notifications: yup.boolean().optional(),
  autoplay_previews: yup.boolean().optional(),
  data_saver_mode: yup.boolean().optional(),
  language: yup.string().optional(),
  subtitle_size: yup.string().oneOf(['small', 'medium', 'large']).optional(),
  playback_quality: yup
    .string()
    .oneOf(['auto', '360p', '480p', '720p', '1080p'])
    .optional(),
})

// Search validation schema
export const searchSchema = yup.object({
  q: yup
    .string()
    .required('Search query is required')
    .min(2, 'Search query must be at least 2 characters'),
  
  type: yup
    .string()
    .oneOf(['movie', 'show', 'skit', 'afrimation', 'real_estate'])
    .optional(),
  
  category_id: yup.number().positive().optional(),
  
  maturity_rating: yup
    .string()
    .oneOf(['all', 'pg', 'pg13', 'r', 'adult'])
    .optional(),
})

// Payment validation schemas
export const cardDetailsSchema = yup.object({
  name: yup
    .string()
    .required('Cardholder name is required')
    .min(2, 'Name must be at least 2 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
})

// Contact/Support validation schema
export const contactSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  subject: yup
    .string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters'),
  
  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters'),
})

export type RegisterFormData = yup.InferType<typeof registerSchema>
export type LoginFormData = yup.InferType<typeof loginSchema>
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>
export type CreateProfileFormData = yup.InferType<typeof createProfileSchema>
export type UpdateProfileFormData = yup.InferType<typeof updateProfileSchema>
export type UpdateUserProfileFormData = yup.InferType<typeof updateUserProfileSchema>
export type UpdatePasswordFormData = yup.InferType<typeof updatePasswordSchema>
export type UserSettingsFormData = yup.InferType<typeof userSettingsSchema>
export type SearchFormData = yup.InferType<typeof searchSchema>
export type CardDetailsFormData = yup.InferType<typeof cardDetailsSchema>
export type ContactFormData = yup.InferType<typeof contactSchema>
