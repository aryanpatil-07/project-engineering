# FocusForge — Starter Repository

> **This is the starter repository for the FocusForge.**
> You will be working directly inside this codebase.

FocusForge is a productivity application that helps developers manage their daily tasks and stay focused. The application is functional — but the code behind it tells a different story.

---

## The Problem

A previous developer built the entire dashboard in a single file: `DashboardPage.jsx`.

It works. Open it, and you'll see everything in one place — the header, the stats cards, the task input, the filters, the task list. Every piece of UI, every handler, every style, all 250+ lines of it, living in one component.

Right now that's manageable. But imagine:
- A new developer joins the team and needs to fix the filter logic
- A designer wants to update just the stat cards
- You need to reuse the task row in a different page

Every one of those changes means digging through the same monolithic file, trying not to break something three sections away. This is how codebases become things people dread touching.

**Your job is to fix the architecture before it gets worse.**


## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repo (or navigate to the challenge folder)
git clone <repo-url>
cd focusforge-broken

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

## Project Structure

```
focusforge-broken/
├── src/
│   ├── pages/
│   │   └── DashboardPage.jsx   ← 🚨 Everything lives here
│   ├── data/
│   │   └── tasks.js            ← Seed data
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Your Challenge

Open `src/pages/DashboardPage.jsx` and study it carefully.

You need to:

1. **Identify distinct UI sections** — header, stats, task input, filters, task list, individual task row
2. **Extract each section into its own component** with a single, clear responsibility
3. **Identify which components can be reused** across the app (hint: `StatCard` and `TaskItem` are prime candidates)
4. **Pass data down via props** — components should receive what they need, not reach for global state
5. **Organize components into a logical folder structure**
6. **Keep `DashboardPage.jsx` as the state manager** — it should compose components, not render raw HTML

When you are done, the app should look and behave identically to when you started. The only thing that should change is the structure of the code.

## What Success Looks Like

```
src/
├── pages/
│   └── DashboardPage.jsx       ← Lean: only state + composition
├── components/
│   ├── dashboard/              ← Page-specific components
│   │   ├── DashboardHeader.jsx
│   │   ├── StatsRow.jsx
│   │   ├── AddTaskInput.jsx
│   │   ├── TaskFilterBar.jsx
│   │   └── TaskList.jsx
│   └── shared/                 ← Reusable across pages
│       ├── StatCard.jsx
│       └── TaskItem.jsx
└── data/
    └── tasks.js
```

## Submission

Once complete:

1. Push your refactored code to a new GitHub repository
2. Deploy the app (Vercel, Netlify, or GitHub Pages)
3. Open a Pull Request with a description explaining your component decisions
4. Record a 3–5 minute walkthrough video demonstrating your refactored structure

See the full assignment brief for detailed submission instructions.

## Need a Hint?

Start by reading `DashboardPage.jsx` top to bottom. Draw a box around every logical section. Give each box a name. That name is your component.


## Component Architecture Update

This challenge has been refactored to use clean component architecture. See the Changes.md file for detailed documentation.
