# Soft Deletion Trade-offs

## When soft delete is the right call

Soft delete is the right choice in LedgerApp whenever the record is part of a financial history that may need to be explained later.

1. **User account closure with later investigation**
   - If a customer closes their account and later disputes a balance or transfer, retaining the user row with `deleted_at` preserves the identity trail behind the transactions.
   - That matters because the app still needs to explain who owned the account when a transaction occurred, even if the user is no longer active.

2. **Transaction correction, chargeback, or reconciliation review**
   - If a debit or credit is removed from the normal UI, LedgerApp should still retain the transaction in soft-deleted form so the audit trail shows what changed and when.
   - This helps reconcile balances and answer questions like “why did this statement change last month?” without guessing.

3. **Account lifecycle tracing**
   - When an account is removed from the product, the deleted account record still helps connect historical transactions to the correct account number and account type.
   - In a finance app, the history is often more important than the current visibility.

## When hard delete is still appropriate

No current LedgerApp table is a good hard-delete candidate.

- The only persisted entities in the schema are `users`, `accounts`, and `transactions`, and all three are business records that may be needed for audit, dispute resolution, or reconciliation.
- Because of that, soft delete is the correct default for the current schema.
- If LedgerApp later adds ephemeral records such as session tokens, password reset codes, or temporary API cache rows, those should still be hard-deleted because they are security-sensitive or meaningless after use.

## Compliance scenarios

A realistic compliance case is a **monthly internal finance audit or a customer dispute review**.

Example: a user claims a debit disappeared after their account was closed.

- The audit/admin route `GET /audit/deleted-records` can return rows where `deleted_at IS NOT NULL` from `users`, `accounts`, and `transactions`.
- That query proves the record existed, shows when it was soft-deleted, and preserves the financial event for review.
- If an auditor asks for evidence of what was removed on a specific date, the deleted-row query gives a direct answer instead of a blank hole in the history.

## Storage and performance impact

Soft delete keeps rows in the table, so storage grows over time instead of shrinking after every deletion.

- **Example growth estimate:** if LedgerApp stores about **20,000 active users/accounts combined** and deletes **2% of them per month**, that is roughly **400 tombstoned rows per month**. After **12 months**, the table contains about **24,800 rows** instead of 20,000; after **24 months**, about **29,600 rows**.
- For transactions, the growth is larger. At roughly **50,000 new transactions per month** and a **1% correction/delete rate**, LedgerApp would accumulate about **500 deleted transaction rows per month**. After **12 months**, that is about **6,000 soft-deleted transactions**; after **24 months**, about **12,000**.

The partial indexes added in `schema.sql` solve the main read-path problem:

- Without the partial index, active-record queries must contend with a larger index and more dead-row clutter as soft deletions accumulate.
- The partial index keeps the active index smaller by excluding deleted rows, so scans for normal application reads touch fewer entries.
- If **20% or more** of a table becomes soft-deleted, the active index can be roughly **20% smaller** than a full index, which is a meaningful savings once the table reaches **250,000+ rows**.

At around **250,000 rows per table** with **50,000 or more tombstones**, soft-delete performance starts to become noticeable without the partial index. At that point, list endpoints and audit lookups begin paying a real cost for carrying historical rows around, even though the app still needs them for compliance.
