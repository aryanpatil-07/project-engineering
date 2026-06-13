# Observations

## Issues Found

- Tasks allowed NULL titles
- User emails were not unique
- Task priorities accepted invalid values
- Tasks could reference projects that did not exist
- Some required fields like user names and project names were also allowed to be empty

## Constraints Implemented

- Added NOT NULL to `users.name`, `users.email`, `projects.project_name`, and `tasks.title` so these required fields always have values
- Added UNIQUE to `users.email` so no two users can share the same email address
- Added CHECK to `tasks.priority` so priority must be between 1 and 5
- Added FOREIGN KEY to `tasks.project_id` so every task must point to a valid project

## Result

- Valid sample data still inserts successfully
- The database now rejects tasks with missing titles
- The database now rejects duplicate user emails
- The database now rejects invalid priority values like 10
- The database now rejects tasks that reference non-existent projects
