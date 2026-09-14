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

## Analytics

The root layout loads Google Analytics 4 with measurement ID `G-RLR91ZLTBT`
in production builds. `pnpm dev` does not send analytics events.

The web stream for `https://jonhargreaves.com` has Enhanced measurement enabled
for page views, scrolls, and outbound clicks. Let Google collect these events
automatically rather than adding duplicate manual page-view events.

After deploying, visit the live site and confirm the visit in Google Analytics
Realtime. You can also use **Admin → Data streams → Jon Hargreaves → View tag
instructions → Test installation** to verify the live tag. Production builds
served locally or as previews also send analytics, so account for those visits
when testing.

## Project structure

- `app/` — page, metadata routes, fonts, and global styles
- `components/` — reusable project and menu components
- `public/` — static assets

The site uses a locally hosted licensed copy of Diatype Mono. Do not redistribute the font files separately from this project.
