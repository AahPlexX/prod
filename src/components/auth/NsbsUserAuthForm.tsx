// src/components/auth/NsbsUserAuthForm.tsx
// Developed by Luccas A E | 2025
// Purpose: A versatile form for user authentication, supporting magic link email input and social logins.
// Features: Client-side email validation, distinct CTAs for magic link and social providers, loading/error states.
// UI/UX Focus: Simple, clear instructions, minimal friction for login/registration.
// Adherence to NSBS Principles: Streamlined access, aligned with text-focused interaction.

import React, { useState, FormEvent } from 'react';
import { NsbsButton } from '@/components/ui/NsbsButton';
import { Mail, LogIn } from 'lucide-react';
// import GoogleIcon from './GoogleIcon'; // Placeholder for actual SVG or component
// import GithubIcon from './GithubIcon'; // Placeholder

// Simple SVG icons for placeholder until actual ones are provided
const GoogleIcon = () => <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.03,4.73 15.69,5.36 16.95,6.45L19.49,4.08C17.49,2.32 14.9,1 12.19,1C6.92,1 3,5.58 3,12C3,18.42 6.92,23 12.19,23C17.64,23 21.74,18.88 21.74,12.38C21.74,11.93 21.58,11.52 21.35,11.1Z"/></svg>;
const GithubIcon = () => <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21V19.24C6.29,19.84 5.57,17.76 5.57,17.76C5.12,16.66 4.38,16.32 4.38,16.32C3.48,15.69 4.44,15.72 4.44,15.72C5.45,15.79 6.08,16.73 6.08,16.73C7,18.45 8.69,17.96 9.38,17.66C9.47,17.07 9.72,16.66 10,16.35C7.36,16.05 4.58,15 4.58,10.93C4.58,9.72 5,8.77 5.68,7.96C5.58,7.66 5.23,6.56 5.78,5.07C5.78,5.07 6.79,4.75 9.5,6.4C10.44,6.14 11.44,6 12.44,6S14.44,6.14 15.5,6.4C18.21,4.75 19.22,5.07 19.22,5.07C19.77,6.56 19.42,7.66 19.32,7.96C20,8.77 20.42,9.72 20.42,10.93C20.42,15 17.64,16.05 15,16.35C15.34,16.72 15.62,17.38 15.62,18.36V21C15.62,21.27 15.76,21.58 16.26,21.5C20.13,20.17 23,16.42 23,12A10,10 0 0,0 12,2Z"/></svg>;


export type SocialProvider = 'google' | 'github'; // Extend as needed, e.g. 'facebook', 'linkedin' [cite: 647]

export interface NsbsUserAuthFormProps {
  formType: 'login' | 'register';
  onMagicLinkSubmit: (email: string) => Promise<void>;
  onSocialAuthSubmit: (provider: SocialProvider) => Promise<void>;
  isLoading?: boolean;
  magicLinkSent?: boolean;
  errorMessage?: string | null;
  switchFormLink: React.ReactNode; // e.g., <Link href="/register">New user? Register</Link>
}

export const NsbsUserAuthForm: React.FC<NsbsUserAuthFormProps> = ({
  formType,
  onMagicLinkSubmit,
  onSocialAuthSubmit,
  isLoading = false,
  magicLinkSent = false,
  errorMessage,
  switchFormLink,
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (emailInput: string): boolean => {
    if (!emailInput) {
      setEmailError('Email address is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    await onMagicLinkSubmit(email);
  };
  
  const socialProvidersConfig: { name: SocialProvider; label: string; icon: JSX.Element; available: boolean }[] = [
    { name: 'google', label: 'Google', icon: <GoogleIcon />, available: true /* Check from env or config */ },
    { name: 'github', label: 'GitHub', icon: <GithubIcon />, available: true /* From User Journey [cite: 647] */ },
    // { name: 'facebook', label: 'Facebook', icon: <FacebookIcon />, available: false /* Example */ },
    // { name: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon />, available: false /* Example */ },
  ];


  return (
    <div className="nsbs-user-auth-form w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
        {formType === 'login' ? 'Welcome Back' : 'Create Account'}
      </h2>

      {errorMessage && (
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
          {errorMessage}
        </div>
      )}

      {magicLinkSent ? (
        <div className="p-4 text-center rounded-md bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
          <Mail className="w-8 h-8 mx-auto mb-2 text-green-500 dark:text-green-400" />
          <h3 className="text-lg font-medium text-green-800 dark:text-green-200">Check Your Email</h3>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            We've sent a magic link to <strong>{email}</strong>. Click the link to {formType === 'login' ? 'sign in' : 'complete registration'}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleMagicLink} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value); // Re-validate on change if error was shown
              }}
              onBlur={() => validateEmail(email)} // Validate on blur
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                          focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white
                          ${emailError 
                            ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'}
                         `}
              placeholder="you@example.com"
              aria-describedby={emailError ? "email-error" : undefined}
              aria-invalid={!!emailError}
            />
            {emailError && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400" id="email-error">
                {emailError}
              </p>
            )}
          </div>

          <NsbsButton
            type="submit"
            variant="default" // Or 'sg-primary'
            className="w-full"
            isLoading={isLoading && !socialProvidersConfig.some(p => p.name === (isLoading as any))} // crude check, improve if loading state is more granular
            iconLeft={<Mail className="w-4 h-4" />}
          >
            {formType === 'login' ? 'Sign in with Email' : 'Register with Email'}
          </NsbsButton>
        </form>
      )}

      {!magicLinkSent && socialProvidersConfig.filter(p => p.available).length > 0 && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {socialProvidersConfig.filter(p => p.available).map((provider) => (
              <NsbsButton
                key={provider.name}
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => onSocialAuthSubmit(provider.name)}
                isLoading={isLoading && (isLoading as any) === provider.name} // Needs specific loading state per provider
                iconLeft={provider.icon}
                aria-label={}
              >
                Continue with {provider.label}
              </NsbsButton>
            ))}
          </div>
        </>
      )}
      <div className="text-sm text-center">
        {switchFormLink}
      </div>
    </div>
  );
};

export default NsbsUserAuthForm;
