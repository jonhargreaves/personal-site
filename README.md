# Jon Hargreaves — Personal Site

The source for [jonhargreaves.com](https://jonhargreaves.com), a compact portfolio and profile site built with Next.js, React, TypeScript, and Tailwind CSS.

## Requirements

- Node.js 24 (see `.node-version`)
- pnpm 11.22.0

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Run all three with `pnpm check`.

## Project structure

- `app/` — page, metadata routes, fonts, and global styles
- `components/` — reusable project and menu components
- `public/` — static assets

The site uses a locally hosted licensed copy of Diatype Mono. Do not redistribute the font files separately from this project.
