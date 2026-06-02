# Pre-Refactor Audit

## Hard deletes found in the codebase

| File                     | Line | Table          | Permanent data lost                                                                                                                                           |
| ------------------------ | ---: | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `routes/users.js`        |   44 | `users`        | Deleting a user permanently removes the user account record, so the app loses the identity tied to that user and cannot later prove the account ever existed. |
| `routes/accounts.js`     |   43 | `accounts`     | Deleting an account permanently removes the account record, so the app loses the balance history anchor and can no longer show which account held the funds.  |
| `routes/transactions.js` |   43 | `transactions` | Deleting a transaction permanently removes the financial event itself, so the app loses the exact debit or credit history needed for reconciliation.          |

## Exclusions

No tables were excluded from soft deletion in this codebase. The app only hard-deletes business records (`users`, `accounts`, and `transactions`), and there are no session tokens, one-time codes, or temporary cache records in the LedgerApp schema.

## Notes

- The schema currently uses `ON DELETE CASCADE` from `accounts.user_id` to `users.id` and from `transactions.account_id` to `accounts.id`, which means removing a parent row also removes dependent financial history.
- This audit intentionally records only the live DELETE statements that remove business data.
