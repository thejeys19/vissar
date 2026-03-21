import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: Request, { params: _params }: { params: { id: string } }) {
  // Common positive theme keywords for future extractive analysis
  const _themes: Record<string, string[]> = {
    "Easy setup": ["easy", "simple", "quick", "minutes", "setup", "fast setup"],
    "Great support": ["support", "helpful", "responsive", "team", "service"],
    "Looks native": ["native", "blend", "match", "design", "beautiful", "looks"],
    "Saves time": ["time", "automated", "automatic", "saves", "hours"],
    "Increased conversions": ["conversion", "sales", "customers", "trust", "credibility"],
    "Mobile friendly": ["mobile", "phone", "responsive", "device"],
    "Easy to customize": ["customize", "custom", "style", "colors", "fonts"],
    "Affordable": ["price", "affordable", "cheap", "value", "worth"],
    "Fast loading": ["fast", "speed", "quick", "performance", "load"],
    "Professional": ["professional", "premium", "polished", "clean"],
  };
  void _themes;

  // For now return mock highlights (real implementation would fetch reviews and count keyword matches)
  const mockHighlights = ["Easy 2-min setup", "Matches any design", "Boosts conversions", "Mobile optimized"];

  return NextResponse.json(
    { highlights: mockHighlights },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
}
