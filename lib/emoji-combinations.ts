export type TileColor = "red" | "blue" | "yellow";
export type TileId = "smile" | "heart" | "hands" | "eyes" | "ok" | "fire";
export type TileColors = Record<TileId, TileColor>;

export const initialTileColors: TileColors = {
  smile: "red", heart: "blue", hands: "yellow",
  eyes: "blue", ok: "yellow", fire: "red",
};

// Match emoji identities, independent of the responsive grid's visual order.
export function matchEmojiCombination(colors: TileColors): 1 | 2 | 3 | 4 | 5 | null {
  const values = Object.values(colors);
  if (values.every((color) => color === "blue")) return 1;
  if (values.every((color) => color === "yellow")) return 2;
  if (values.every((color) => color === "red")) return 3;
  if (colors.heart !== "yellow" || colors.ok !== "yellow") return null;
  if (colors.smile === "blue" && colors.eyes === "blue" &&
      colors.hands === "red" && colors.fire === "red") return 4;
  if (colors.smile === "red" && colors.eyes === "red" &&
      colors.hands === "blue" && colors.fire === "blue") return 5;
  return null;
}
