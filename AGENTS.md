# Project conventions

## React component organization

- Every React component must live in its own `.tsx` file. Do not declare multiple React components in the same `.tsx` file.
- Keep distinct pages in distinct folders under their feature's `pages` directory. In particular, sign-in and sign-up must live in `SignInPage/` and `SignUpPage/`, respectively.

## UI components

- Always use the shadcn/ui components in `src/components/ui/` for UI primitives when an equivalent component exists. Do not recreate those primitives with native controls or raw Radix components inside feature code.
- When a needed shadcn/ui primitive is missing, add its canonical shadcn/ui implementation to `src/components/ui/` before using it in a feature.
- Generated shadcn/ui primitive modules may colocate and export their related subcomponents from one file; this is the sole exception to the one-component-per-file rule above.

## Feature-based architecture

- Keep feature-specific components, pages, hooks, queries, services, stores, schemas, types, and utilities inside `src/features/<feature>/`.
- Reserve `src/app/` for application composition such as routing, providers, and cross-feature orchestration; reserve `src/components/ui/`, `src/api/`, and `src/lib/` for genuinely shared infrastructure.
- Each feature query directory must split query concerns into exactly three file roles: `*.key.ts`, `*.queries.ts`, and `*.mutations.ts`.
