# Changes — Orders Dashboard UX States

What the original implementation did

- The dashboard fetched orders but rendered a single placeholder block that dumped raw JSON.
- Missing or incomplete UX states:
  - Loading: no skeleton or proper loading feedback (the mock API can hang).
  - Success: raw JSON dump instead of a scannable table with key fields and summary metrics.
  - Empty: a basic placeholder text without contextual messaging or CTAs.
  - Error: generic "Something went wrong" placeholder without actionable guidance.

Problems caused by the original behavior

- Users could be left uncertain whether the application was working or hung.
- No clear way to retry or understand errors — poor recovery flow.
- No polished presentation for successful data (harder to scan orders and spot priorities).
- Empty cases did not explain why there were no orders (no guidance for filters vs truly empty).

What I implemented

- Replaced `src/components/OrdersDashboard.jsx` with a full implementation that cleanly handles:
  - Loading state: skeleton rows (6 rows) that mirror the order table layout, using a shimmer animation.
  - Success state: full, scannable order rows showing Order ID, Customer, Product, Amount, Status, Date, as well as a visual Priority flag (🔥) for high-value / high-priority orders.
  - Summary metrics: total revenue, delivered count, and "needs attention" count are shown in stat cards; header also displays total orders and total value.
  - Empty state: context-aware messaging that differentiates between "no orders in the system" and "no results because of filters" (placeholder `filterActive` can be wired to real filters). Includes clear CTAs (Refresh / Clear filters/Create order).
  - Error state: maps common error text to actionable messages (503 → "Service unavailable", network errors, timeouts) and provides Retry and Report actions.
- Kept all UI as isolated components:
  - `LoadingState` (with `SkeletonRow`), `ErrorState`, `EmptyState`, `OrderRow`.
- Smooth transitions:
  - Table body uses a subtle opacity transition; skeleton → rows is non-jarring.
- Non-breaking:
  - No API changes. The new implementation uses the existing `fetchOrders()` mock and the current table structure. Priority flag is a small visual indicator embedded inside the Order ID cell (so no schema/header changes).

How this improves the experience

- Operations managers, warehouse staff, and CSRs get immediate and specific feedback:
  - They can tell when data is loading vs when the API failed.
  - Errors are actionable (retry, report) with clear messages.
  - Empty states guide users what to try next.
  - The success state is easy to scan and highlights priority orders.
- Easier to test:
  - Toggle `SIMULATE` in `src/mockApi.js` to test `loading`, `success`, `empty`, `error`.

How to test locally

1. Install and run:
   npm install
   npm run dev

2. Toggle the simulated API in `src/mockApi.js`:
   - `SIMULATE = 'loading'` → tests the Loading state (the promise never resolves)
   - `SIMULATE = 'success'` → shows the Success state
   - `SIMULATE = 'empty'` → shows the Empty state
   - `SIMULATE = 'error'` → shows the Error state

3. Use the Refresh button to re-run the fetch and confirm Retry functionality.

Notes / next steps

- If you add real filters, set `filterActive` in the dashboard state and pass appropriate messages to `EmptyState`.
- The priority rule is a simple business rule (amount >= ₹30,000 or pending or items>3). Adjust as required.
