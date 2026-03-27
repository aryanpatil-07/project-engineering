Vibe vs. Pair Challenge

This challenge involves building the same Task Manager application twice to compare two distinct AI-assisted development workflows: Vibe Coding (using generative UI/app tools) and AI Pair Programming (using editor-integrated assistants). By the end, you'll have a clear understanding of the strengths and weaknesses of each approach.

The App You Are Building

You will be building a standalone Task Manager. You must strictly follow the requirements outlined in the app-spec.md
 file for both versions.

Your Folders
/vibe-version: Use this folder for the version built using a "vibe" tool (e.g., Lovable, v0, Google AI Studio Build).
/pair-version: Use this folder for the version built using an AI pair programming assistant (e.g., GitHub Copilot, Cursor).
Live Deployments
Vibe version: https://project-eng-vibecoded.netlify.app/
Pair version: https://project-eng-pairprogrammed.netlify.app/
Comparison Table

Fill out the following table after completing both versions:

Dimension	Vibe Version	Pair Version
Speed	Google AI Studio generated a fully working app in ~8 minutes from prompt to running UI. No manual file creation required.	Building manually with Copilot took ~32 minutes including project setup, component creation, styling and debugging state logic.
Control	Limited control. Tool decided folder structure, component boundaries and state placement automatically. Some logic was spread across files without explicit design choice.	Full control. I decided component structure, function signatures, naming conventions and state flow. Could accept or reject each suggestion.
Code Quality	Functional but uneven. Some components exceeded 150 lines and mixed UI + logic. Variable names were sometimes generic and filtering logic was duplicated.	Cleaner and modular. Longest component ~70 lines. Logic separation was intentional. State updates and filter handling were more predictable and readable.
Explainability	Harder to explain initially. Tool generated reducer-style logic and nested handlers which required multiple reads to understand fully. No comments generated.	Easy to explain. Since I wrote the structure myself and reviewed suggestions inline, I could explain every function, prop and state update clearly.
Editability	Moderate difficulty. During testing, adding a new field required changes across multiple components because logic was tightly coupled.	High editability. Adding new features like a due date field or new filter took ~7–8 minutes since state and UI responsibilities were clearly separated.
When I Would Use Each Tool
Vibe coding tool for: Rapid prototyping, hackathon MVPs, or idea validation — because it generated a complete working UI in under 10 minutes with minimal effort and no setup friction.
AI pair programming for: Production projects, learning, or scalable architecture work — because it provided full structural control, better code readability, and significantly easier future edits and feature expansion.
Tools Used
Vibe tool used: Google AI Studio Build
Pair tool used: GitHub Copilot