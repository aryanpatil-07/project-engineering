Pair Version

This folder contains the task manager app built using an AI pair programming assistant.

Tool used: GitHub Copilot
Time to build: 32 minutes (from project setup to fully working filtered task manager UI)
Suggestions accepted: ~24
Suggestions rejected: ~9
Live URL: https://project-eng-pairprogrammed.netlify.app/

Notes
The app was built file by file from scratch, starting with project initialization, followed by creating components like TaskInput, TaskItem, TaskList, and FilterTabs.
GitHub Copilot provided inline suggestions for React hooks usage, event handlers, JSX structure, and filtering logic.
Most accepted suggestions were related to boilerplate React patterns, such as mapping tasks, setting state, and handling checkbox toggles.

Where the AI helped most:

Quickly generated correct useState update patterns for adding and toggling tasks.
Suggested clean conditional filtering logic using .filter() based on selected status.
Helped scaffold repetitive JSX like button groups and list rendering, saving typing time.
Autocomplete suggestions improved speed while writing small utility functions and event handlers.

Where I overrode or rejected suggestions:

Copilot initially suggested keeping all logic inside App.jsx, which I rejected to maintain better component separation.
Some suggestions used unnecessary props drilling patterns, which I refactored by lifting state more cleanly.
Styling suggestions were minimal and sometimes inconsistent, so layout CSS was mostly written manually.
One suggested filter implementation caused stale state behaviour, which I fixed by rewriting the handler.

Observations about control and editability:

Full control over folder structure, naming conventions, and function design was maintained throughout the build.
Code remained short and modular, with the longest component around ~70 lines.
Adding new features (like a due-date field during testing) was significantly easier because logic was centralized and understandable.
Since each suggestion was reviewed before acceptance, overall code explainability was high.