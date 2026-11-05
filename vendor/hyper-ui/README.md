# Hyper UI source snapshot

The layout control retains its Dynamic label and original appearance, but its dropdown menu is omitted for now. Activating it does not change participant views or the stage layout.

At desktop and tablet viewport widths (768px and above), tile name labels use 10px inline padding and 6px block padding. Their 8px edge offsets and corner radii apply at every viewport size.

The mobile top bar keeps the original compact recording island in its center slot. Equal 88px side columns center it independently of the logo/layout and Invite/Search groups; the title truncates on narrow previews. The mobile layout trigger retains its layout icon and right-hand chevron at 32px high. Invite uses the original 32px icon-button sizing with `HugeUserAdd01Stroke`. Desktop retains its full logo, layout label, participant stack, and text Invite action.

Audio and video device-menu settings actions use Hyper's original `HugeSettings02Stroke`, matching the footer's `HugeSettings02Duotone` outline without its fill layer. The snapshot script preserves this scoped icon substitution.

The mobile preview spans the available footer width. React sits at the leading edge, More at the trailing edge, and the microphone/camera/leave controls share a centered group with 12px gaps. The outer row uses space-between with equal-width edge actions, retaining Hyper's original button components and sizes.

The original `MeetingReactionStream` is composed into the local participant tile's `media` slot, clipped to that tile so sent reactions stay within Jon's video area. The reaction picker uses a 16px popup radius through `contentClassName`; the host stylesheet gives its choices 8px corners and removes their hover translation.

The call-control action model follows `MeetingCallControlsInteractiveExample` in the supplied `call-controls.demo-fixtures.tsx`: source tooltip copy for each state, accent tones for Share and Captions, and panel-active tones for Chat, People, and More. Desktop controls and mobile sheet actions share the same state and handlers. Share and Captions simulate toggles; Settings, Access, Chat, and People expose selectable placeholder states without opening new surfaces. Only one panel action is selected at a time. Device-menu settings actions select the same Settings state. Placeholder controls use `aria-pressed` rather than announcing an absent expanded panel.

At the user's request, the tile name overlay imports Hyper's `HugeMicOff02Duotone` under its existing muted-icon name, matching the microphone call control. The snapshot script preserves this import substitution; tile sizing and mute-state behavior remain unchanged.

This is the subset of the user-supplied `hyper-ui` repository needed by the Hyper meeting case study. `manifest.json` records the upstream revision and a SHA-256 hash of both each original file and its local snapshot.

The component implementations, icons, design tokens, and interactions come from Hyper UI. Imports are rewritten to relative paths so this repository builds without the sibling checkout or private registry credentials. The icon entrypoint includes only the required exports. The upstream tiles entry references an absent `LucideVideoOff` export; the local facade maps that legacy name to Hyper's existing `HyperVideoOffDuotone` asset. Type exports use `export type` for Next.js isolated modules.

The meeting's `MeetingVideoOffIcon` is a user-requested Figma replacement from file `7p0SO1BOGmnOaB0CiQZhKk`, node `459:3265`. The snapshot script routes that leaf to the site's adapter in `components/hyper-meeting/icons/`; both original and adapted hashes remain in the manifest. The adapter renders the untouched exported SVG in `public/prototypes/hyper-meeting/icons/video-off.svg`, preserving its natural dimensions and placement within the 20×20 Figma frame. The host stylesheet removes the split pill's horizontal SVG nudge for the microphone and camera toggles so their icons stay centered in both states.

The stylesheet retains Hyper's tokens, utilities, and motion. Imports and source scans for unused Markdown, AI, and shimmer integrations are omitted. It is loaded only by `/prototypes/hyper-meeting`, inside the case study's iframe, so its Tailwind theme cannot change the portfolio page.

The host stylesheet overrides the fullscreen app's `overscroll-behavior` with native vertical chaining on the iframe's `html` and `body`. Scrolling can continue into the surrounding case study, while panels consume their own scroll until reaching an edge.

`fonts/` retains the Latin variable Inter font from the supplied docs app's `@fontsource-variable/inter` 5.3.0 installation and its license. The prototype loads it under the existing `Inter` family token so the theme uses the intended typeface rather than a system fallback. Font assets are hashed in the manifest and refreshed by the snapshot script.

`tile-layouts/` retains the supplied, installed `@hypervideo/tile-layouts` 2.0.1 package, including its license, and powers the actual participant layout calculations.

To refresh from an available checkout, run from the personal site root:

```sh
node scripts/snapshot-hyper-ui.mjs /absolute/path/to/hyper-ui
```

Keep application state, sample participants, and compositions in `components/hyper-meeting/`. Keep the reusable device viewer in `components/prototype/`. Do not restyle or replace the source components to extend a composition; update the snapshot from the design system when its implementation changes.

The top bar uses the supplied `meeting-ui/primitives/top-bar.tsx` directly. Its desktop slots retain the original 16px group spacing and 32px control height. The logo and layout trigger follow `layouts/meeting-shell.demo-fixtures.tsx`, including the trigger's native padding, icon sizing, and gap. The right slot uses the supplied `AvatarStack` and `AvatarStackItem` components for all four sample participants, with the header example's 24px avatar size and the stack's native 6px overlap and masks. Invite and Search remain grouped 8px apart, 16px after the stack. The stack selects the same People control state as the footer. Compact headers retain the recording island and essential controls while hiding the desktop stack. Search uses the original Dialog and Input; Invite copies the case study link.

The recording state uses the original `MeetingIslandDesktop`, `MeetingIslandMobile`, and animated `MeetingRecordingIcon` from `surfaces/meeting-island/`. Its recording status is enabled in this sample meeting. The local composition owns the elapsed clock and editable title, preserving both when the viewer changes device sizes. The original desktop island supplies the title menu, recording tooltip, and timer; its Rename, Copy link, and End meeting actions use local meeting state. Mobile uses Hyper's compact logo and centered island, with icon-only layout, Invite, and Search controls to preserve space.

The stage uses the original `MeetingCallStageRoot`, responsive `MeetingCallStageMain`, `MeetingCallContentFrame`, and `MeetingTileGridViewport`. The shell owns the single 16px stage gutter; the main surface uses `fullBleed` to avoid doubling it. `useMeetingTileLayout` retains Hyper's 8px tile gap, sizing, focus/pin layout, and divider. The host stylesheet sets name labels 8px from the bottom/left and menu buttons 8px from the top/right, both with 8px corners. Menu buttons appear on tile hover or keyboard focus and remain visible while their menu is open; devices without hover retain visible menu targets. A local simulated conversation cycles all four participants through the original `isSpeaking` state, with pauses and brief overlaps. Hyper's existing tile outline and avatar ripples show each speaker. Muting the local microphone suppresses that participant's speaking state, and the sequence pauses in background tabs.

Call controls follow `apps/docs/src/examples/call/controls.tsx`, using the original `CallControls` parts and shell slots. Desktop uses the three action groups; compact widths use video, audio, reactions, leave, and More. At the user's request, the compact More trigger composes Hyper's original `DrawerTrigger`, `MobilePreviewButton`, and `MeetingMoreIcon` so it matches the desktop More button while opening the action sheet. That sheet includes nested device selection and access to the meeting's More panel. Device names follow Hyper's fixtures, selections use local state, and the original `AudioLevelMeter` shows the reference's fixed sample signal. All call controls and regular More panel items are enabled, including placeholder actions without destinations. Only Coming soon entries remain disabled. Call-control popovers and drawers retain the source radii along with the buttons in the main bar.

The local composition adds an intermediate desktop layout matching the supplied compact control-bar reference. Below 1100px of control-container width, Captions and People hide, retaining Settings/Access, Audio/Video/Share/React/Leave, and Chat/More in their original groups. At 768px of available control width, those groups fit with 32px gaps; below that the original five-action mobile preview takes over. Buttons and split media controls keep Hyper's original small sizing, and an open More panel uses the original `panelActive` tone. Named container queries adapt to the remaining meeting column when a side panel opens, independently of the iframe viewport.

The host composition places the original `MeetingSidePanelRoot` beside the entire meeting column so it spans the header, stage, and controls. The case study's requested 8px button radius is scoped in the prototype stylesheet; call controls retain their original Hyper radii.
