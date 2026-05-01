# Quick Reference: Testing State Components

## How to Switch Between States

All hook files support a `TEST_STATE` variable that controls which API response is returned.

### Available States

- `'success'` - Happy path, real data loads (default)
- `'error'` - API call fails, error state shown
- `'empty'` - API returns empty array, empty state shown

### Hook Files

```
src/hooks/
├── useOrders.js       - Controls Orders page state
├── useProducts.js     - Controls Products page state
├── useCustomers.js    - Controls Customers page state
└── useDashboard.js    - Controls Dashboard page state
```

---

## Quick Test Examples

### Test Orders Error State

**File:** `src/hooks/useOrders.js`

Change line 4 from:

```javascript
const TEST_STATE = "success";
```

To:

```javascript
const TEST_STATE = "error";
```

Save the file. HMR will automatically reload the page showing the error state.

### Test Products Empty State

**File:** `src/hooks/useProducts.js`

Change line 4 to:

```javascript
const TEST_STATE = "empty";
```

Navigate to `/products` to see the empty state.

### Reset to Normal

**All Files:** Change TEST_STATE back to:

```javascript
const TEST_STATE = "success";
```

---

## Component Props Reference

### SkeletonCard

```jsx
<SkeletonCard
  count={4} // Number of skeleton items to show
  height={80} // Height in pixels (default varies by variant)
  variant="card" // 'card' | 'row' | 'product' | 'stat'
/>
```

Variants:

- `card` - OrderCard-shaped skeleton (for Orders page)
- `row` - Table row skeleton (for Customers page)
- `product` - Product card skeleton (for Products page)
- `stat` - StatCard skeleton (for Dashboard page)

### ErrorMessage

```jsx
<ErrorMessage
  message="Main error message" // What went wrong
  errorDetail="Technical detail" // Optional: Underlying error
  onRetry={() => refetch()} // Optional: Retry callback
  icon={AlertCircle} // Optional: Custom icon
/>
```

### EmptyState

```jsx
<EmptyState
  title="No Items"               // State title
  message="Explanation..."       // Why it's empty
  actionLabel="Create One"       // Optional: Button text
  onAction={() => navigate(...)} // Optional: Button callback
  icon={InboxIcon}              // Optional: Custom icon
/>
```

---

## Testing Checklist

- [ ] Change TEST_STATE to 'error' in each hook file
  - [ ] Orders error state displays
  - [ ] Products error state displays
  - [ ] Customers error state displays
  - [ ] Dashboard error state displays
- [ ] Change TEST_STATE to 'empty' in each hook file
  - [ ] Orders empty state displays
  - [ ] Products empty state displays
  - [ ] Customers empty state displays
- [ ] Change TEST_STATE back to 'success'
  - [ ] All pages display real data
  - [ ] Happy path works correctly
  - [ ] No console errors

- [ ] Test Retry button
  - [ ] Click Retry while in error state
  - [ ] Page should retry and show data (if TEST_STATE is 'success')

---

## Troubleshooting

**HMR not updating the page?**

- Manually refresh the browser (F5)
- Check that the dev server is running: `npm run dev` or `./node_modules/.bin/vite.ps1`

**Changes aren't visible?**

- Check the console for errors
- Make sure you're editing the correct hook file for the page you're testing
- Wait 1-2 seconds for HMR to apply changes

**Retry button not working?**

- Verify `onRetry={refetch}` is passed to ErrorMessage component
- Check that the hook returns a `refetch` function
- Try changing TEST_STATE to 'success' and clicking Retry

---

## State Display Examples

### Loading State (SkeletonCard)

- Shows gray placeholder boxes
- Gentle pulse animation (opacity fade)
- Takes shape of actual content (card, row, product, stat)
- No interactivity

### Error State (ErrorMessage)

- Red/pink alert icon in circular background
- Bold "Error Loading Data" heading
- Clear, actionable message
- Optional error technical detail in smaller text
- Blue "Retry" button

### Empty State (EmptyState)

- Gray inbox icon in circular background
- Bold title ("No Orders Yet", etc.)
- Supporting message explaining why it's empty
- Optional blue CTA button
- Friendly, reassuring tone

### Happy Path (Real Data)

- All actual data loads and displays correctly
- No loading/error/empty states shown
- Full interactivity (buttons, links, etc.)
