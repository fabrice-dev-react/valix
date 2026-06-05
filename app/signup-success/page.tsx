"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Mail } from "lucide-react";

function SignupSuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 border border-slate-200">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-3 text-center">
            Verify your email
          </h1>
          
          <p className="text-slate-600 mb-4 text-center leading-relaxed">
            We&apos;ve sent a verification link to:
          </p>
          
          <div className="bg-slate-50 rounded-lg py-3 px-4 text-center mb-6">
            <span className="text-blue-600 font-medium">{email}</span>
          </div>

          <p className="text-slate-600 mb-6 text-center leading-relaxed">
            Click the link in the email to activate your account. After verification, you&apos;ll be redirected to purchase the trading strategy book.
          </p>

          <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">Didn&apos;t receive the email?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupSuccessLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function SignupSuccess() {
  return (
    <Suspense fallback={<SignupSuccessLoading />}>
      <SignupSuccessContent />
    </Suspense>
  );
}
