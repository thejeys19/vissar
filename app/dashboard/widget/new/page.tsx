'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Copy, ChevronLeft, ChevronRight, ChevronDown, LayoutGrid, List, Columns, MessageCircle, Search, Lock, MoveRight, Grid3X3, Heart, CircleDot, Star } from 'lucide-react';
import WidgetPreview from '@/components/widget-preview';

const LAYOUTS = [
  { value: 'carousel', label: 'Carousel', description: 'Sliding cards', icon: Columns },
  { value: 'grid', label: 'Grid', description: '2-column grid', icon: LayoutGrid },
  { value: 'list', label: 'List', description: 'Vertical stack', icon: List },
  { value: 'badge', label: 'Badge', description: 'Floating widget', icon: MessageCircle },
  { value: 'marquee', label: 'Marquee', description: 'Auto-scrolling ticker', icon: MoveRight },
  { value: 'masonry', label: 'Masonry', description: 'Pinterest-style grid', icon: Grid3X3 },
  { value: 'wall', label: 'Wall of Love', description: 'Dense review mosaic', icon: Heart },
  { value: 'spotlight', label: 'Spotlight', description: 'One cinematic review', icon: CircleDot },
  { value: 'summary', label: 'Summary', description: 'Rating overview card', icon: Star },
];

const TEMPLATES = [
  { id: 'soft', name: 'Soft Shadow', description: 'White cards, gentle shadows' },
  { id: 'glass', name: 'Glassmorphism', description: 'Frosted glass blur' },
  { id: 'minimal', name: 'Minimal', description: 'Clean border style' },
  { id: 'darkElegant', name: 'Dark Elegant', description: 'Dark sophisticated' },
  { id: 'gradientBorder', name: 'Gradient Border', description: 'Violet gradient edges' },
  { id: 'neon', name: 'Neon', description: 'Glowing neon accents' },
  { id: 'aurora', name: 'Aurora', description: 'Pastel violet-to-indigo gradient, frosted feel' },
  { id: 'spotlight', name: 'Spotlight', description: 'White card, strong single-side shadow' },
  { id: 'classic', name: 'Classic', description: 'Traditional bordered, professional look' },
  { id: 'warm', name: 'Warm', description: 'Cream background, warm subtle shadows' },
];

const FONT_OPTIONS = [
  'Auto-detect', 'Inter', 'Plus Jakarta Sans', 'Geist', 'Roboto', 'Open Sans', 'Lato',
];

const SHADOW_OPTIONS = ['None', 'Soft', 'Medium', 'Strong'];

interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
}

export default function NewWidgetPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Places search state
  const [placeQuery, setPlaceQuery] = useState('');
  const [placeResults, setPlaceResults] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [config, setConfig] = useState({
    name: '',
    layout: 'carousel',
    template: 'soft',
    maxReviews: 5,
    minRating: 1,
    animations: true,
    placeId: '',
    primaryColor: '#7C3AED',
    fontFamily: 'Auto-detect',
    borderRadius: 12,
    shadowIntensity: 'Soft',
    cardSpacing: 16,
    removeBranding: false,
    showHeader: false,
    headerText: '',
    showWriteReview: false,
    showHighlights: false,
    showVerifiedBadge: true,
    showAvatar: true,
    showDate: true,
    sortBy: 'newest',
    textLength: 150,
    colorScheme: 'auto',
    animationStyle: 'slideUp',
    starColor: '#F59E0B',
    pinnedReviews: '',
    keywords: '',
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPlaceDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPlaces = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setPlaceResults([]);
      setShowPlaceDropdown(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`);
      const data: PlaceResult[] = await res.json();
      setPlaceResults(data);
      setShowPlaceDropdown(data.length > 0);
    } catch {
      setPlaceResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handlePlaceQueryChange = (value: string) => {
    setPlaceQuery(value);
    setSelectedPlace(null);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => searchPlaces(value), 300);
  };

  const handleSelectPlace = (place: PlaceResult) => {
    setSelectedPlace(place);
    setPlaceQuery(place.name);
    setConfig({ ...config, placeId: place.placeId });
    setShowPlaceDropdown(false);
  };

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
  data-vissar-animation-style="${config.animationStyle}"
  data-vissar-color-scheme="${config.colorScheme}"
  data-vissar-sort-by="${config.sortBy}"
  data-vissar-text-length="${config.textLength}"
  data-vissar-show-header="${config.showHeader}"
  data-vissar-show-highlights="${config.showHighlights}"
  data-vissar-show-verified-badge="${config.showVerifiedBadge}"
  data-vissar-show-avatar="${config.showAvatar}"
  data-vissar-show-date="${config.showDate}"
  data-vissar-star-color="${config.starColor}"
  data-vissar-primary-color="${config.primaryColor}"${config.keywords ? `\n  data-vissar-keywords="${config.keywords}"` : ''}${config.pinnedReviews ? `\n  data-vissar-pinned-reviews="${config.pinnedReviews}"` : ''}
></div>

<script src="https://vissar.vercel.app/widget/vissar-widget.min.js" async></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const stepLabels = ['Configure', 'Style', 'Get Code'];

  return (
    <div className="overflow-x-hidden">
      {/* Page title */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-white font-semibold">Create Widget</span>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <div key={label} className="flex items-center">
                <button
                  onClick={() => setStep(stepNum)}
                  className="flex items-center gap-1.5 sm:gap-2"
                >
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all shrink-0 ${
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
                    className={`text-xs sm:text-sm font-medium ${
                      isActive ? 'text-white' : isDone ? 'text-violet-400' : 'text-slate-500'
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-3 ${
                      step > stepNum ? 'bg-violet-600' : 'bg-slate-800'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr,1fr] gap-4 sm:gap-6">
          {/* Left Panel - Config */}
          <div className="space-y-6">
            {/* Step 1: Configure */}
            {step === 1 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 space-y-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                            {Icon ? <Icon className="w-5 h-5" /> : null}
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

                {/* Business Search */}
                <div className="space-y-2" ref={dropdownRef}>
                  <label className="text-sm font-medium text-slate-300">Search Your Business</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search by business name or address..."
                      value={placeQuery}
                      onChange={(e) => handlePlaceQueryChange(e.target.value)}
                      onFocus={() => placeResults.length > 0 && setShowPlaceDropdown(true)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {showPlaceDropdown && placeResults.length > 0 && (
                      <div className="absolute z-50 top-full mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                        {placeResults.map((place) => (
                          <button
                            key={place.placeId}
                            onClick={() => handleSelectPlace(place)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-0"
                          >
                            <div className="text-sm font-medium text-white truncate">{place.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5 truncate">{place.address}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedPlace && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <Check className="w-3 h-3" />
                      <span>Selected: {selectedPlace.name}</span>
                    </div>
                  )}
                  <p className="text-xs text-slate-500">
                    Search for your business to auto-fill the Google Place ID. Leave empty for demo reviews.
                  </p>
                </div>

                {/* Advanced Settings */}
                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-1 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Advanced Settings <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-6 p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                      {/* Primary Color */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Primary Color</label>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={config.primaryColor}
                            onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                            className="w-12 h-10 rounded-lg border border-slate-600 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={config.primaryColor}
                            onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
                          />
                        </div>
                      </div>

                      {/* Font Family */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Font Family</label>
                        <select
                          value={config.fontFamily}
                          onChange={(e) => setConfig({ ...config, fontFamily: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      {/* Card Border Radius */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Card Border Radius: <span className="text-violet-400 font-semibold">{config.borderRadius}px</span>
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={24}
                          value={config.borderRadius}
                          onChange={(e) => setConfig({ ...config, borderRadius: parseInt(e.target.value) })}
                          className="w-full accent-violet-600"
                        />
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>0px</span>
                          <span>24px</span>
                        </div>
                      </div>

                      {/* Shadow Intensity */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Shadow Intensity</label>
                        <div className="flex gap-2">
                          {SHADOW_OPTIONS.map((s) => (
                            <button
                              key={s}
                              onClick={() => setConfig({ ...config, shadowIntensity: s })}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                config.shadowIntensity === s
                                  ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                                  : 'border-slate-700 text-slate-500 hover:border-slate-600'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Card Spacing */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Card Spacing: <span className="text-violet-400 font-semibold">{config.cardSpacing}px</span>
                        </label>
                        <input
                          type="range"
                          min={12}
                          max={32}
                          value={config.cardSpacing}
                          onChange={(e) => setConfig({ ...config, cardSpacing: parseInt(e.target.value) })}
                          className="w-full accent-violet-600"
                        />
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>12px</span>
                          <span>32px</span>
                        </div>
                      </div>

                      {/* Remove Branding */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-medium text-slate-300">Remove Vissar branding</div>
                            <div className="text-xs text-slate-500">Hide &quot;Powered by Vissar&quot; text</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">PRO</span>
                          <button
                            disabled
                            className="relative w-12 h-7 rounded-full bg-slate-600 cursor-not-allowed opacity-60"
                          >
                            <Lock className="absolute top-1.5 left-1.5 w-4 h-4 text-slate-400" />
                            <div className="absolute top-0.5 translate-x-0.5 w-6 h-6 rounded-full bg-white shadow" />
                          </button>
                        </div>
                      </div>

                      {/* Star Color */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Star Color</label>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={config.starColor}
                            onChange={(e) => setConfig({ ...config, starColor: e.target.value })}
                            className="w-12 h-10 rounded-lg border border-slate-600 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={config.starColor}
                            onChange={(e) => setConfig({ ...config, starColor: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
                          />
                        </div>
                      </div>

                      {/* Sort By */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Sort Reviews By</label>
                        <select
                          value={config.sortBy}
                          onChange={(e) => setConfig({ ...config, sortBy: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                          <option value="newest">Newest First</option>
                          <option value="highest">Highest Rated</option>
                          <option value="lowest">Lowest Rated</option>
                          <option value="longest">Longest Reviews</option>
                        </select>
                      </div>

                      {/* Text Length */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Text Length: <span className="text-violet-400 font-semibold">{config.textLength} chars</span>
                        </label>
                        <input
                          type="range"
                          min={50}
                          max={300}
                          value={config.textLength}
                          onChange={(e) => setConfig({ ...config, textLength: parseInt(e.target.value) })}
                          className="w-full accent-violet-600"
                        />
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>50</span>
                          <span>300</span>
                        </div>
                      </div>

                      {/* Show/Hide Toggles */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Show / Hide Elements</label>
                        {[
                          { key: 'showAvatar', label: 'Show Avatar' },
                          { key: 'showDate', label: 'Show Date' },
                          { key: 'showVerifiedBadge', label: 'Verified Badge' },
                          { key: 'showHighlights', label: 'AI Highlights' },
                        ].map((toggle) => (
                          <div key={toggle.key} className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                            <span className="text-sm text-slate-300">{toggle.label}</span>
                            <button
                              onClick={() => setConfig({ ...config, [toggle.key]: !config[toggle.key as keyof typeof config] })}
                              className={`relative w-12 h-7 rounded-full transition-colors ${
                                config[toggle.key as keyof typeof config] ? 'bg-violet-600' : 'bg-slate-600'
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                                  config[toggle.key as keyof typeof config] ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Keywords Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Keyword Filter</label>
                        <input
                          type="text"
                          placeholder="e.g. fast, professional, friendly"
                          value={config.keywords}
                          onChange={(e) => setConfig({ ...config, keywords: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <p className="text-xs text-slate-500">Comma-separated. Only show reviews containing these words.</p>
                      </div>
                    </div>
                  )}
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 space-y-6">
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

                {/* Animation Style */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Animation Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'none', label: 'None', desc: 'No animation' },
                      { value: 'fadeIn', label: 'Fade In', desc: 'Smooth opacity' },
                      { value: 'slideUp', label: 'Slide Up', desc: 'Rise from below' },
                      { value: 'scaleIn', label: 'Scale In', desc: 'Grow into view' },
                    ].map((anim) => (
                      <button
                        key={anim.value}
                        onClick={() => setConfig({ ...config, animationStyle: anim.value })}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          config.animationStyle === anim.value
                            ? 'border-violet-500 bg-violet-500/10'
                            : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                        }`}
                      >
                        <div className={`text-sm font-medium ${config.animationStyle === anim.value ? 'text-white' : 'text-slate-300'}`}>{anim.label}</div>
                        <div className="text-xs text-slate-500">{anim.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Color Scheme</label>
                  <div className="flex gap-2">
                    {['auto', 'light', 'dark'].map((scheme) => (
                      <button
                        key={scheme}
                        onClick={() => setConfig({ ...config, colorScheme: scheme })}
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${
                          config.colorScheme === scheme
                            ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                            : 'border-slate-700 text-slate-500 hover:border-slate-600'
                        }`}
                      >
                        {scheme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Section Heading */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-300">Section Heading</div>
                      <div className="text-xs text-slate-500">Add a custom headline above your reviews</div>
                    </div>
                    <button
                      onClick={() => setConfig({ ...config, showHeader: !config.showHeader })}
                      className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                        config.showHeader ? 'bg-violet-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${config.showHeader ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  {config.showHeader && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="See what our customers are saying"
                        value={config.headerText}
                        onChange={(e) => setConfig({ ...config, headerText: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
                        maxLength={80}
                      />
                      <div className="flex flex-wrap gap-2">
                        {["See what our customers are saying", "Don't just take our word for it", "Real reviews from real customers", "Trusted by our clients"].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setConfig({ ...config, headerText: preset })}
                            className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:border-violet-500 hover:text-violet-300 transition-all"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Write a Review Button */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div>
                    <div className="text-sm font-medium text-slate-300">Write a Review Button</div>
                    <div className="text-xs text-slate-500">Links visitors directly to your Google review page</div>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, showWriteReview: !config.showWriteReview })}
                    className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                      config.showWriteReview ? 'bg-violet-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${config.showWriteReview ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Show Header Toggle - existing */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div>
                    <div className="text-sm font-medium text-slate-300">Business Header Bar</div>
                    <div className="text-xs text-slate-500">Show business name &amp; overall rating above widget</div>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, showHeader: !config.showHeader })}
                    className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                      config.showHeader ? 'bg-violet-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${config.showHeader ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Install Your Widget</h2>
                  <p className="text-sm text-slate-400 mt-1">Copy your code, then follow the guide for your platform</p>
                </div>

                {/* The code — 1 line, prominent */}
                <div className="bg-slate-950 border border-slate-700 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
                    <span className="text-xs font-medium text-slate-400">Embed Code</span>
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        isCopied ? 'bg-emerald-600/20 text-emerald-400' : 'bg-violet-600/20 text-violet-400 hover:bg-violet-600/30'
                      }`}
                    >
                      {isCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </button>
                  </div>
                  <div className="p-3 sm:p-4 overflow-x-auto">
                    <code className="text-xs sm:text-sm text-green-400 font-mono">
                      <span className="block break-all">{`<div id="vissar-${config.name.toLowerCase().replace(/\s+/g, '-') || 'my-widget'}"></div>`}</span>
                      <span className="block break-all mt-1">{`<script src="https://cdn.vissar.com/widget.js" data-widget="${config.name.toLowerCase().replace(/\s+/g, '-') || 'my-widget'}" async></script>`}</span>
                    </code>
                  </div>
                </div>

                {/* Full config — collapsed by default */}
                <details className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-sm text-slate-500 hover:text-slate-300 transition-colors list-none">
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                    Advanced: show full config code
                  </summary>
                  <div className="mt-3 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                    <pre className="p-3 text-xs text-slate-400 font-mono overflow-x-auto leading-relaxed max-h-40 overflow-y-auto break-all whitespace-pre-wrap">
                      {embedCode}
                    </pre>
                  </div>
                </details>

                {/* Platform guides */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Install on your platform</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "WordPress", step: "Appearance → Theme Editor → paste before </body>" },
                      { name: "Webflow", step: "Project Settings → Custom Code → paste in Footer" },
                      { name: "Shopify", step: "Online Store → Themes → Edit code → theme.liquid" },
                      { name: "Wix", step: "Settings → Custom Code → Add code to head/body" },
                      { name: "Squarespace", step: "Settings → Advanced → Code Injection → Footer" },
                      { name: "Any site", step: "Paste the code before </body> in your HTML" },
                    ].map((platform) => (
                      <div key={platform.name} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                        <p className="text-xs font-semibold text-white mb-1">{platform.name}</p>
                        <p className="text-[11px] text-slate-400 leading-snug">{platform.step}</p>
                      </div>
                    ))}
                  </div>
                </div>

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
                    {isSaving ? 'Saving...' : 'Save Widget'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Live Preview (always visible, scrolls on mobile) */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-sm text-slate-400 font-medium">Live Preview</span>
                </div>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">{config.template} · {config.layout}</span>
              </div>
              <div className="h-[300px] sm:h-[400px] lg:h-[500px] overflow-y-auto">
                <WidgetPreview
                  layout={config.layout}
                  template={config.template}
                  maxReviews={config.maxReviews}
                  animations={config.animations}
                  animationStyle={config.animationStyle}
                  primaryColor={config.primaryColor}
                  borderRadius={config.borderRadius}
                  shadowIntensity={config.shadowIntensity}
                  cardSpacing={config.cardSpacing}
                  showAvatar={config.showAvatar}
                  showDate={config.showDate}
                  starColor={config.starColor}
                  colorScheme={config.colorScheme}
                  showHeader={config.showHeader}
                  headerText={config.headerText}
                  showWriteReview={config.showWriteReview}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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
    neon: 'bg-slate-900 border border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]',
    aurora: 'bg-gradient-to-br from-violet-200/60 to-indigo-200/60 border border-violet-300/50',
    spotlight: 'bg-white shadow-[4px_4px_12px_rgba(0,0,0,0.15)] border border-slate-100',
    classic: 'bg-white border-2 border-slate-400 rounded-none',
    warm: 'bg-amber-50 border border-amber-200/60 shadow-sm',
  };

  const isDark = templateId === 'darkElegant' || templateId === 'neon';
  const isWarm = templateId === 'warm';

  return (
    <div className={`w-14 h-10 rounded-lg ${swatchStyles[templateId] || swatchStyles.soft}`}>
      <div className="p-1.5 space-y-1">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-1 h-1 rounded-full ${isWarm ? 'bg-amber-500' : 'bg-amber-400'}`} />
          ))}
        </div>
        <div className={`h-0.5 w-8 rounded ${isDark ? 'bg-slate-600' : isWarm ? 'bg-amber-300' : 'bg-slate-200'}`} />
        <div className={`h-0.5 w-6 rounded ${isDark ? 'bg-slate-600' : isWarm ? 'bg-amber-300' : 'bg-slate-200'}`} />
      </div>
    </div>
  );
}
