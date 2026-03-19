"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef } from "react";

const LAYOUTS = [
  { value: "carousel", label: "Carousel", description: "Horizontal sliding reviews" },
  { value: "grid", label: "Grid", description: "2-3 column grid layout" },
  { value: "list", label: "List", description: "Vertical stack of reviews" },
  { value: "badge", label: "Floating Badge", description: "Corner widget with popup" },
];

export default function NewWidgetPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [config, setConfig] = useState<{ name: string; layout: 'carousel' | 'grid' | 'list' | 'badge'; maxReviews: number; minRating: number; autoStyle: boolean; placeId?: string }>({
    name: "",
    layout: "carousel",
    maxReviews: 5,
    minRating: 1,
    autoStyle: true,
    placeId: "",
  });

  const [previewLayout, setPreviewLayout] = useState("carousel");

  // Re-initialize widget when preview layout changes
  useEffect(() => {
    const win = window as Window & { VissarWidget?: new (container: HTMLDivElement, config: Record<string, unknown>) => { init: () => void } };
    if (previewRef.current && typeof window !== 'undefined' && win.VissarWidget) {
      previewRef.current.innerHTML = '';
      const widget = new win.VissarWidget(previewRef.current, {
        widgetId: 'preview',
        layout: previewLayout,
        maxReviews: config.maxReviews,
        placeId: config.placeId || 'mock',
        autoStyle: true,
      });
      widget.init();
    }
  }, [previewLayout, config.maxReviews, config.placeId]);

  const handleSubmit = async () => {
    if (!config.name.trim()) {
      alert('Please enter a widget name');
      return;
    }

    setIsSaving(true);
    
    try {
      const response = await fetch('/api/widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      await response.json();
      router.push(`/`);
      router.refresh();
    } catch (error) {
      console.error('Error saving widget:', error);
      alert('Failed to save widget. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    const code = `<!-- Add this to your HTML -->
<div 
  data-vissar-widget="${config.name.toLowerCase().replace(/\s+/g, '-') || 'my-widget'}"
  data-vissar-layout="${config.layout}"
  data-vissar-max-reviews="${config.maxReviews}"
></div>

<script src="https://vissar.com/widget/vissar-widget.min.js"></script>`;
    
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const widgetId = config.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'my-widget';

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-600 hover:text-slate-900">
              ← Back
            </Link>
            <span className="font-bold text-xl text-slate-900">Create Widget</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Configuration Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Widget Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Widget Name *</Label>
                  <Input
                    id="name"
                    placeholder="My Business Reviews"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">
                    Widget ID: <code className="bg-slate-100 px-1 rounded">{widgetId}</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="layout">Layout</Label>
                  <Select
                    value={config.layout}
                    onValueChange={(value) => {
                      setConfig({ ...config, layout: value as typeof config.layout });
                      setPreviewLayout(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LAYOUTS.map((layout) => (
                        <SelectItem key={layout.value} value={layout.value}>
                          <div>
                            <div className="font-medium">{layout.label}</div>
                            <div className="text-xs text-slate-500">{layout.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxReviews">Max Reviews to Show</Label>
                  <Input
                    id="maxReviews"
                    type="number"
                    min={1}
                    max={20}
                    value={config.maxReviews}
                    onChange={(e) =>
                      setConfig({ ...config, maxReviews: parseInt(e.target.value) || 5 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minRating">Minimum Rating</Label>
                  <Select
                    value={String(config.minRating)}
                    onValueChange={(value) =>
                      setConfig({ ...config, minRating: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Show all ratings</SelectItem>
                      <SelectItem value="3">3+ stars only</SelectItem>
                      <SelectItem value="4">4+ stars only</SelectItem>
                      <SelectItem value="5">5 stars only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="autoStyle"
                    checked={config.autoStyle}
                    onChange={(e) => setConfig({ ...config, autoStyle: e.target.checked })}
                    className="rounded border-slate-300"
                  />
                  <Label htmlFor="autoStyle" className="text-sm font-normal cursor-pointer">
                    Auto-detect website styles
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Google Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="placeId">Place ID</Label>
                  <Input
                    id="placeId"
                    placeholder="ChIJ... (e.g., ChIJyYEcRCI1K4gRk_bQXZGjMD8)"
                    value={config.placeId || ''}
                    onChange={(e) => setConfig({ ...config, placeId: e.target.value })}
                  />
                  <p className="text-sm text-slate-500">
                    Enter your Google Maps Place ID to display real reviews. Leave empty for demo data.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">Cancel</Link>
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? 'Creating...' : 'Create Widget'}
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Live Preview</h2>
              <div className="flex gap-2">
                {LAYOUTS.slice(0, 3).map((layout) => (
                  <button
                    key={layout.value}
                    onClick={() => setPreviewLayout(layout.value)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      previewLayout === layout.value
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {layout.label}
                  </button>
                ))}
              </div>
            </div>

            <Card className="min-h-[400px]">
              <CardContent className="p-8">
                <div className="mb-8 p-6 bg-slate-100 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Widget Preview</p>
                  <div ref={previewRef} />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Embed Code</p>
                  <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-sm overflow-x-auto">
{`<!-- Add this to your HTML -->
<div 
  data-vissar-widget="${widgetId}"
  data-vissar-layout="${config.layout}"
  data-vissar-max-reviews="${config.maxReviews}"
></div>

<script src="https://vissar.com/widget/vissar-widget.min.js"></script>`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={copyToClipboard}
                  >
                    {isCopied ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <script src="/widget/vissar-widget.min.js" async />
    </div>
  );
}
