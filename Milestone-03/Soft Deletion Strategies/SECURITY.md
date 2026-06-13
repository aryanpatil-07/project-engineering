# SECURITY.md

## Sensitive fields

- salary: compensation data, admin only
- ssn: identity data, admin only
- billing_card_last4: payment metadata, admin only
- bank_account: banking data, admin only

## Tenant boundaries

- Every tenant-owned table has tenant_id
- Every query filters by tenant_id
- Composite foreign keys enforce same-tenant references
- Composite indexes support tenant-scoped queries

## Cross-tenant risks prevented

- Cross-tenant row access through direct IDs
- Cross-tenant foreign key references
- Sensitive field leakage in API responses
- Global list endpoints returning data outside the requesting tenant
