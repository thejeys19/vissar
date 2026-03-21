"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
  views: number;
  limit: number;
}

export function UpgradePrompt({ views, limit }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const pct = limit > 0 ? views / limit : 0;

  if (dismissed || pct < 0.8) return null;

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-5 mb-6 shadow-lg shadow-violet-500/20">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-violet-200 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
      <p className="text-white font-semibold mb-1">
        You have used {views.toLocaleString()} of {limit.toLocaleString()} views this month.
      </p>
      <p className="text-violet-200 text-sm mb-4">
        Upgrade to Pro for 10,000 views and unlock all templates.
      </p>
      <Button asChild size="sm" className="bg-white text-violet-700 hover:bg-violet-50 font-semibold">
        <Link href="/pricing">
          Upgrade to Pro
          <ArrowRight className="ml-1.5 w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
