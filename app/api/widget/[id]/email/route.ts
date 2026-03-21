export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

// Sample reviews for the email widget (in production, fetched from DB)
const sampleReviews = [
  { author: "Emma W.", rating: 5, text: "Absolutely fantastic service. Would recommend to anyone looking for quality and reliability." },
  { author: "James C.", rating: 5, text: "Setup was incredibly easy and the results speak for themselves. Our conversions went up immediately." },
  { author: "Lena R.", rating: 5, text: "The best review widget we've tried. Looks native on our site and customers love it." },
];

function stars(count: number): string {
  return "★".repeat(count) + "☆".repeat(5 - count);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reviews</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;">
  <tr>
    <td style="padding:24px 32px 16px;background:linear-gradient(135deg,#7c3aed,#9333ea);color:#ffffff;">
      <h2 style="margin:0;font-size:20px;font-weight:bold;">What Our Customers Say</h2>
    </td>
  </tr>
  ${sampleReviews
    .map(
      (r, i) => `
  <tr>
    <td style="padding:20px 32px;${i < sampleReviews.length - 1 ? "border-bottom:1px solid #e2e8f0;" : ""}">
      <div style="color:#f59e0b;font-size:18px;letter-spacing:2px;margin-bottom:8px;">${stars(r.rating)}</div>
      <p style="margin:0 0 8px;color:#334155;font-size:14px;line-height:1.6;">&ldquo;${r.text}&rdquo;</p>
      <p style="margin:0;color:#94a3b8;font-size:12px;font-weight:600;">&mdash; ${r.author}</p>
    </td>
  </tr>`
    )
    .join("")}
  <tr>
    <td style="padding:20px 32px 24px;text-align:center;">
      <a href="https://vissar.app/widget/${id}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">View All Reviews</a>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 32px;background:#f1f5f9;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:11px;">Powered by <a href="https://vissar.app" style="color:#7c3aed;text-decoration:none;">Vissar</a></p>
    </td>
  </tr>
</table>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
