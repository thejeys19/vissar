"use client";

import { useState, useEffect, use } from "react";
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

const LAYOUTS = [
  { value: "carousel", label: "Carousel", description: "Horizontal sliding reviews" },
  { value: "grid", label: "Grid", description: "2-3 column grid layout" },
  { value: "list", label: "List", description: "Vertical stack of reviews" },
  { value: "badge", label: "Floating Badge", description: "Corner widget with popup" },
];

export default function EditWidgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const [config, setConfig] = useState({
    name: "",
    layout: "carousel" as 'carousel' | 'grid' | 'list' | 'badge',
    maxReviews: 5,
    minRating: 1,
    autoStyle: true,
  });

  useEffect(() => {
    fetchWidget();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchWidget = async () => {
    try {
      const response = await fetch(`/api/widget/${id}`);
      if (!response.ok) throw new Error('Widget not found');
      const widget = await response.json();
      setConfig({
        name: widget.name,
        layout: widget.layout,
        maxReviews: widget.maxReviews,
        minRating: widget.minRating,
        autoStyle: widget.autoStyle,
      });
    } catch (error) {
      console.error('Error fetching widget:', error);
      alert('Widget not found');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

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
        body: JSON.stringify({ ...config, id }),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error saving widget:', error);
      alert('Failed to save widget. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this widget?')) return;

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/widget/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error deleting widget:', error);
      alert('Failed to delete widget. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const copyToClipboard = () => {
    const code = `<!-- Add this to your HTML -->
<div 
  data-vissar-widget="${id}"
  data-vissar-layout="${config.layout}"
  data-vissar-max-reviews="${config.maxReviews}"
></div>

<script src="https://vissar.com/widget/vissar-widget.min.js"></script>`;
    
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-600 hover:text-slate-900">
              ← Back
            </Link>
            <span className="font-bold text-xl text-slate-900">Edit Widget</span>
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
                    Widget ID: <code className="bg-slate-100 px-1 rounded">{id}</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="layout">Layout</Label>
                  <Select
                    value={config.layout}
                    onValueChange={(value) => {
                      setConfig({ ...config, layout: value as typeof config.layout });
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

            <div className="flex gap-4">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">Cancel</Link>
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Widget'}
            </Button>
          </div>

          {/* Live Preview & Embed Code */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Embed Code</h2>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-sm overflow-x-auto">
{`<!-- Add this to your HTML -->
<div 
  data-vissar-widget="${id}"
  data-vissar-layout="${config.layout}"
  data-vissar-max-reviews="${config.maxReviews}"
></div>

<script src="https://vissar.com/widget/vissar-widget.min.js"></script>`}
                </pre>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={copyToClipboard}
                >
                  {isCopied ? 'Copied!' : 'Copy Code'}
                </Button>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-4">Preview:</p>
                  <div className="p-4 bg-slate-100 rounded-lg">
                    <div 
                      data-vissar-widget={id}
                      data-vissar-layout={config.layout}
                      data-vissar-max-reviews={config.maxReviews}
                    />
                  </div>
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
