import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <Image src="/logo-icon.png" alt="Vissar" width={48} height={48} className="w-12 h-12 rounded-xl mb-8" />

      <h1 className="text-8xl font-black bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent mb-4">
        404
      </h1>

      <h2 className="text-2xl font-semibold text-white mb-2">Page not found</h2>
      <p className="text-slate-400 mb-8 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Go Home
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}
