# Landing Page Improvement Proposal

## Current Issues

1. Install box wraps badly on mobile
2. No pricing visible
3. Performance claim lacks context
4. Dead Docs link
5. "Pipe to AI" example is not true yet
6. Content flow could be better
7. No visual of the product
8. Footer is minimal

---

## Proposed Content Flow

```
1. Hero (hook)
2. Performance banner (differentiator)
3. How it works (pipeline visual)
4. Features (sources/routing/sinks)
5. CLI (developer experience)
6. Use Cases (who it's for)
7. Connectors (business data)
8. SDKs
9. Pricing (transparent)
10. CTA (contact)
11. Footer (with location, license, GitHub)
```

---

## Section-by-Section Changes

### 1. Hero
**Keep as is**, but:
- Fix install box to not wrap on mobile (use `whitespace-nowrap` + horizontal scroll)
- Consider adding GitHub stars badge next to Alpha badge

### 2. NEW: Performance Banner
Add right after hero, before pipeline section.

```
┌─────────────────────────────────────────────────────────┐
│  64M events/sec                                         │
│  ████████████████████████████████████████████ Tell      │
│  ██ PostHog (~100K/sec)                                 │
│  ████████ Vector (86 MiB/s)                             │
│                                                         │
│  "640x faster than PostHog. 150x faster than Vector."   │
└─────────────────────────────────────────────────────────┘
```

Simple horizontal bars, no fancy charts. Makes the number meaningful.

### 3. How It Works (NEW)
Add a simple visual showing the pipeline:

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│ SOURCES  │      │   TELL   │      │  SINKS   │
│          │      │          │      │          │
│ TCP      │─────▶│ Route    │─────▶│ClickHouse│
│ Syslog   │      │ Filter   │      │ Parquet  │
│ HTTP     │      │ Transform│      │ Disk     │
│ Shopify  │      │          │      │ Forward  │
│ GitHub   │      │          │      │          │
└──────────┘      └──────────┘      └──────────┘
```

This replaces the current 3-column sources/routing/sinks cards with a cleaner visual.

### 4. Features Section
Simplify. Instead of listing everything, focus on key differentiators:

- **One binary** - No Docker, no Kubernetes, runs anywhere
- **Zero-copy pipeline** - Sub-millisecond latency
- **Fan-out routing** - One source to many sinks
- **Hot reload** - Config changes without restart

### 5. CLI Section
**Remove** the "Pipe to AI" example.

Keep:
```bash
# Live tail with filters
$ tell tail --source tcp --type event

# Query events
$ tell query "SELECT event_name, COUNT(*) FROM events GROUP BY 1"
```

### 6. Use Cases
**Keep as is** - good content, good order.

### 7. Connectors
**Keep as is** - GitHub/Shopify ready, Stripe/GA coming.

### 8. SDKs
**Keep as is** - shows ecosystem maturity.

### 9. NEW: Pricing Section
Add before CTA. Keep it simple:

```
┌─────────────────────────────────────────────────────────┐
│                        PRICING                          │
│                                                         │
│  Full product for everyone. No feature gating.          │
│                                                         │
│  Individual ................ Free                       │
│  Company < $1M revenue ..... Free (key required)        │
│  Company $1M-$10M .......... $299/mo                    │
│  Company > $10M ............ $2,000/mo+                 │
│                                                         │
│  [View full license on GitHub →]                        │
└─────────────────────────────────────────────────────────┘
```

### 10. CTA Section
**Keep as is** - "Ready to see the whole story?" + Contact us + GitHub

### 11. Footer
Enhance:
- Add: "Copenhagen, Singapore" or just "Singapore"
- Add: GitHub stars count (dynamic or static)
- Keep: GitHub, Docs, License links
- Add: "Source available" badge/note

---

## Visual Placeholder

For product screenshot, add a placeholder box:

```html
<div class="bg-zinc-200 rounded-2xl aspect-video flex items-center justify-center">
  <span class="text-zinc-400">Product screenshot coming soon</span>
</div>
```

Can be replaced with actual screenshot later.

---

## Mobile Fixes

Install box - prevent wrapping:
```html
<code class="whitespace-nowrap overflow-x-auto">
  $ curl tell.rs | sh
</code>
```

---

## Remove

1. "Pipe to AI" CLI example
2. Dead Docs link (or point to GitHub README for now)

---

## Summary of Changes

| Section | Action |
|---------|--------|
| Hero | Fix mobile wrap, add stars badge |
| Performance | NEW - visual comparison |
| How it works | NEW - pipeline diagram |
| Features | Simplify to 4 key points |
| CLI | Remove AI example |
| Use Cases | Keep |
| Connectors | Keep |
| SDKs | Keep |
| Pricing | NEW section |
| CTA | Keep |
| Footer | Add location, enhance |

---

## Questions for You

1. Do you want the performance comparison bars, or just text like "640x faster"?
2. Pipeline diagram - ASCII art style or clean boxes?
3. Pricing - show on page or link to GitHub LICENSE?
4. Product placeholder - include or skip for now?
5. Docs link - remove or point to GitHub README?
