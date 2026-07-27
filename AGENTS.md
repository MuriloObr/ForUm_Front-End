# AGENTS.md

## Project overview

ForUm client — a React SPA forum frontend. Single package (not a monorepo). Backend lives in a separate repo (`MuriloObr/ForUm_Back-End`).

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router v6 (BrowserRouter, routes in `src/main.tsx`)
- TanStack React Query v4 for server state
- Axios for HTTP
- Radix UI (hover-card, popover), Phosphor Icons
- Markdown rendering: `marked` + `dompurify` + `highlight.js`
- Storybook 8 (React-Vite)

## Commands

```bash
npm run dev          # Vite dev server on 0.0.0.0
npm run build        # tsc && vite build
npm run lint         # eslint . --ext ts,tsx (zero warnings allowed)
npm run storybook    # Storybook on port 6006
npm run build-storybook
```

No test runner is configured. There are no test scripts or test dependencies.

## Path aliases

Defined in both `vite.config.ts` and `tsconfig.json`:

- `@mytypes/*` → `src/types/*`
- `@components/*` → `src/components/*`

## Lint

ESLint extends `@rocketseat/eslint-config/react` — this enforces camelCase naming, specific import ordering, and other Rocketseat conventions. The `eslint-disable camelcase` comment appears in `postFunctions.ts` because the backend API uses snake_case field names. Lint is strict: `--max-warnings 0`.

## Architecture

- **Entry**: `src/main.tsx` — sets up React Query, SearchContext, AnswerContext, and router
- **Routes**: `src/routes/` — App, PostPage, Login, Register, Profile, About, ErrorPage
- **Components**: `src/components/` — Header, Post, PostComment, UserComponent, Modal/, Form/, ui/
- **API layer**: `src/api/getFunctions.ts` and `src/api/postFunctions.ts` — all backend calls via axios
- **Types**: `src/types/typesAPI.ts` and `src/types/typesComponents.ts`
- **Contexts**: `src/context/SearchContext.tsx` and `src/context/AnswerContext.tsx`
- **Utils**: `src/utils/` — highlighter.ts, MDpurifiedHelper.ts

## API / backend

Backend URL is toggled via a `devMode` boolean in `src/api/getFunctions.ts:13`:

- `devMode = true` → `http://127.0.0.1:5001/api`
- `devMode = false` → `https://forumbackend-4crd.onrender.com/api`

Auth uses cookies (`withCredentials: true` on relevant requests).

## Deployment

Vercel SPA with rewrite rule in `vercel.json`: all routes → `/index.html`.

## Conventions

- TypeScript strict mode enabled (`noUnusedLocals`, `noUnusedParameters`)
- Tailwind for all styling; custom CSS in `src/index.css` for markdown rendering
- Markdown rendered in a `.markdown` class with Tailwind `@apply` directives
- Storybook stories colocated with components (`*.stories.tsx`)
