---
trigger: always_on
---

# Frontend Project Structure Conventions

Apply these conventions throughout the repository when creating, moving, or refactoring frontend product code.

## Feature structure

- Organize product code by feature under `src/features/<feature>/`.
- Route-level React components belong under `src/features/<feature>/pages/`.
- Give every non-trivial page its own directory:

  ```text
  src/features/<feature>/pages/<PageName>/
  ├── <PageName>.tsx
  ├── index.ts
  ├── components/
  ├── hooks/
  └── utils/
  ```

- Create only the subdirectories that the page actually needs.
- The page's `index.ts` must re-export its default export so route imports remain concise:

  ```ts
  export { default } from "./<PageName>";
  ```

## Page files

- A page file must declare exactly one React component: the page component itself.
- The page component must be the default export.
- Do not declare helper, form, section, step, modal, row, or other React components in a page file.
- Keep page files focused on route-level state, layout, and composition of imported components.
- Small types, constants, and non-component callbacks may remain in the page file only when they are specific to page composition.
- Extract page-only UI and non-trivial behavior into the page's `components/`, `hooks/`, or `utils/` directories.

## Component ownership

Place each component at the narrowest scope that owns all of its real consumers:

1. Used by one page only: `src/features/<feature>/pages/<PageName>/components/`.
2. Used by multiple pages in one feature: `src/features/<feature>/components/`.
3. Used by multiple features and contains application behavior: `src/components/shared/`.
4. Reusable visual primitive without feature business logic: `src/components/ui/`.
5. Application shell or route layout: `src/components/layout/`.

- Do not place page-specific components in `src/components/shared/` or `src/components/ui/`.
- Do not promote a component in anticipation of reuse. Promote it only when a broader-scope consumer exists.
- When ownership changes, move the existing component to the correct scope instead of duplicating it.

## UI components

- Use the project's shared UI component library whenever an equivalent component exists.
- For projects using shadcn/ui, use the components in `src/components/ui/` instead of raw native controls or bespoke primitives.
- Do not introduce a raw native control or one-off UI primitive when the shared library provides the same behavior.
- When a reusable visual treatment is required, extend the shared component with a variant instead of repeatedly applying one-off styles.
- Keep feature business logic out of reusable visual primitives.

## Other feature-owned code

- Page-only hooks belong in `pages/<PageName>/hooks/`.
- Page-only helpers belong in `pages/<PageName>/utils/`.
- Hooks shared across a feature belong in `src/features/<feature>/hooks/`.
- Feature validation schemas belong in `src/features/<feature>/schemas/`.
- Feature types belong in `src/features/<feature>/types/` unless they are coupled to a cross-cutting API or store layer.
- Feature assets belong in `src/features/<feature>/assets/`; page-exclusive assets may be colocated inside the page directory.
- Code shared across features must live in the appropriate top-level shared, API, store, utility, or infrastructure layer rather than inside an arbitrary feature.

## Imports and naming

- Name React component files and page directories with PascalCase.
- Name hooks with the `use` prefix.
- Name utility files with descriptive kebab-case names.
- Use relative imports within the same page directory.
- Use the project's configured source alias, preferably `@/`, for imports across features or top-level boundaries.
- Avoid barrel files for internal page components; import the concrete component file directly.
- Avoid circular dependencies between features. Move genuinely cross-feature code to the correct shared layer.

## Refactoring and change rules

- Preserve the existing public behavior unless the task explicitly requires a behavior change.
- During refactoring, update every import after moving a file and remove the obsolete location.
- Do not keep duplicate implementations for backward compatibility unless the task explicitly requires it.
- Follow existing repository conventions when they are more specific than this rule.
- Before finishing, run the relevant formatter, linter, type checker, and tests available in the project.
