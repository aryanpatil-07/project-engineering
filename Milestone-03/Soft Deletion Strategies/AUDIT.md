# AUDIT.md

## Problems found

- The schema has no `tenants` table, so all records belong to a single global dataset.
- Tenant-specific tables do not have `tenant_id`, so tenant boundaries cannot be enforced.
- Foreign keys do not guarantee same-tenant relationships, so cross-tenant references are possible.
- Routes return raw database rows directly, so sensitive fields can leak to unauthorized roles.
- No role-based access control exists in the API layer.
- Sensitive fields are not documented or filtered before response.
- No composite indexes exist on `tenant_id`, so tenant-scoped queries will be slower as data grows.

## Sensitive fields that require restricted access

- `salary` — financial compensation, admin only
- `billing_card_last4` — payment metadata, admin only
- `ssn` — highly sensitive identity field, admin only
- `bank_account` — banking data, admin only

## Role rules

- Admin: can see all users, all sensitive fields, and all projects within the tenant.
- Manager: can see team members and team projects, but no sensitive financial fields.
- User: can see own profile and assigned projects only, no other user data.