"use client";

import { useState } from "react";
import { Layers, Check, AlertCircle, Loader2 } from "lucide-react";

interface BulkResult {
  name: string;
  status: "pending" | "success" | "error";
  id?: string;
  error?: string;
}

export default function BulkCreatePage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<BulkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBulkCreate = async () => {
    const names = input
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length === 0) return;

    setIsRunning(true);
    setProgress(0);
    const initialResults: BulkResult[] = names.map((name) => ({
      name,
      status: "pending",
    }));
    setResults(initialResults);

    for (let i = 0; i < names.length; i++) {
      try {
        const res = await fetch("/api/widget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: names[i],
            layout: "carousel",
            template: "soft",
            maxReviews: 5,
            minRating: 1,
            animations: true,
          }),
        });

        if (!res.ok) throw new Error("Failed to create widget");
        const saved = await res.json();

        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "success", id: saved.id } : r
          )
        );
      } catch {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "error", error: "Failed to create" } : r
          )
        );
      }
      setProgress(((i + 1) / names.length) * 100);
    }

    setIsRunning(false);
  };

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Bulk Create</h1>
        <p className="text-slate-400 mt-1">
          Create multiple widgets at once by pasting business names
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Business Names</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Enter one business name per line. A widget with default settings will
          be created for each.
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Joe's Coffee Shop\nMain Street Dental\nSunrise Bakery"}
          rows={8}
          disabled={isRunning}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-600 resize-none disabled:opacity-50"
        />
        <button
          onClick={handleBulkCreate}
          disabled={isRunning || !input.trim()}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Layers className="w-4 h-4" />
              Create Widgets for All
            </>
          )}
        </button>
      </div>

      {/* Progress */}
      {results.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Progress</h2>
            <span className="text-sm text-slate-400">
              {successCount} created
              {errorCount > 0 && ` / ${errorCount} failed`}
              {" / "}
              {results.length} total
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden mb-5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-2">
            {results.map((result, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <span className="text-sm text-white">{result.name}</span>
                <div className="flex items-center gap-2">
                  {result.status === "pending" && (
                    <span className="text-xs text-slate-500">Pending</span>
                  )}
                  {result.status === "success" && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> Created
                    </span>
                  )}
                  {result.status === "error" && (
                    <span className="flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="w-3.5 h-3.5" /> Failed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
