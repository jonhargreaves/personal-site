# Case-study prototypes

Each project is an independent prototype with locally maintained components. The portfolio owns the viewer; each prototype owns its design, interactions, and sample state. Hyper's UI was initially based on the supplied Hyper source and is now edited here directly.

```text
prototypes/
  catalog.ts                    # Server-only preview registration by case-study slug
  hyper-meeting/
    config.ts                   # Stable ID, URL, labels, loading section count
    hyper-meeting.tsx           # Interactive entry and composition-level state
    components/                 # Top bar, stage, controls, People, Chat, More
    state/                      # Hooks, providers, actions, simulated conversation
    data/                       # Participants, devices, fictional chat history
    design-system/
      components/               # Owned primitives and reusable product surfaces
      icons/                    # Product glyphs and icon adapters
      hooks/                    # Reusable UI behavior
      lib/                      # UI utilities
      internal/                 # Animation loaders
      styles/                   # Product tokens, typography, utilities
      assets/fonts/             # Inter and its license
    preview/                    # Lightweight definition and loading compositions
    styles/prototype.css        # Isolated document styles and composition rules
    layout-engine/              # Attributed third-party compiled tile algorithm
  fathom-ios-onboarding/        # Next prototype; implementation not started
  quicknode-streams/            # Next prototype; implementation not started
```

## Adding a prototype

1. Create the project's `config.ts`, entry, and folders following Hyper's structure. Keep product-specific primitives and surfaces in its own `design-system/`; compose them in `components/`. Add sample records in `data/` and interaction state in `state/`. Do not import components from another prototype.
2. Add a thin route at `app/prototypes/<project>/page.tsx` that imports only that project's entry and `styles/prototype.css`. The current Hyper route is the working example. Keep static assets in `public/prototypes/<project>/` and their attribution alongside the project.
3. Build the product's theme in its iframe with `@import "tailwindcss" source(none)` and a source scan limited to that project, as Hyper does. The portfolio's stylesheet excludes prototype source except `preview/`, whose loading utilities need to render before the iframe loads.
4. Export a `PrototypeDefinition` from `preview/definition.tsx` and register it in `catalog.ts` under the case-study slug. This definition contains metadata, a small logo, and the matching loading composition. It must not import the interactive entry, panel implementations, editor, or full design-system barrels. Unregistered case studies keep their existing image placeholder.
5. Load expensive sections independently with `next/dynamic` or `React.lazy`. Report section completion using the shared `PrototypeProgress` contract in `components/prototype/protocol.ts`: `{ type: "prototype:progress", prototypeId, completed, total }`. Send it with `window.parent.postMessage(message, window.location.origin)`. Set `total` to `config.sections`; completion of all sections dismisses the shared viewer's loading status. The viewer verifies the message's origin, iframe window, project ID, and section count.
6. Keep panel state inside the runtime and retain opened panels while navigating within the prototype. Keep live services, camera/microphone capture, and uploads out of sample compositions unless explicitly needed. Follow the existing reduced-motion, keyboard focus, independent panel scrolling, slow-load guidance, and retry behavior.
7. Run `pnpm test` and `pnpm check`. Review the case-study embed at mobile, tablet, and desktop sizes, including loading, device switching, panel navigation, and keyboard interaction.

## Shared infrastructure

`components/prototype/` owns device selection, sizing, deferred iframe mounting, progress validation, retry, and loading announcements. It accepts project content through `PrototypeDefinition`; it has no dependency on a particular product. Keep product state and visual tokens out of this folder.

`catalog.ts` is consumed by the server-rendered case study. Adding a project there exposes only its preview to the portfolio, while the runtime remains behind its iframe URL. Do not export every project's runtime from a common barrel.

All TypeScript UI source, including design-system components, participates in normal linting and type checking. Only the compiled third-party tile-layout distribution is excluded from linting. There is no component regeneration or upstream synchronization step.
