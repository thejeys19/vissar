"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditWidgetPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    // Redirect to the full-featured widget wizard in edit mode
    router.replace(`/dashboard/widget/new?id=${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-slate-400 text-sm">Loading widget editor…</div>
    </div>
  );
}
