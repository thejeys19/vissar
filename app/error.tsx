"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <Image src="/logo-icon.png" alt="Vissar" width={48} height={48} className="w-12 h-12 rounded-xl mb-8" />

      <h1 className="text-8xl font-black bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent mb-4">
        500
      </h1>

      <h2 className="text-2xl font-semibold text-white mb-2">Something went wrong</h2>
      <p className="text-slate-400 mb-8 text-center max-w-md">
        An unexpected error occurred. We&apos;ve been notified and are looking into it.
      </p>

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
