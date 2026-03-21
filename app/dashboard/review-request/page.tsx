"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, ExternalLink, MessageSquare, Mail, Phone, QrCode, Sparkles } from "lucide-react";
import Link from "next/link";

const SAMPLE_PLACE_ID = "ChIJN1t_tDeuEmsRUsoyG83frY4";

export default function ReviewRequestPage() {
  const [copied, setCopied] = useState(false);
  const [placeId] = useState(SAMPLE_PLACE_ID);

  const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(reviewUrl)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const templates = [
    {
      icon: MessageSquare,
      label: "WhatsApp",
      color: "text-green-400",
      message: `Hi! We'd love your feedback. Could you leave us a quick Google review? It takes less than a minute: ${reviewUrl}`,
    },
    {
      icon: Mail,
      label: "Email",
      color: "text-blue-400",
      message: `Subject: We'd love your feedback!\n\nHi [Name],\n\nThank you for choosing us! If you have a moment, we'd really appreciate a Google review. It helps other customers find us.\n\n${reviewUrl}\n\nThank you!`,
    },
    {
      icon: Phone,
      label: "SMS",
      color: "text-violet-400",
      message: `Thanks for visiting! We'd love a quick Google review: ${reviewUrl}`,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Get More Reviews</h1>
        <p className="text-slate-400 mt-1">
          Share your review link to collect more Google reviews
        </p>
      </div>

      {/* Review Link */}
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
        </CardContent>
      </Card>

      {/* QR Code */}
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

      {/* Sharing Templates */}
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
                  onClick={() => {
                    navigator.clipboard.writeText(t.message);
                  }}
                >
                  <Copy className="w-3 h-3 mr-1.5" />
                  Copy Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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
