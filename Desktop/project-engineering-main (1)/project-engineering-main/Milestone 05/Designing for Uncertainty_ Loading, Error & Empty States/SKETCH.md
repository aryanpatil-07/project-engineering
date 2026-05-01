# ShopDash States Sketch — Orders Screen

## Move 6: Visual Design Reference

### State 1: Loading Skeleton

```
┌──────────────────────────────────────────────────────────┐
│ Recent Orders                      [Export Report Button] │
├──────────────────────────────────────────────────────────┤
│                                                            │
│ ┌────────────────────────────────────────────────────┐   │
│ │  ████████ ████ (ID skeleton)                        │   │
│ │  ██████████ (customer skeleton)  ███ (price)        │   │
│ │                                  ██ (status badge)  │   │
│ └────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌────────────────────────────────────────────────────┐   │
│ │  ████████ ████ (ID skeleton)                        │   │
│ │  ██████████ (customer skeleton)  ███ (price)        │   │
│ │                                  ██ (status badge)  │   │
│ └────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌────────────────────────────────────────────────────┐   │
│ │  ████████ ████ (ID skeleton)                        │   │
│ │  ██████████ (customer skeleton)  ███ (price)        │   │
│ │                                  ██ (status badge)  │   │
│ └────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌────────────────────────────────────────────────────┐   │
│ │  ████████ ████ (ID skeleton)                        │   │
│ │  ██████████ (customer skeleton)  ███ (price)        │   │
│ │                                  ██ (status badge)  │   │
│ └────────────────────────────────────────────────────┘   │
│                                                            │
│ [Pulse animation - gray cards with fading opacity]       │
└──────────────────────────────────────────────────────────┘

Animation: Each skeleton card fades in and out gently (opacity 0.5 → 1.0 → 0.5)
Color: bg-gray-200 with pulse animation
Count: 3-4 cards to show expected page structure
```

---

### State 2: Error Message

```
┌──────────────────────────────────────────────────────────┐
│ Recent Orders                      [Export Report Button] │
├──────────────────────────────────────────────────────────┤
│                                                            │
│                                                            │
│                     ⚠️  (Alert icon)                       │
│                                                            │
│        We couldn't load your orders.                      │
│        Check your connection and try again.               │
│                                                            │
│        Reason: Failed to fetch orders from               │
│        downstream service.                                │
│        (small gray text)                                  │
│                                                            │
│                  [  Retry Button  ]                       │
│                  (blue, prominent)                        │
│                                                            │
│                                                            │
└──────────────────────────────────────────────────────────┘

Icon: Lucide AlertCircle in red/orange (size 48)
Title: Bold, dark gray, 16px font
Message: Regular gray text, 14px font
Error Reason: Small gray text (12px), lighter shade
CTA: Blue button with hover state
Layout: Centered vertically in the container
```

---

### State 3: Empty State

```
┌──────────────────────────────────────────────────────────┐
│ Recent Orders                      [Export Report Button] │
├──────────────────────────────────────────────────────────┤
│                                                            │
│                                                            │
│                    📭  (Inbox icon)                       │
│                                                            │
│                   No Orders Yet                           │
│                                                            │
│        You don't have any orders to display.              │
│        Orders will appear here as soon as                │
│        customers place them.                             │
│                                                            │
│                   (no CTA button)                         │
│                                                            │
│                                                            │
└──────────────────────────────────────────────────────────┘

Icon: Lucide ShoppingCart or InboxIcon in light gray (size 48)
Title: Bold, dark gray, 16px font
Message: Regular gray text, 14px font, centered
CTA: None (informational only)
Layout: Centered vertically in the container
Tone: Friendly, reassuring
```

---

## Responsive Considerations

All three states stack vertically on mobile and are centered with appropriate padding. The icon size may scale down slightly on smaller screens.

**Breakpoints:**

- Mobile (< 640px): Icon 40px, full width with padding
- Tablet (640px - 1024px): Icon 48px, constrained width (80%)
- Desktop (> 1024px): Icon 48px, constrained width (60%)

---

## Component Props (Design Reference for Move 7)

### SkeletonCard

- `count`: number of skeleton cards to render (default: 3)
- `height`: card height in pixels (default: 80)

### ErrorMessage

- `message`: Main error message (string)
- `errorDetail`: Optional underlying error reason (string)
- `onRetry`: Callback function for retry button
- `icon`: Icon component (default: AlertCircle)

### EmptyState

- `title`: State title (string)
- `message`: Supporting message (string)
- `actionLabel`: Button text (string, optional)
- `onAction`: Callback for CTA button (function, optional)
- `icon`: Icon component (default: InboxIcon)
