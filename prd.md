# Client Reporting Dashboard — Requirements Spec

## Overview

A JSON-driven, branded client reporting dashboard for DigitalNova Studio. Each weekly report is defined by a JSON file — the app renders it into a polished, interactive dashboard page. Deployed on Cloudflare Pages.

## Tech Stack

- **Framework:** Next.js (App Router) or Vite + React
- **Styling:** Tailwind CSS
- **Charts:** Recharts (or Chart.js)
- **Deployment:** Cloudflare Pages
- **Data:** Static JSON files (no backend/database needed for v1)

## URL Structure

```
reports.digitalnovastudio.com/
├── /                          → Client selector / index
├── /[client]/                 → Latest report for that client
├── /[client]/[date]           → Specific weekly report (e.g., /finalbit/2026-03-21)
```

## File Structure

```
/src
  /components
    MetricCard.tsx          → Single stat card (value, label, note, good/bad indicator)
    MetricGrid.tsx          → Grid of 3-5 MetricCards
    FunnelChart.tsx         → Stepped funnel visualization (like the one in the HTML report)
    BarChart.tsx            → Bar chart wrapper (Recharts)
    DoughnutChart.tsx       → Doughnut/pie chart wrapper
    LineChart.tsx           → Line chart for trends over time
    FindingsGrid.tsx        → 2-column grid of insight cards (icon, title, description)
    Timeline.tsx            → Vertical timeline with done/pending states
    NextSteps.tsx           → Bulleted next steps card
    ReportHeader.tsx        → Client name, report period, DigitalNova branding
    ReportFooter.tsx        → Confidential notice, branding
  /layouts
    ReportLayout.tsx        → Shared layout with dark theme, header, footer
  /data
    /finalbit
      2026-03-21.json       → Week 1 report
    /eventcombo
      2026-03-21.json
    /mobilecraftbars
      2026-03-21.json
  /app (or /pages)
    /[client]/[date]/page.tsx  → Dynamic route that loads JSON + renders report
```

## JSON Schema

Each report JSON file follows this schema:

```json
{
  "client": "FinalBit",
  "clientLogo": "/logos/finalbit.png",
  "reportTitle": "Meta Ads Week 1 Report",
  "reportSubtitle": "Campaign Performance & Optimization Summary",
  "period": "Feb 18 – Mar 19, 2026",
  "date": "2026-03-21",
  "platform": "Meta Ads",

  "metrics": [
    {
      "label": "Ad Spend",
      "value": "$310",
      "note": "of $1,500/mo budget",
      "status": "neutral"
    },
    {
      "label": "Impressions",
      "value": "4,465",
      "note": "CPM: $69.51",
      "status": "neutral"
    },
    {
      "label": "Click-Through Rate",
      "value": "2.17%",
      "note": "Strong for cold B2B",
      "status": "good"
    },
    {
      "label": "Cost Per Click",
      "value": "$3.20",
      "note": "Efficient for this space",
      "status": "good"
    }
  ],

  "funnel": {
    "title": "Landing Page Funnel",
    "source": "PostHog",
    "steps": [
      { "label": "Landed on Page", "count": 97, "pct": 100 },
      { "label": "Clicked Through", "count": 21, "pct": 21.65 },
      { "label": "CTA Interaction", "count": 7, "pct": 7.22 }
    ],
    "notes": "Median time: Landing → Click-through: 10s | Click-through → CTA: 1m 7s"
  },

  "charts": [
    {
      "id": "ad-performance",
      "type": "bar",
      "title": "Ad Performance Breakdown",
      "data": {
        "labels": ["Impressions", "Reach", "Link Clicks", "Page Views"],
        "values": [4465, 3800, 97, 97]
      }
    },
    {
      "id": "funnel-breakdown",
      "type": "doughnut",
      "title": "Funnel Conversion Rates",
      "data": {
        "labels": [
          "Clicked Through (21.65%)",
          "CTA Interaction (7.22%)",
          "Bounced (71.13%)"
        ],
        "values": [21.65, 7.22, 71.13]
      }
    }
  ],

  "findings": [
    {
      "icon": "target",
      "title": "Ad Creative Is Working",
      "description": "2.17% CTR on cold prospecting is well above average for B2B campaigns. The messaging resonates with the target audience and is driving quality traffic at an efficient $3.20 CPC.",
      "highlight": true
    },
    {
      "icon": "search",
      "title": "Tracking Gap Identified & Fixed",
      "description": "We discovered and resolved a PostHog tracking issue early on. Corrected data reveals real engagement happening — 21.65% of visitors click through and 7.22% interact with a CTA.",
      "highlight": false
    },
    {
      "icon": "trending-up",
      "title": "Funnel Optimization Opportunity",
      "description": "The original landing page added an unnecessary decision step. By simplifying the user journey, we expect to see significant improvement in click-through and conversion rates.",
      "highlight": false
    },
    {
      "icon": "zap",
      "title": "New Landing Page Deployed",
      "description": "A redesigned page now leads with the 'One Platform Replaces 4+ Tools' value prop, competitor comparison, and all pricing tiers — capturing interest across every budget level.",
      "highlight": true
    }
  ],

  "actions": [
    {
      "title": "Fixed Analytics Tracking",
      "description": "Resolved PostHog integration issue to get full funnel visibility.",
      "status": "done"
    },
    {
      "title": "Redesigned Landing Page",
      "description": "Consolidated into a single page with value prop, competitor comparison, all pricing tiers, and social proof.",
      "status": "done"
    },
    {
      "title": "Optimized CTAs",
      "description": "Hero CTAs now anchor to pricing section instead of booking demos.",
      "status": "done"
    },
    {
      "title": "Added Granular Tracking",
      "description": "Every CTA button now has a unique PostHog ID for engagement tracking.",
      "status": "done"
    },
    {
      "title": "Updated Ad Destination",
      "description": "Meta ad URL now points to the new optimized page.",
      "status": "done"
    }
  ],

  "nextSteps": [
    "CTA click-through rates on the new page (by button ID)",
    "Which pricing tier gets the most engagement",
    "Demo bookings (Enterprise) vs. free signups (other tiers)",
    "Overall funnel conversion rate improvement vs. Week 1 baseline",
    "Mid-week check-in if we see meaningful early movement"
  ]
}
```

## Design Spec

### Theme

- **Background:** Dark (#0f1117)
- **Cards:** #1a1a2e with #2a2a3e borders
- **Primary accent:** Indigo (#818cf8 / #6366f1)
- **Good indicators:** Emerald (#34d399)
- **Warning indicators:** Amber (#fbbf24)
- **Text:** White (#fff) for headings, #a1a1aa for body, #71717a for muted
- **Border radius:** 12px on cards
- **Font:** System font stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)

### Components

**ReportHeader**

- DigitalNova Studio brand label (uppercase, letter-spaced, indigo)
- Report title (h1, white, 32px)
- Subtitle (16px, muted)
- Date/period (14px, very muted)

**MetricCard**

- Label (uppercase, 13px, muted)
- Value (28px, bold, white)
- Note (13px, colored by status: neutral=indigo, good=emerald, bad=red)

**FunnelChart**

- Horizontal stepped bars decreasing in size left to right
- Each step shows: count (inside bar), label (below), percentage (below label)
- Color gradient from indigo → purple across steps
- Connecting arrows between steps
- Footer note with median conversion times

**FindingsGrid**

- 2-column grid
- Each card: icon (from lucide-react), title, description
- `highlight: true` cards get indigo border + gradient background

**Timeline**

- Vertical line with dots (green=done, indigo=pending)
- Title + description per item

**NextSteps**

- Indigo gradient card
- Arrow-prefixed list items

### Responsive

- 4-col metric grid → 2-col on mobile
- 2-col findings/charts → 1-col on mobile
- Funnel goes vertical on mobile

## Future Enhancements (v2)

- **Password protection:** Simple auth per client (Cloudflare Access or basic auth)
- **Historical comparison:** Show week-over-week trends in metrics
- **Automated JSON generation:** Script that pulls from Meta Ads API + PostHog API and generates the JSON
- **Email notifications:** Auto-send clients a link when a new report is published
- **White-labeling:** Option to hide DigitalNova branding for clients who want their own brand
- **PDF export:** One-click export for clients who need offline copies
- **Multi-platform:** Support Google Ads, LinkedIn Ads, SEO reports (different chart types per platform)

## Reference

The HTML file at `Claude/Outbox/finalbit-week1-report.html` is the visual reference for the design — the React version should match this look and feel exactly.
