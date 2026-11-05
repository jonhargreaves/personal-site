import styles from "./meeting-chat-composer.module.css";

export type ComposerIconName = "bold" | "italic" | "underline" | "strikethrough" | "link" | "numbered-list" | "bulleted-list" | "code" | "add" | "formatting" | "emoji" | "mention" | "send";

/** Original Figma exports retain their 16px frames and optical glyph placement. */
export default function ComposerIcon({ name }: { name: ComposerIconName }) {
  return <span aria-hidden="true" className={styles.icon} style={{ maskImage: `url(/prototypes/hyper-meeting/icons/chat-composer/${name}.svg)` }} />;
}
