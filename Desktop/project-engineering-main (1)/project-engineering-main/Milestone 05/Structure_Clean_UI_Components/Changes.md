# Changes

## Component breakdown

- `DashboardHeader.jsx` renders the top app header and branding.
- `StatsRow.jsx` composes the four dashboard metrics.
- `AddTaskInput.jsx` handles the add-task input UI.
- `TaskFilterBar.jsx` manages filter buttons and search input UI.
- `TaskList.jsx` renders either the empty state or the task rows.
- `StatCard.jsx` is a reusable card for a single metric.
- `TaskItem.jsx` is a reusable row for an individual task.

## Why dashboard vs shared

- Components in `src/components/dashboard/` are specific to this page and describe the dashboard layout and controls.
- Components in `src/components/shared/` are generic enough to be reused elsewhere without knowing anything about the dashboard.

## Props by component

- `StatsRow`: `totalCount`, `completedCount`, `progressPercent`
- `StatCard`: `label`, `value`, `caption`, `valueColor`, `children`
- `AddTaskInput`: `newTask`, `onNewTaskChange`, `onAddTask`
- `TaskFilterBar`: `filter`, `onFilterChange`, `searchQuery`, `onSearchQueryChange`
- `TaskList`: `tasks`, `onToggleTask`, `onDeleteTask`
- `TaskItem`: `task`, `onToggle`, `onDelete`

## Design choices

- `DashboardPage.jsx` now owns state and derived values only.
- Each component has one responsibility, which keeps the page easier to read and modify.
- Shared components do not depend on dashboard-specific state or naming.
- Props are kept minimal so each component only receives what it actually uses.

## If the app were 10× larger

- I would split the dashboard into feature modules with co-located hooks, constants, and styles.
- I would likely add a design system layer for repeated primitives like buttons, inputs, and cards.
- I would also introduce stronger typing and test coverage around task interactions.
