// src/components/certificates/NsbsCertificateVerificationForm.tsx
// Developed by Luccas A E | 2025
// Purpose: A simple form for users to input a certificate verification code on the public verification page.
// Features: Input field for code, submit button, handles form submission.
// UI/UX Focus: Clear and straightforward process for verifying certificate authenticity.
// Adherence to NSBS Principles: Supports platform credibility by providing a verification mechanism.

'use client';

import React, { useState, FormEvent } from 'react';
import { NsbsButton } from '@/components/ui/NsbsButton';
import { ShieldCheck, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NsbsCertificateVerificationFormProps {
  onVerify: (verificationCode: string) => Promise<void>; // Handler to submit code for verification
  isLoading?: boolean;
  initialCode?: string;
  className?: string;
  inputPlaceholder?: string;
  buttonText?: string;
}

export const NsbsCertificateVerificationForm: React.FC<NsbsCertificateVerificationFormProps> = ({
  onVerify,
  isLoading = false,
  initialCode = '',
  className,
  inputPlaceholder = "Enter Verification Code",
  buttonText = "Verify Certificate",
}) => {
  const [verificationCode, setVerificationCode] = useState<string>(initialCode);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!verificationCode.trim()) {
      setError("Verification code cannot be empty.");
      return;
    }
    // Basic validation (e.g. length, format) can be added here if codes have a known pattern
    // For example: if (!/^[A-Z0-9]{10,20}$/.test(verificationCode)) { setError("Invalid code format."); return; }
    await onVerify(verificationCode.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={cn("nsbs-certificate-verification-form space-y-4 max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700", className)}>
      <div className="text-center mb-5">
        <ShieldCheck className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Verify Certificate Authenticity</h2>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="verification-code" className="sr-only">{inputPlaceholder}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
                type="text"
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={inputPlaceholder}
                disabled={isLoading}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm dark:bg-gray-700 dark:text-white"
                aria-describedby={error ? "verification-code-error" : undefined}
                aria-invalid={!!error}
            />
        </div>
      </div>
      
      <NsbsButton
        type="submit"
        variant="default"
        isLoading={isLoading}
        disabled={isLoading || !verificationCode.trim()}
        className="w-full"
        iconLeft={isLoading ? undefined : <ShieldCheck className="w-4 h-4"/>}
      >
        {buttonText}
      </NsbsButton>
    </form>
  );
};

export default NsbsCertificateVerificationForm;
