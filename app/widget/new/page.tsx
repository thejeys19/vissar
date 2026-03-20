'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Copy, ChevronLeft, ChevronRight, LayoutGrid, List, Columns, MessageCircle } from 'lucide-react';
import WidgetPreview from '@/components/widget-preview';

const LAYOUTS = [
  { value: 'carousel', label: 'Carousel', description: 'Sliding cards', icon: Columns },
  { value: 'grid', label: 'Grid', description: '2-column grid', icon: LayoutGrid },
  { value: 'list', label: 'List', description: 'Vertical stack', icon: List },
  { value: 'badge', label: 'Badge', description: 'Floating widget', icon: MessageCircle },
];

const TEMPLATES = [
  { id: 'soft', name: 'Soft Shadow', description: 'White cards, gentle shadows' },
  { id: 'glass', name: 'Glassmorphism', description: 'Frosted glass blur' },
  { id: 'minimal', name: 'Minimal', description: 'Clean border style' },
  { id: 'darkElegant', name: 'Dark Elegant', description: 'Dark sophisticated' },
  { id: 'gradientBorder', name: 'Gradient Border', description: 'Violet gradient edges' },
];

export default function NewWidgetPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [config, setConfig] = useState({
    name: '',
    layout: 'carousel',
    template: 'soft',
    maxReviews: 5,
    minRating: 1,
    animations: true,
    placeId: '',
  });

  const handleSubmit = async () => {
    if (!config.name.trim()) {
      alert('Please enter a widget name');
      setStep(1);
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

  const embedCode = `<!-- Vissar Reviews Widget -->
<div
  data-vissar-widget="${config.name.toLowerCase().replace(/\s+/g, '-') || 'my-widget'}"
  data-vissar-layout="${config.layout}"
  data-vissar-template="${config.template}"
  data-vissar-max-reviews="${config.maxReviews}"
  data-vissar-min-rating="${config.minRating}"
  data-vissar-animations="${config.animations}"${config.placeId ? `\n  data-vissar-place-id="${config.placeId}"` : ''}
></div>

<script src="https://vissar.vercel.app/widget/vissar-widget.min.js" async></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const stepLabels = ['Configure', 'Style', 'Get Code'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl">Create Widget</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <div key={label} className="flex items-center">
                <button
                  onClick={() => setStep(stepNum)}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-violet-600 text-white ring-4 ring-violet-600/30'
                        : isDone
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? 'text-white' : isDone ? 'text-violet-400' : 'text-slate-500'
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-3 ${
                      step > stepNum ? 'bg-violet-600' : 'bg-slate-800'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr,1fr] gap-8">
          {/* Left Panel - Config */}
          <div className="space-y-6">
            {/* Step 1: Configure */}
            {step === 1 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <h2 className="text-xl font-semibold text-white">Configure Widget</h2>

                {/* Widget Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Widget Name</label>
                  <input
                    type="text"
                    placeholder="My Business Reviews"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Layout Selector - Visual Cards */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Layout</label>
                  <div className="grid grid-cols-2 gap-3">
                    {LAYOUTS.map((l) => {
                      const Icon = l.icon;
                      const isSelected = config.layout === l.value;
                      return (
                        <button
                          key={l.value}
                          onClick={() => setConfig({ ...config, layout: l.value })}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-violet-500 bg-violet-500/10'
                              : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                              {l.label}
                            </div>
                            <div className="text-xs text-slate-500">{l.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Max Reviews Slider */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">
                    Max Reviews: <span className="text-violet-400 font-semibold">{config.maxReviews}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={config.maxReviews}
                    onChange={(e) => setConfig({ ...config, maxReviews: parseInt(e.target.value) })}
                    className="w-full accent-violet-600"
                  />
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>1</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Min Rating */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Minimum Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setConfig({ ...config, minRating: r })}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition-all text-sm ${
                          config.minRating === r
                            ? 'border-violet-500 bg-violet-500/10 text-amber-400'
                            : 'border-slate-700 text-slate-500 hover:border-slate-600'
                        }`}
                      >
                        {r} <span className="text-amber-400">★</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Google Place ID */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Google Place ID</label>
                  <input
                    type="text"
                    placeholder="ChIJ..."
                    value={config.placeId}
                    onChange={(e) => setConfig({ ...config, placeId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-slate-500">
                    Leave empty for demo reviews. Find your Place ID at{' '}
                    <span className="text-violet-400">Google Place ID Finder</span>.
                  </p>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors"
                >
                  Next: Style <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Style */}
            {step === 2 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <h2 className="text-xl font-semibold text-white">Choose Style</h2>

                {/* Template Picker */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Template</label>
                  <div className="grid grid-cols-1 gap-3">
                    {TEMPLATES.map((t) => {
                      const isSelected = config.template === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setConfig({ ...config, template: t.id })}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-violet-500 bg-violet-500/10'
                              : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                          }`}
                        >
                          {/* Mini preview swatch */}
                          <div className="shrink-0">
                            <TemplateSwatch templateId={t.id} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                {t.name}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-violet-400" />}
                            </div>
                            <span className="text-xs text-slate-500">{t.description}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Animations Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div>
                    <div className="text-sm font-medium text-slate-300">Animations</div>
                    <div className="text-xs text-slate-500">Smooth transitions and hover effects</div>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, animations: !config.animations })}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      config.animations ? 'bg-violet-600' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                        config.animations ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors"
                  >
                    Next: Get Code <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Get Code */}
            {step === 3 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <h2 className="text-xl font-semibold text-white">Embed Code</h2>

                <div className="relative">
                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-sm text-slate-400 font-mono overflow-x-auto leading-relaxed">
                    {embedCode}
                  </pre>
                </div>

                <button
                  onClick={copyToClipboard}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-base transition-all ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-violet-600 hover:bg-violet-700 text-white'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-5 h-5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" /> Copy Embed Code
                    </>
                  )}
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Creating...' : 'Create Widget'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-sm text-slate-400 font-medium">Live Preview</span>
              </div>
              <div className="p-4">
                <WidgetPreview
                  layout={config.layout}
                  template={config.template}
                  maxReviews={config.maxReviews}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TemplateSwatch({ templateId }: { templateId: string }) {
  const swatchStyles: Record<string, string> = {
    soft: 'bg-white shadow-md border border-slate-100',
    glass: 'bg-white/20 backdrop-blur border border-white/30 bg-gradient-to-br from-violet-400/20 to-blue-400/20',
    minimal: 'bg-white border-2 border-slate-300',
    darkElegant: 'bg-slate-800 border border-slate-600',
    gradientBorder: 'bg-white border-2 border-violet-500',
  };

  return (
    <div className={`w-14 h-10 rounded-lg ${swatchStyles[templateId] || swatchStyles.soft}`}>
      <div className="p-1.5 space-y-1">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-amber-400" />
          ))}
        </div>
        <div className={`h-0.5 w-8 rounded ${templateId === 'darkElegant' ? 'bg-slate-600' : 'bg-slate-200'}`} />
        <div className={`h-0.5 w-6 rounded ${templateId === 'darkElegant' ? 'bg-slate-600' : 'bg-slate-200'}`} />
      </div>
    </div>
  );
}
