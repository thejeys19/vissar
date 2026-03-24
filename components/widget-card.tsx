"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Check, Eye, MousePointerClick } from "lucide-react";

interface WidgetCardProps {
  widget: {
    id: string;
    name: string;
    layout: string;
    template: string;
    maxReviews: number;
    minRating?: number;
  };
}

export default function WidgetCard({ widget }: WidgetCardProps) {
  const [copied, setCopied] = useState(false);
  const [views, setViews] = useState<number | null>(null);
  const [clicks, setClicks] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/analytics/widget?id=${widget.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setViews(data.views ?? 0);
          setClicks(data.clicks ?? 0);
        }
      })
      .catch(() => {});
  }, [widget.id]);

  const handleCopy = () => {
    const code = `<div data-vissar-widget="${widget.id}" data-vissar-layout="${widget.layout}" data-vissar-template="${widget.template}" data-vissar-max-reviews="${widget.maxReviews}" data-vissar-min-rating="${widget.minRating ?? 1}"></div>\n<script src="https://www.vissar.com/widget/vissar-widget.min.js" async></script>`;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5 text-violet-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white truncate">{widget.name}</h3>
              <p className="text-xs sm:text-sm text-slate-400 capitalize">
                {widget.layout} · {widget.template} · {widget.maxReviews} reviews
              </p>
              {views !== null && (
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {views.toLocaleString()} views</span>
                  <span className="text-slate-600">·</span>
                  <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3" /> {(clicks ?? 0).toLocaleString()} clicks</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hidden sm:flex items-center gap-1.5"
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
              ) : (
                <><Code2 className="w-3.5 h-3.5" /> Get Code</>
              )}
            </Button>
            <Button size="sm" asChild className="bg-violet-600 hover:bg-violet-700">
              <Link href={`/dashboard/widget/new?id=${widget.id}`}>Edit</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
