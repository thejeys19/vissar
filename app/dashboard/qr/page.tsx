"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, QrCode, ExternalLink } from "lucide-react";

export default function QRCodePage() {
  const [url, setUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const generateQR = () => {
    if (!url.trim()) return;
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url.trim())}`
    );
  };

  const handleDownload = async () => {
    if (!qrUrl) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "review-qr-code.png";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(qrUrl, "_blank");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">QR Code Generator</h1>
        <p className="text-slate-400 mt-1">
          Generate a QR code for your Google review link
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-violet-400" />
            Review URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://search.google.com/local/writereview?placeid=..."
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
          <Button
            onClick={generateQR}
            disabled={!url.trim()}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 w-full"
          >
            Generate QR Code
          </Button>
        </CardContent>
      </Card>

      {qrUrl && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-8 flex flex-col items-center space-y-6">
            <div className="bg-white rounded-2xl p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="QR Code"
                width={300}
                height={300}
                className="w-[300px] h-[300px]"
              />
            </div>
            <Button
              onClick={handleDownload}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-violet-400" />
            How to use
          </h3>
          <ol className="text-slate-400 text-sm space-y-2 list-decimal list-inside">
            <li>Paste your Google review link above</li>
            <li>Click &quot;Generate QR Code&quot;</li>
            <li>Download the QR code image</li>
            <li>Print it and place it at your counter, on receipts, or table tents</li>
            <li>Customers scan to leave a review instantly</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
