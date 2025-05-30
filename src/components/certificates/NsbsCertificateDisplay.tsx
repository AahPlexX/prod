// src/components/certificates/NsbsCertificateDisplay.tsx
// Developed by Luccas A E | 2025
// Purpose: Elegantly displays the information for an earned NSBS certificate.
// Features: Professional layout, placeholders for key certificate data, option for a download button.
// UI/UX Focus: Clear, prestigious presentation of achievement. Conveys value and authenticity.
// Adherence to NSBS Principles: Focuses on the final credential. This component would display info that *goes on* the PDF.

import React from 'react';
import { Award, CheckSquare, Download, User, CalendarDays, ShieldCheck } from 'lucide-react'; // Example icons

export interface NsbsCertificateDisplayProps {
  userName: string;
  courseTitle: string;
  issuedDate: string; // Formatted date string
  verificationCode: string;
  certificateId: string;
  issuerName?: string; // e.g., "NSBS Certification Authority"
  logoUrl?: string; // URL to NSBS logo, ensure this is a static UI asset
  onDownloadPdf?: (certificateId: string) => void;
  verificationUrl?: string; // e.g., https://nsbs-certified.com/verify/[verificationCode]
}

export const NsbsCertificateDisplay: React.FC<NsbsCertificateDisplayProps> = ({
  userName,
  courseTitle,
  issuedDate,
  verificationCode,
  certificateId,
  issuerName = "NSBS Certification Authority",
  logoUrl = "/nsbs-logo-formal.png", // Placeholder path, ensure this asset exists
  onDownloadPdf,
  verificationUrl,
}) => {
  return (
    <div className="nsbs-certificate-display bg-gradient-to-br from-gray-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 p-8 sm:p-12 rounded-xl shadow-2xl border-4 border-blue-600 dark:border-blue-500 max-w-4xl mx-auto relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 dark:bg-blue-400 opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-sky-500 dark:bg-sky-400 opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10">
        <header className="text-center mb-10 sm:mb-12 border-b-2 border-gray-300 dark:border-gray-600 pb-8">
          {logoUrl && (
            <img src={logoUrl} alt="NSBS Platform Logo" className="h-16 sm:h-20 mx-auto mb-4" />
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-300 tracking-tight">
            Certificate of Completion
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{issuerName}</p>
        </header>

        <main className="mb-10 sm:mb-12 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">This certificate is proudly presented to</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 break-words" style={{ fontFamily: "'Georgia', serif" }}>
            {userName}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">For successfully completing the course</p>
          <h3 className="text-2xl sm:text-3xl font-semibold text-sky-700 dark:text-sky-300 mb-8 break-words">
            {courseTitle}
          </h3>
        </main>

        <footer className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center text-sm">
          <div className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-2.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300"><strong className="font-medium text-gray-900 dark:text-white">Issued On:</strong> {issuedDate}</span>
          </div>
          <div className="flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300"><strong className="font-medium text-gray-900 dark:text-white">Verification Code:</strong> {verificationCode}</span>
          </div>
          {verificationUrl && (
             <div className="sm:col-span-2 text-center mt-4">
              <a 
                href={verificationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
              >
                Verify authenticity at {new URL(verificationUrl).hostname}
              </a>
            </div>
          )}
        </footer>

        {onDownloadPdf && (
          <div className="mt-12 text-center">
            <button
              onClick={() => onDownloadPdf(certificateId)}
              aria-label="Download Certificate as PDF"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NsbsCertificateDisplay;
