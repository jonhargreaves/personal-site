# Hyper meeting prototype

This module owns the meeting prototype and its design system. Edit its source directly. Components and tokens were initially adapted from the supplied Hyper UI source at revision `47a79cd771b2913186a51c7801a446f9f50648c4`; they are maintained as part of this site and are not linked to or regenerated from that checkout.

See [the shared project structure](../README.md) for folder responsibilities, preview registration, route isolation, and loading progress. `hyper-meeting.tsx` composes the top bar, participant stage, call controls, and nested More/People/Chat sidebar. Each major section and each panel retains its own lazy loading boundary.

## Assets and attribution

- `design-system/assets/fonts/` contains Inter from `@fontsource-variable/inter` 5.3.0 with its original license.
- `layout-engine/` contains the unmodified compiled `@hypervideo/tile-layouts` 2.0.1 distribution. Its package metadata retains MPL-2.0 attribution to Robin Schreiber and the source repository. This algorithm is an external dependency, separate from the owned UI components.
- The camera-off, composer, reaction, and participant-menu SVGs in `public/prototypes/hyper-meeting/` were exported from the supplied Figma designs. The asset manifests retain their source node IDs and hashes. The camera-off adapter preserves the requested red palette.

The prototype uses fictional chat history and local sample participants. It has no meeting/chat backend and does not request live media permissions. Invite links, local attachments, reactions, and media selections remain browser-local interactions.
