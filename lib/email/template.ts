// Plain-HTML email template. Avoids React Email so no new UI dependency
// is added to the build. Every outgoing recommendation email carries the
// mandated market-risk line.

export type RecommendationForEmail = {
  symbol: string;
  action: string;
  weight_pct: number | null;
  price: number | null;
  as_of: string;
  expires_at: string | null;
  admin_remark?: string | null;
};

export type TemplateInput = {
  strategyName: string;
  dashboardUrl: string;
  recommendations: RecommendationForEmail[];
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export function recommendationEmailSubject(strategyName: string): string {
  return `New recommendations — ${strategyName}`;
}

export function renderRecommendationEmail(input: TemplateInput): string {
  const rows = input.recommendations
    .map((r) => {
      const weight =
        r.weight_pct !== null ? `${Number(r.weight_pct).toFixed(2)}%` : "—";
      const price =
        r.price !== null ? `₹${Number(r.price).toLocaleString("en-IN")}` : "—";
      const remark = r.admin_remark
        ? `<div style="margin-top:6px;padding:8px 10px;background:#faf8f4;border-left:2px solid #1e3a5f;font-size:12px;color:#3a3a36;line-height:1.6;">${escapeHtml(r.admin_remark)}</div>`
        : "";
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e4e0;font-family:Georgia,serif;font-weight:600;">${escapeHtml(r.symbol)}${remark}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e4e0;text-transform:uppercase;font-size:12px;letter-spacing:0.05em;">${escapeHtml(r.action)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e4e0;">${weight}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e4e0;">${price}</td>
        </tr>`;
    })
    .join("");

  const asOf = input.recommendations[0]?.as_of;
  const expires = input.recommendations[0]?.expires_at;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(recommendationEmailSubject(input.strategyName))}</title>
</head>
<body style="margin:0;padding:0;background:#faf8f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111;">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px;">
    <p style="margin:0 0 24px 0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#6e6c67;">
      SIMPLICIAL CAPITAL
    </p>

    <h1 style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:26px;font-weight:600;">
      New recommendations
    </h1>
    <p style="margin:0 0 24px 0;color:#555;">
      ${escapeHtml(input.strategyName)} &middot; published ${escapeHtml(asOf ? fmtDate(asOf) : "today")}
    </p>

    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e4e0;border-radius:6px;font-size:14px;">
      <thead>
        <tr style="background:#faf8f4;">
          <th align="left" style="padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6e6c67;font-weight:500;">Symbol</th>
          <th align="left" style="padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6e6c67;font-weight:500;">Action</th>
          <th align="left" style="padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6e6c67;font-weight:500;">Weight</th>
          <th align="left" style="padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6e6c67;font-weight:500;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    ${expires ? `<p style="margin:16px 0 0 0;font-size:13px;color:#6e6c67;">These recommendations remain current until ${escapeHtml(fmtDate(expires))}.</p>` : ""}

    <div style="margin:32px 0;text-align:center;">
      <a href="${escapeHtml(input.dashboardUrl)}"
         style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:500;">
        Open dashboard
      </a>
    </div>

    <p style="margin:0 0 12px 0;font-size:13px;color:#555;line-height:1.7;">
      You are receiving this email because you hold an active subscription to
      ${escapeHtml(input.strategyName)} on Simplicial Capital. Recommendations are for
      information and research purposes only and do not constitute personalised
      investment advice. You execute trades yourself, through your own broker.
    </p>

    <p style="margin:0;font-size:12px;color:#6e6c67;line-height:1.7;border-top:1px solid #e5e4e0;padding-top:16px;">
      Investment in securities market are subject to market risks. Read all the
      related documents carefully before investing.
    </p>
  </div>
</body>
</html>`;
}
