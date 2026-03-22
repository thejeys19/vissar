"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/logo-icon.png" alt="Vissar" width={40} height={40} className="rounded-xl" />
            <span className="font-bold text-2xl text-white">vissar</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400">Sign in to manage your widgets</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center gap-3 h-12 text-base font-medium"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Redirecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <p className="text-center text-sm text-slate-500 mt-6">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-violet-400 hover:text-violet-300">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-violet-400 hover:text-violet-300">Privacy Policy</Link>
          </p>
        </div>

        <p className="text-center text-slate-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/" className="text-violet-400 hover:text-violet-300">
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
}
