# Document your index fixes here

- Original index: `CREATE INDEX idx_salary_department ON employees(salary, department);`
- Issue observed: With the intentionally wrong order `(salary, department)`, PostgreSQL used a `Seq Scan` for `WHERE department = 'Sales' AND salary > 50000` on this tiny dataset (8 rows). The index did not provide meaningful planner benefit.
- Fixed index: `CREATE INDEX idx_department_salary ON employees(department, salary);`
- Performance improvement: After fixing index order, PostgreSQL still chose `Seq Scan` due to very small table size, but execution improved slightly from **0.038 ms** to **0.025 ms**. The corrected index is expected to be more beneficial as data volume increases.

## Why corrected order is logically better

The query filters by:

1. `department = 'Sales'` (equality)
2. `salary > 50000` (range)

By the **Left-Most Prefix Rule**, a composite index is best used when predicates start from its first column.  
So `(department, salary)` aligns with this pattern better than `(salary, department)`, especially at larger scale.
