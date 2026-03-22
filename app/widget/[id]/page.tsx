"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WidgetRedirectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    router.replace(`/dashboard/widget/${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-700 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );
}
