# DEBUG-REPORT

## Bug 1 — Orphaned Orders

### Symptom

Some orders appear with no associated customer record.

SQL used to reproduce:

```sql
SELECT
  o.id,
  o.customer_id,
  c.name AS customer_name
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
ORDER BY o.id;



Observed:

Orders 3 and 4 had NULL in customer_name
This showed that orders existed with customer_id values that did not match any customer row
Data Flow Trace
POST /orders in routes/orders.js inserts whatever customer_id is provided in the request body.
GET /orders in routes/orders.js uses a LEFT JOIN to customers, which exposes missing matches as NULL.
In schema.sql, the orders.customer_id column has no FOREIGN KEY constraint.
Because of that missing constraint, rows with customer_id = 9999 were allowed into the table.
Root Cause
orders.customer_id was missing a FOREIGN KEY constraint referencing customers(id).

Fix Applied
Validation
Re-run query after fix:

Attempted bad insert:

Expected result:

PostgreSQL rejects the insert with a foreign key violation


## Bug 2 — Negative Inventory

Symptom
Some products show negative inventory counts after order processing.

SQL used to reproduce:

Observed:

Wireless Mouse had inventory -3
USB-C Cable (1m) had inventory -5
Data Flow Trace
POST /order_items in routes/order_items.js inserts an order item and then subtracts the quantity from product inventory.
PATCH /products/:id/inventory in routes/products.js updates inventory directly.
Neither route prevents inventory from dropping below zero.
In schema.sql, the products.inventory_count column has no CHECK constraint.
That missing rule allowed invalid negative values to be stored.
Root Cause
products.inventory_count was missing a CHECK (inventory_count >= 0) constraint.

Fix Applied
Validation
Re-run query after fix:

Attempted bad insert:

Expected result:

PostgreSQL rejects the insert with a CHECK constraint violation


## Bug 3 — Duplicate Payments
Symptom
Some completed orders show payment status as pending, and some orders have multiple payment records.

SQL used to reproduce:

And:

Observed:

order_id = 1 had two payment rows
One row had pending
One row had completed
Data Flow Trace
POST /payments in routes/payments.js inserts a new payment row for any order_id provided.
GET /payments/:orderId returns every payment row for that order.
In schema.sql, the payments.order_id column has no UNIQUE constraint.
Because of that, multiple payment records for the same order were allowed.
Root Cause
payments.order_id was missing a UNIQUE constraint.

Fix Applied
Validation
Re-run query after fix:

Attempted bad insert:

Expected result:

PostgreSQL rejects the insert with a UNIQUE constraint violation
```
