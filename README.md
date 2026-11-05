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

## Interactive case study prototypes

The Hyper case study embeds `/prototypes/hyper-meeting` through the reusable viewer in `components/prototype/`. Each device option sets the iframe's actual viewport width; options that cannot fit the viewer's browser window are disabled. An unsupported selection falls back to the largest size that fits, and resizing the iframe preserves the meeting state.

Presets use logical viewport pixels: mobile 393 × 852 (iPhone 16), tablet 1180 × 820 (11-inch iPad Air in landscape), and desktop 1440 × 800 (desktop browser viewport). Mobile and tablet dimensions follow [Apple's screen size specifications](https://developer.apple.com/design/human-interface-guidelines/layout). Tablet remains available at a 1244px window and desktop at 1504px. On narrower windows, the mobile viewport adapts to the available width while preserving its aspect ratio. At desktop browser widths (1024px and above), the viewer spans the viewport with 32px outer gutters; below that it fills the case study content column. Its outer container has no padding, 16px corners, a white/15 border matching the device selector, and no background fill. The header row has 16px padding and a bottom divider inheriting the same border color; the meeting preview has 32px padding around it. Its iframe scales to fit this container while retaining the selected device's actual viewport and meeting layout.

The embedded document restores native vertical overscroll chaining, so scrolling over its tiles continues through the case study. Panels keep their own scrolling and hand back to the page at their boundaries.

The header centers “Hyper Meeting UI Prototype” between Hyper's white/25 logo mark and the device selector. Below 768px, the logo and selector are hidden, leaving the centered title. The logo stays at 24px inside a centered 32px frame.

People includes searchable Host/Members groups for the four current participants, live media status, and focus/pin actions. Chat includes a fictional design-review conversation, message reactions, rich-text formatting, mentions, emoji, and local message sending. Both open within More, retain their state when navigating back, and adapt to the mobile overlay. The composer follows the Figma input and selection states: a compact pinned toolbar, a toolbar above selected text when unpinned, separate list actions, and local file attachments.

The meeting composition lives in `components/hyper-meeting/`, with separate top bar, participant stage, controls, and More panel components. It uses the original Hyper UI components and tile layout engine from the source snapshot in `vendor/hyper-ui/`; see that directory's README for provenance and the refresh command. No sibling checkout or private registry authentication is required to build the site.

The first prototype supports media toggle states, sample microphone/camera/speaker selection, participant pin/focus actions, reactions at every size, nested More, People, and Chat panels, meeting renaming, and leave/rejoin. Compact controls follow Hyper's five-button preview and More action sheet. It uses sample participants and does not request live camera or microphone access. All call controls and regular More panel items are enabled for exploration, including actions without implemented destinations. Only Coming soon items remain disabled.

The top bar starts in Hyper's recording state with its original recording island, animated indicator, and running sample meeting timer. The desktop title menu opens a rename dialog built from Hyper's Dialog, Input, Label, and Button components, with Save and Cancel actions. Its copy action is labeled Copy invite link. The Search button remains visible without opening a dialog. The compact header keeps the recording indicator and title visible; title and elapsed time persist across device changes.

The participant stack retains Hyper's avatar components, with a local CSS module aligning each clipping mask to its neighboring avatar and preserving a 2px transparent separation. The overlap and mask direction mirror for RTL.

Run device availability and resize fallback checks with:

```sh
node --experimental-strip-types --test components/prototype/devices.test.mjs
```
