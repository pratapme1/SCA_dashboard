# Repository Guidelines

## Project Structure & Module Organization

This is a flat, browser-run React prototype.

- `index.html` defines the page shell, Tailwind theme, global CSS, CDN dependencies, and script load order.
- `icons.jsx` exposes the shared `window.Icon` icon set.
- `data.jsx` defines mock dashboard data on `window.MOCK`.
- `components.jsx` contains reusable UI pieces such as cards, pills, search, and metrics.
- `chat.jsx` implements the floating assistant and calls `window.claude.complete` when available.
- `app.jsx` wires the dashboard layout, state, modals, filtering, and interactions.

Keep dependency order in `index.html`: icons and mock data must load before components, chat, and app code.

## Build, Test, and Development Commands

There is no `package.json` or build pipeline. Run the app with a local static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`. Use this instead of direct file loading so Babel fetches behave consistently.

For quick source inspection:

```bash
rg "function App|window.MOCK|window.Icon" .
```

## Coding Style & Naming Conventions

Use JSX with plain global functions and browser globals. Prefer 2-space indentation, single quotes where practical, and component names in `PascalCase` such as `RiskQueue` or `EscalateModal`. Keep reusable UI in `components.jsx`; place orchestration in `app.jsx`; put mock data only in `data.jsx`.

Tailwind utility classes are the primary styling mechanism. Add global CSS in `index.html` only for theme tokens, animations, scrollbar styling, or cross-cutting overrides.

## Testing Guidelines

No automated tests are configured. Validate changes manually after starting the static server. Check dark and light themes, risk selection, supplier search, action modals, chat open/close behavior, and responsive layout.

If adding tests later, prefer browser-level smoke tests that load `index.html` and verify the dashboard renders without console errors.

## Commit & Pull Request Guidelines

This directory is not currently a Git repository, so no project history is available. Use concise, imperative commit subjects if Git is initialized, for example `Add supplier filter controls` or `Fix light theme contrast`.

Pull requests should include a short description, screenshots or screen recordings for UI changes, manual test notes, and any known limitations such as unavailable `window.claude.complete` behavior outside the target host environment.

## Agent-Specific Instructions

Keep edits small and preserve the no-build setup unless explicitly asked to introduce tooling. Do not move files into a framework structure without also updating `index.html` script loading and documenting the new run commands.
