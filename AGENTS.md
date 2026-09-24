# Project conventions

## React component organization

- Every React component must live in its own `.tsx` file. Do not declare multiple React components in the same `.tsx` file.
- Keep distinct pages in distinct folders under their feature's `pages` directory. In particular, sign-in and sign-up must live in `SignInPage/` and `SignUpPage/`, respectively.

## Feature-based architecture

- Keep feature-specific components, pages, hooks, queries, services, stores, schemas, types, and utilities inside `src/features/<feature>/`.
- Reserve `src/app/` for application composition such as routing, providers, and cross-feature orchestration; reserve `src/components/ui/`, `src/api/`, and `src/lib/` for genuinely shared infrastructure.
- Each feature query directory must split query concerns into exactly three file roles: `*.key.ts`, `*.queries.ts`, and `*.mutations.ts`.
