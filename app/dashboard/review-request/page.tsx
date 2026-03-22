"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, ExternalLink, MessageSquare, Mail, Phone, QrCode, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";

interface Widget {
  id: string;
  name: string;
  placeId?: string;
}

export default function ReviewRequestPage() {
  const [copied, setCopied] = useState(false);
  const [templateCopied, setTemplateCopied] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [customPlaceId, setCustomPlaceId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch("/api/widget")
      .then(r => r.ok ? r.json() : [])
      .then((ws: Widget[]) => {
        setWidgets(ws);
        // Auto-select first widget with a place ID
        const withPlace = ws.find(w => w.placeId && w.placeId !== "mock");
        if (withPlace) setSelectedWidget(withPlace);
      })
      .catch(() => {});
  }, []);

  const effectivePlaceId = selectedWidget?.placeId || customPlaceId || "";
  const reviewUrl = effectivePlaceId
    ? `https://search.google.com/local/writereview?placeid=${effectivePlaceId}`
    : "";
  const qrUrl = reviewUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(reviewUrl)}`
    : "";

  const copyLink = () => {
    if (!reviewUrl) return;
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyTemplate = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setTemplateCopied(key);
    setTimeout(() => setTemplateCopied(null), 2000);
  };

  const templates = reviewUrl
    ? [
        {
          key: "whatsapp",
          icon: MessageSquare,
          label: "WhatsApp",
          color: "text-green-400",
          message: `Hi! We'd love your feedback. Could you leave us a quick Google review? It takes less than a minute: ${reviewUrl}`,
        },
        {
          key: "email",
          icon: Mail,
          label: "Email",
          color: "text-blue-400",
          message: `Subject: We'd love your feedback!\n\nHi [Name],\n\nThank you for choosing us! If you have a moment, we'd really appreciate a Google review. It helps other customers find us.\n\n${reviewUrl}\n\nThank you!`,
        },
        {
          key: "sms",
          icon: Phone,
          label: "SMS",
          color: "text-violet-400",
          message: `Thanks for visiting! We'd love a quick Google review: ${reviewUrl}`,
        },
      ]
    : [];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Get More Reviews</h1>
        <p className="text-slate-400 mt-1">
          Share your review link to collect more Google reviews
        </p>
      </div>

      {/* Select Widget / Place */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-base">Select Business</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {widgets.length > 0 ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none hover:border-slate-600 transition-colors"
              >
                <span>{selectedWidget ? selectedWidget.name : "Select a widget…"}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-10 shadow-xl">
                  {widgets.map(w => (
                    <button
                      key={w.id}
                      onClick={() => { setSelectedWidget(w); setShowDropdown(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-700 transition-colors text-left ${
                        selectedWidget?.id === w.id ? 'text-violet-400' : 'text-white'
                      }`}
                    >
                      <span>{w.name}</span>
                      {w.placeId && w.placeId !== 'mock' ? (
                        <span className="text-xs text-emerald-400">✓ Place ID set</span>
                      ) : (
                        <span className="text-xs text-slate-500">No Place ID</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {(!selectedWidget?.placeId || selectedWidget?.placeId === 'mock') && (
            <div>
              <p className="text-xs text-slate-400 mb-2">
                {widgets.length === 0
                  ? "No widgets yet — enter your Google Place ID manually:"
                  : "This widget has no Place ID — enter it manually:"}
              </p>
              <input
                type="text"
                placeholder="e.g. ChIJyYEcRCI1K4gRk_bQXZGjMD8"
                value={customPlaceId}
                onChange={e => setCustomPlaceId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Find your Place ID at <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Google Place ID Finder</a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Link */}
      {reviewUrl ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-violet-400" />
              Your Google Review Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <input
                readOnly
                value={reviewUrl}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none"
              />
              <Button onClick={copyLink} className="bg-violet-600 hover:bg-violet-700 shrink-0">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
              </Button>
            </div>
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Test link
            </a>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-900 border-slate-800 border-dashed">
          <CardContent className="p-8 text-center text-slate-500 text-sm">
            Select a business above to generate your review link
          </CardContent>
        </Card>
      )}

      {/* QR Code */}
      {qrUrl && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-violet-400" />
              QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-6">
            <div className="bg-white rounded-xl p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="Review QR Code" width={200} height={200} />
            </div>
            <div className="text-sm text-slate-400 space-y-2">
              <p>Print this QR code and place it at:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your front counter or checkout area</li>
                <li>Receipt printouts</li>
                <li>Table tents or menus</li>
                <li>Business cards</li>
              </ul>
              <Button asChild variant="outline" size="sm" className="mt-3 border-slate-700 text-slate-300 hover:bg-slate-800">
                <Link href="/dashboard/qr">
                  Customize QR Code
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sharing Templates */}
      {templates.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Sharing Templates</h2>
          <div className="space-y-4">
            {templates.map((t) => (
              <Card key={t.label} className="bg-slate-900 border-slate-800">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <t.icon className={`w-5 h-5 ${t.color}`} />
                    <h3 className="text-white font-semibold">{t.label}</h3>
                  </div>
                  <pre className="text-slate-400 text-sm whitespace-pre-wrap bg-slate-800 rounded-lg p-4 font-sans leading-relaxed">
                    {t.message}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={() => copyTemplate(t.key, t.message)}
                  >
                    {templateCopied === t.key ? (
                      <><Check className="w-3 h-3 mr-1.5 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
                    ) : (
                      <><Copy className="w-3 h-3 mr-1.5" />Copy Template</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pro Teaser */}
      <Card className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-violet-500/30">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Coming Soon: Automated Review Requests</h3>
            <p className="text-slate-400 text-sm mb-3">
              Automatically send review request emails to your customers after their visit. Set it and forget it.
            </p>
            <span className="inline-block px-3 py-1 bg-violet-500/20 rounded-full text-xs font-semibold text-violet-300">
              Pro Feature
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
