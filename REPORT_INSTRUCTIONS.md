# Creating Weekly Report JSON Files

This document explains how to create the JSON data files that power each weekly client report.

## File Location

Reports live in `src/data/[client-slug]/[date].json`.

Example: `src/data/finalbit/2026-03-21.json`

The date should be the report delivery date in `YYYY-MM-DD` format. The client slug must match the key in `src/lib/clients.ts`.

## JSON Schema

```json
{
  "client": "ClientName",
  "reportTitle": "Meta Ads Week 1 Report",
  "reportSubtitle": "Campaign Performance & Optimization Summary",
  "period": "Feb 18 – Mar 19, 2026",
  "date": "2026-03-21",
  "platform": "Meta Ads",
  "summary": "",

  "metrics": [],
  "funnel": {},
  "charts": [],
  "findings": [],
  "actions": [],
  "nextSteps": [],
  "videoUrl": ""
}
```

## Field-by-Field Guide

### Top-Level Fields

| Field | Required | Description |
|-------|----------|-------------|
| `client` | Yes | Display name of the client (e.g., "FinalBit") |
| `reportTitle` | Yes | Main title shown in the header (e.g., "Meta Ads Week 3 Report") |
| `reportSubtitle` | Yes | Subtitle under the title (e.g., "Campaign Performance & Optimization Summary") |
| `period` | Yes | Date range the data covers (e.g., "Feb 18 – Mar 19, 2026") |
| `date` | Yes | Report date, must match filename (e.g., "2026-03-21") |
| `platform` | Yes | Ad platform name, shown as a badge (e.g., "Meta Ads", "Google Ads") |
| `summary` | No | A 2-3 sentence TL;DR shown at the top of the report. Should give the client the headline story before they dive into the numbers. Cover: what the focus was, what's working, what was done, and what's next. |
| `videoUrl` | No | Supercut share URL for the video walkthrough. Just the share link — the app converts it to an embed automatically. Example: `https://supercut.ai/share/digitalnova-studio/abc123` |

### metrics (array of objects)

The 3-5 headline KPIs shown at the top. Keep to 4 for best layout.

```json
{
  "label": "Ad Spend",
  "value": "$310",
  "note": "of $1,500/mo budget",
  "status": "neutral"
}
```

| Field | Description |
|-------|-------------|
| `label` | Short metric name (shown uppercase). Keep to 2-3 words. |
| `value` | The number. Pre-formatted as a string — include `$`, `%`, commas as needed. |
| `note` | Context line below the value. Benchmark comparison, budget context, or a short interpretation. |
| `status` | `"good"` (green), `"bad"` (red), or `"neutral"` (uses client's secondary brand color). Use "good" when the metric is clearly positive, "bad" when it needs attention, "neutral" for informational. |

**Tips for writing metrics:**
- The "Ad Spend" metric is special — if its label contains "spend", the funnel will automatically calculate cost-per-user at each step.
- Format values for quick scanning: `$3.20` not `$3.196`, `4,465` not `4465`, `2.17%` not `0.0217`.
- Notes should give context, not repeat the value. Good: "Strong for cold B2B". Bad: "Click-through rate is 2.17%".

### funnel (object, optional)

The waterfall funnel chart. Best for showing a multi-step conversion path.

```json
{
  "title": "Landing Page Funnel",
  "source": "PostHog",
  "steps": [
    { "label": "Landed on Page", "count": 97, "pct": 100 },
    { "label": "Clicked Through", "count": 21, "pct": 21.65 },
    { "label": "CTA Interaction", "count": 7, "pct": 7.22 }
  ],
  "notes": "Median time: Landing → Click-through: 10s | Click-through → CTA: 1m 7s"
}
```

| Field | Description |
|-------|-------------|
| `title` | Funnel name (e.g., "Landing Page Funnel", "Purchase Funnel") |
| `source` | Where the data comes from (e.g., "PostHog", "Google Analytics") |
| `steps` | Array of funnel stages, top to bottom. Each has `label`, `count` (absolute number), and `pct` (percentage of the first step). The first step should always have `pct: 100`. |
| `notes` | Footer text. Good place for timing data, conversion benchmarks, or caveats. |

**Tips:**
- 3-5 steps works best visually.
- The bar heights are proportional to count, so large drop-offs between steps are visually clear.
- Cost-per-user is calculated automatically if there's a "spend" metric.

### charts (array of objects)

Bar charts and doughnut charts. Each gets rendered in a 2-column grid.

```json
{
  "id": "ad-performance",
  "type": "bar",
  "title": "Ad Performance Breakdown",
  "data": {
    "labels": ["Impressions", "Reach", "Link Clicks"],
    "values": [4465, 3800, 97]
  }
}
```

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (kebab-case) |
| `type` | `"bar"` or `"doughnut"` |
| `title` | Chart heading |
| `data.labels` | Array of category names |
| `data.values` | Array of numbers (same length as labels) |

**Tips:**
- Avoid mixing wildly different scales in the same bar chart (e.g., 4,465 impressions and 97 clicks makes the clicks bar invisible). Either use separate charts or use the funnel for that story.
- For doughnut charts, values should be percentages that sum to ~100.
- Include the percentage in the doughnut label for clarity: `"Clicked Through (21.65%)"`.

### findings (array of objects)

Key insights rendered as numbered cards in a 2-column grid.

```json
{
  "icon": "search",
  "title": "Tracking Gap Identified & Fixed",
  "description": "We discovered and resolved a PostHog tracking issue...",
  "highlight": false
}
```

| Field | Description |
|-------|-------------|
| `icon` | Currently unused in the UI (kept for schema compatibility). Can be any string. |
| `title` | Short, punchy finding title. Lead with the insight, not the data. |
| `description` | 1-2 sentences explaining the finding with supporting data. |
| `highlight` | Currently unused (all cards have the same styling). Can be `true` or `false`. |

**Tips for writing findings:**
- 2-4 findings is the sweet spot. More than 4 dilutes impact.
- Each finding should answer "so what?" — not just state a number, but explain what it means for the client.
- Lead with action-oriented titles: "Ad Creative Is Working" > "CTR Data Summary".
- Include specific numbers in the description to back up the title.

### actions (array of objects)

What was done this week. Rendered as numbered cards in a 2-column grid.

```json
{
  "title": "Redesigned Landing Page",
  "description": "Consolidated into a single page with value prop, competitor comparison, all pricing tiers, and social proof.",
  "status": "done"
}
```

| Field | Description |
|-------|-------------|
| `title` | What was done (past tense, concise) |
| `description` | Brief explanation of the action and why it matters. |
| `status` | `"done"` (green number) or `"pending"` (uses brand color) |

**Tips:**
- Be specific: "Redesigned Landing Page" > "Made updates".
- Connect the action to a result or hypothesis: "Hero CTAs now anchor to pricing section instead of booking demos" tells the client *what changed* and *why*.

### nextSteps (array of strings)

What to watch for next week. Rendered as an arrow-prefixed list.

```json
[
  "CTA click-through rates on the new page (by button ID)",
  "Which pricing tier gets the most engagement",
  "Demo bookings (Enterprise) vs. free signups (other tiers)",
  "Overall funnel conversion rate improvement vs. Week 1 baseline"
]
```

**Tips:**
- Frame as things the client should care about, not internal tasks.
- 3-5 bullets. Keep each to one line.
- For Week 2+, reference the baseline: "vs. Week 1 baseline".

## Complete Example

See `src/data/finalbit/2026-03-21.json` for a complete working example.

## Creating a New Report

1. Copy an existing JSON file as a template
2. Update all fields with the new week's data
3. Save as `src/data/[client-slug]/[YYYY-MM-DD].json`
4. The report will automatically appear on the client's dashboard
5. Deploy with `npm run build` — the new report is live

## Writing Style Guide

- **Be concise.** Clients skim reports. Every word should earn its place.
- **Lead with insights, not data.** "Ad Creative Is Working" tells a story. "CTR: 2.17%" does not.
- **Use plain language.** Avoid jargon unless the client is technical. "Cost per click" > "CPC" on first mention.
- **Be honest about what's working and what isn't.** Credibility comes from transparency.
- **Connect data to business outcomes.** "$3.20 per click" means nothing. "$3.20 per click — efficient for B2B SaaS" tells the client whether to be happy.
- **Don't pad.** If there are only 2 real findings, don't invent 2 more. Quality > quantity.
