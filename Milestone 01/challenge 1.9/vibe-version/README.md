Vibe Version

This folder contains the task manager app built using a vibe coding tool.

Tool used: Google AI Studio Build
Time to generate: 8 minutes (from writing prompt to running the app locally)
Prompt used:
Build a clean personal task manager web app using React.
The app should allow users to add a task with a title, mark tasks as complete, and filter tasks by status — All, Active, Completed.
The UI should be minimal and centered on the page with clear buttons and readable typography.
Use functional React components and basic CSS styling.
Tasks should be stored in component state.
The app should update instantly when tasks are added or marked complete.
Filters should update the visible task list without page reload.
Do not use external state libraries. Keep the code simple and readable.

Live URL: https://project-eng-vibecoded.netlify.app/

Notes
The tool generated a fully working React application in one shot with no runtime errors.
Folder structure was automatically created with multiple components such as App.jsx, TaskInput.jsx, TaskList.jsx, and FilterBar.jsx, along with a CSS file.
The UI was clean and usable without any manual styling changes.
State management logic was implemented using useState and task filtering logic was handled through conditional rendering.

What the tool got right:

Implemented all required features exactly — add task, mark complete, filter tasks.
Generated responsive layout and consistent spacing without additional prompting.
Automatically handled unique task IDs and checkbox toggle logic correctly.
Provided a logical component hierarchy which made the app understandable after reading through the code.

What the tool got wrong / limitations observed:

Some components were long (150+ lines) combining UI and logic instead of separating concerns further.
Variable naming was sometimes generic (e.g., handleClick, dataList), reducing readability.
Filter logic was duplicated across files, which could make future feature additions harder.
No comments or explanations were generated, requiring manual effort to understand parts of the logic.
Making structural edits (like adding due dates) required tracing logic across multiple files, reducing editability compared to manually built code.