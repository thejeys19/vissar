'use client';

import { useState, useEffect, useRef } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Check, Copy, Eye, Layout, Palette, Sparkles } from "lucide-react";

const LAYOUTS = [
  { value: "carousel", label: "Carousel", description: "Horizontal sliding reviews", icon: "→" },
  { value: "grid", label: "Grid", description: "2-3 column responsive layout", icon: "⊞" },
  { value: "list", label: "List", description: "Vertical stack with full width", icon: "☰" },
  { value: "badge", label: "Floating Badge", description: "Corner widget with popup", icon: "◉" },
];

const TEMPLATES = [
  { id: "soft", name: "Soft Shadow", category: "Clean", description: "Gentle shadows, modern feel" },
  { id: "glass", name: "Glassmorphism", category: "Premium", description: "Frosted glass effect" },
  { id: "minimal", name: "Minimal Line", category: "Clean", description: "Understated elegance" },
  { id: "gradientBorder", name: "Gradient Border", category: "Premium", description: "Vibrant edge accents" },
  { id: "floating", name: "Floating", category: "Premium", description: "Elevated 3D effect" },
  { id: "darkElegant", name: "Dark Elegant", category: "Dark", description: "Sophisticated dark theme" },
  { id: "bordered", name: "Bordered", category: "Clean", description: "Clear defined edges" },
  { id: "neon", name: "Neon Glow", category: "Bold", description: "Cyberpunk aesthetics" },
  { id: "pill", name: "Pill Shape", category: "Clean", description: "Rounded capsule cards" },
  { id: "instagram", name: "Social Card", category: "Clean", description: "Instagram-inspired design" },
];

export default function NewWidgetPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [config, setConfig] = useState({
    name: "",
    layout: "carousel" as const,
    template: "soft",
    maxReviews: 5,
    minRating: 1,
    autoStyle: true,
    animations: true,
    placeId: "",
    // Advanced styling
    borderRadius: 12,
    shadowIntensity: 20,
    spacing: 20,
    customCSS: "",
  });

  // Update preview
  useEffect(() => {
    const win = window as Window & { VissarWidget?: new (container: HTMLDivElement, config: Record<string, unknown>) => { init: () => void } };
    if (previewRef.current && typeof window !== 'undefined' && win.VissarWidget) {
      previewRef.current.innerHTML = '';
      const widget = new win.VissarWidget(previewRef.current, {
        widgetId: 'preview',
        layout: config.layout,
        template: config.template,
        maxReviews: config.maxReviews,
        placeId: config.placeId || 'mock',
        autoStyle: config.autoStyle,
        animations: config.animations,
      });
      widget.init();
    }
  }, [config]);

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
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving widget:', error);
      alert('Failed to save widget. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    const code = `<!-- Vissar Widget -->
<div 
  data-vissar-widget="${config.name.toLowerCase().replace(/\s+/g, '-') || 'my-widget'}"
  data-vissar-layout="${config.layout}"
  data-vissar-template="${config.template}"
  data-vissar-max-reviews="${config.maxReviews}"
  data-vissar-animations="${config.animations}"
></div>

<script src="https://vissar.vercel.app/widget/vissar-widget.min.js" async></script>`;
    
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl">Create Widget</span>
          </Link>
          <Button onClick={handleSubmit} disabled={isSaving} className="bg-violet-600 hover:bg-violet-700">
            {isSaving ? 'Creating...' : 'Create Widget'}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-900 border border-slate-800">
                <TabsTrigger value="basic">
                  <Layout className="w-4 h-4 mr-2" /> Basic
                </TabsTrigger>
                <TabsTrigger value="template">
                  <Palette className="w-4 h-4 mr-2" /> Template
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <Sparkles className="w-4 h-4 mr-2" /> Advanced
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Widget Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Widget Name</Label>
                      <Input
                        placeholder="My Business Reviews"
                        value={config.name}
                        onChange={(e) => setConfig({ ...config, name: e.target.value })}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Layout</Label>
                      <Select
                        value={config.layout}
                        onValueChange={(value) => setConfig({ ...config, layout: value as typeof config.layout })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
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
                      <Label>Max Reviews: {config.maxReviews}</Label>
                      <Slider
                        value={[config.maxReviews]}
                        onValueChange={([value]) => setConfig({ ...config, maxReviews: value })}
                        min={1}
                        max={20}
                        className="py-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Google Place ID (optional)</Label>
                      <Input
                        placeholder="ChIJ..."
                        value={config.placeId}
                        onChange={(e) => setConfig({ ...config, placeId: e.target.value })}
                        className="bg-slate-800 border-slate-700"
                      />
                      <p className="text-xs text-slate-500">Leave empty for demo reviews</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="template" className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Choose Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {TEMPLATES.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setConfig({ ...config, template: template.id })}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            config.template === template.id
                              ? 'border-violet-500 bg-violet-500/10'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{template.name}</span>
                            {config.template === template.id && (
                              <Check className="w-4 h-4 text-violet-500" />
                            )}
                          </div>
                          <span className="text-xs text-slate-500 uppercase tracking-wide">{template.category}</span>
                          <p className="text-sm text-slate-400 mt-1">{template.description}</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Advanced Styling</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Border Radius: {config.borderRadius}px</Label>
                      <Slider
                        value={[config.borderRadius]}
                        onValueChange={([value]) => setConfig({ ...config, borderRadius: value })}
                        min={0}
                        max={50}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Shadow Intensity: {config.shadowIntensity}%</Label>
                      <Slider
                        value={[config.shadowIntensity]}
                        onValueChange={([value]) => setConfig({ ...config, shadowIntensity: value })}
                        min={0}
                        max={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Card Spacing: {config.spacing}px</Label>
                      <Slider
                        value={[config.spacing]}
                        onValueChange={([value]) => setConfig({ ...config, spacing: value })}
                        min={10}
                        max={50}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="animations"
                        checked={config.animations}
                        onChange={(e) => setConfig({ ...config, animations: e.target.checked })}
                        className="rounded bg-slate-800 border-slate-700"
                      />
                      <Label htmlFor="animations">Enable animations</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoStyle"
                        checked={config.autoStyle}
                        onChange={(e) => setConfig({ ...config, autoStyle: e.target.checked })}
                        className="rounded bg-slate-800 border-slate-700"
                      />
                      <Label htmlFor="autoStyle">Auto-detect website styles</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Embed Code */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Embed Code</CardTitle>
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="border-slate-700">
                  {isCopied ? (
                    <><Check className="w-4 h-4 mr-1" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-1" /> Copy</>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-950 p-4 rounded-lg text-xs text-slate-400 overflow-x-auto">
{`<div 
  data-vissar-widget="${config.name.toLowerCase().replace(/\s+/g, '-') || 'my-widget'}"
  data-vissar-layout="${config.layout}"
  data-vissar-template="${config.template}"
  data-vissar-max-reviews="${config.maxReviews}"></div>

<script src="https://vissar.vercel.app/widget/vissar-widget.min.js" async></script>`}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" /> Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-8 min-h-[400px]">
                  <div ref={previewRef} />
                </div>
                
                <p className="text-center text-sm text-slate-500 mt-4">
                  Preview shows how widget will appear on your site
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
