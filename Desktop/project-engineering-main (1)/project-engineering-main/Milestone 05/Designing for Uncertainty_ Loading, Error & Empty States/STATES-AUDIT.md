# ShopDash: States Audit

## Move 1 — Current State Gaps

### Orders Page (`/orders`)

**Loading State:**
The Orders page shows a completely blank white container. The heading "Recent Orders" and "Export Report" button are visible, but the grid below is empty with no indication that data is being fetched. User cannot tell if the app is working or broken.

**Error State:**
If the API fails, the page remains completely blank. No error message, no indication of failure, no retry button. The user is left staring at an empty grid with no context.

**Empty State:**
If the orders array is empty, the page shows a blank grid area with no indication that there are genuinely no orders. Looks identical to the loading state or error state. User cannot distinguish between "no data to show" and "something went wrong."

---

### Products Page (`/products`)

**Loading State:**
The Products page shows the heading "Product Inventory", filter and "Add Product" buttons, but the grid below is blank. No skeleton cards, no spinner, no loading indicator. User doesn't know if data is loading or if there are no products.

**Error State:**
If the API fails (e.g., "Unable to connect to inventory database"), the page remains blank with no error message displayed. The grid stays empty with no recovery option.

**Empty State:**
If products array returns empty, the grid area is blank with no message explaining that there are no products to display. Could be misinterpreted as a loading state.

---

### Customers Page (`/customers`)

**Loading State:**
The Customers page shows the heading "Customer Management" and the table header row (Customer, Order History, Total Value, Details), but the table body is completely empty. No skeleton rows, no spinner. User sees a ready-to-use table with zero rows—ambiguous whether data is loading.

**Error State:**
If the API fails (e.g., "Auth server rejected the customer listing request"), no error message appears. The table body stays empty with no indication of what went wrong or how to fix it.

**Empty State:**
If customers array is empty, the table shows only headers with an empty body. No message explaining why the table is empty (e.g., "no customers added yet" vs "search returned no results").

---

### Dashboard Page (`/`)

**Loading State:**
The Dashboard shows the heading "Overview Dashboard" and the chart placeholder, but all four StatCards (Revenue, Orders, Active Users, Avg Order) are blank. No skeleton cards, no spinners. Looks broken rather than loading.

**Error State:**
If the API fails, the StatCards remain blank with no error message. The chart placeholder is still visible but the key metrics are missing.

**Empty State:**
N/A — Dashboard returns static computed stats and should always have data. However, if stats object is null, cards do not render.

---

## Move 2 — Missing States Checklist

| Screen    | Loading State | Error State | Empty State | Notes                                  |
| --------- | ------------- | ----------- | ----------- | -------------------------------------- |
| Orders    | ❌ Missing    | ❌ Missing  | ❌ Missing  | Grid layout ready, but zero feedback   |
| Products  | ❌ Missing    | ❌ Missing  | ❌ Missing  | Grid layout ready, but zero feedback   |
| Customers | ❌ Missing    | ❌ Missing  | ❌ Missing  | Table structure visible, zero feedback |
| Dashboard | ❌ Missing    | ❌ Missing  | ✓ N/A       | StatCards blank during load            |

---

## Move 3 — Loading State Strategy

**Decision: Use Skeleton Cards for Orders and Products; Skeleton Rows for Customers Table; Skeleton StatCards for Dashboard.**

**Reasoning:** For lists and tables, skeleton screens (also called placeholder loading UI) are better UX than a spinner. Skeletons show the user the shape and layout of incoming data, reducing perceived load time and building confidence in the interface. A bare spinner + blank space feels broken.

### Orders Page Skeleton Implementation Plan

- **Quantity:** 3–4 skeleton OrderCard components
- **Height:** Match OrderCard height (approximately 80px including padding)
- **Structure:** Each skeleton will have:
  - Left side: skeleton rectangle for order ID (60px wide), skeleton rectangle below for customer name (100px wide)
  - Right side: skeleton rectangle for total price (70px wide), skeleton badge below for status
  - Spacing: gap-4 between skeleton cards
- **Animation:** Tailwind `animate-pulse` class with `bg-gray-300` base and opacity fade
- **CSS:** Using Tailwind utilities:
  ```
  bg-gray-200 rounded-lg h-[80px] animate-pulse
  ```

### Products Page Skeleton Implementation Plan

- **Quantity:** 3 skeleton cards (responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop)
- **Height:** Match ProductCard height (approximately 300px)
- **Structure:** Each skeleton will have:
  - Top area (200px): skeleton image placeholder
  - Bottom area: skeleton rectangle for product name, price, category, stock
- **Animation:** Tailwind `animate-pulse`
- **CSS:**
  ```
  bg-gray-200 rounded-xl h-[300px] animate-pulse
  ```

### Customers Table Skeleton Implementation Plan

- **Quantity:** 4 skeleton rows
- **Height:** Match CustomerRow height (~56px per row)
- **Structure:** Each skeleton row will have:
  - Column 1: skeleton circle (24px) + skeleton rectangle (120px) for customer name
  - Column 2: skeleton rectangle (40px) for order count
  - Column 3: skeleton rectangle (80px) for total spent
  - Column 4: skeleton button (60px × 32px) on right
- **Animation:** Tailwind `animate-pulse`
- **CSS:**
  ```
  bg-gray-200 rounded h-[56px] animate-pulse
  ```

### Dashboard Skeleton Implementation Plan

- **Quantity:** 4 skeleton StatCards
- **Height:** Match StatCard height (~96px)
- **Structure:** Each skeleton will have:
  - Left area: skeleton rectangle (60px) for title, larger skeleton for value
  - Right area: skeleton circle (48px) for icon
- **Animation:** Tailwind `animate-pulse`
- **CSS:**
  ```
  bg-gray-200 rounded-xl h-[96px] animate-pulse
  ```

---

## Move 4 — Error State Messages

Each screen has a specific error context. The error messages will include:

1. **What went wrong** (from error message)
2. **What the user can do** (retry button)

### Orders Page Error Message

**Message:**
"We couldn't load your orders. Check your connection and try again."

**Additional Detail:** Show the underlying error (e.g., "Reason: Failed to fetch orders from downstream service") in small gray text below the main message.

**CTA:** Prominent "Retry" button in blue.

---

### Products Page Error Message

**Message:**
"We couldn't load the product inventory. Check your connection and try again."

**Additional Detail:** Show error reason in small gray text.

**CTA:** "Retry" button.

---

### Customers Page Error Message

**Message:**
"We couldn't load customer data. Your session may have expired or you may not have permission. Try again or contact support."

**Additional Detail:** Show error reason (e.g., "Auth server rejected the customer listing request").

**CTA:** "Retry" button.

---

### Dashboard Page Error Message

**Message:**
"We couldn't load dashboard stats right now. Try refreshing the page."

**Additional Detail:** Show error reason in small text.

**CTA:** "Retry" button.

---

## Move 5 — Empty State Messages

Empty states vary depending on the screen context. These are designed for a brand-new user or after filtering returns no results.

### Orders Page Empty State

**Title:** "No Orders Yet"

**Message:** "You don't have any orders to display. Orders will appear here as soon as customers place them."

**CTA:** None (informational only). Or optional "Create Test Order" button for demo purposes.

---

### Products Page Empty State

**Title:** "No Products in Inventory"

**Message:** "Your product catalog is empty. Add your first product to get started."

**CTA:** "Add Product" button (links to product creation or form).

---

### Customers Page Empty State

**Title:** "No Customers Yet"

**Message:** "You don't have any customer records yet. Customers will appear here as they sign up or are imported."

**CTA:** None (informational only).

---

### Dashboard Page Empty State

**N/A** — Dashboard returns static stats and should never be truly empty. However, if an API failure leaves stats null, the StatCards will render as skeletons and error message will show instead of empty state.

---

## Move 6 — Sketches / Prototypes

### Orders Screen: Three States

[Sketch showing]

1. **Loading:** 3 skeleton OrderCards stacked vertically. Each skeleton shows two gray boxes on the left (order ID, customer name) and two on the right (price, status badge). Subtle gray background with pulse animation.

2. **Error:** Large error icon (circle with !) centered. Below: "We couldn't load your orders. Check your connection and try again." Small gray text: "Reason: Failed to fetch orders from downstream service." Red or blue "Retry" button.

3. **Empty:** Inbox icon (or shopping cart with empty indicator). Title: "No Orders Yet". Subtitle: "You don't have any orders to display. Orders will appear here as soon as customers place them." No CTA button.

---

## Integration Checklist (Move 8)

Each page must follow this order:

```
if (isLoading) return <SkeletonCard count={n} />
if (error) return <ErrorMessage message="..." onRetry={refetch} />
if (data.length === 0) return <EmptyState title="..." message="..." />
return <DataComponent data={data} />
```

**Pages to update:**

- [ ] Orders.jsx
- [ ] Products.jsx
- [ ] Customers.jsx
- [ ] Dashboard.jsx

---

## Testing Plan (Move 9)

**Minimum required:** 6 screenshots (3 states × 2 screens)

Test each state by:

1. **Loading:** Chrome DevTools → Network → Slow 3G → reload page → capture screenshot within 2 seconds
2. **Error:** Modify mock API to throw error → reload → capture screenshot
3. **Empty:** Modify mock API to return `[]` → reload → capture screenshot

**Screens to test:**

1. Orders (capture all 3 states)
2. Products (capture all 3 states)
3. Customers (capture loading + error + empty)
4. Dashboard (capture loading + error)

All screenshots will be stored in `/screenshots` folder.
