// Snapshot the supplied Hyper UI components and their dependencies into this repo.
// Preserve component source with import adapters and documented user-requested overrides.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import ts from "typescript";

const sourceRoot = path.resolve(process.argv[2] || "../hyper/hyper-ui");
const destination = path.resolve("vendor/hyper-ui");
const uiRoot = path.join(sourceRoot, "packages/ui/src");
const iconsRoot = path.join(sourceRoot, "packages/icons/src");
const exportsMap = JSON.parse(
  fs.readFileSync(path.join(sourceRoot, "packages/ui/package.json")),
).exports;
const entries = [
  "components/layouts/meeting-shell.tsx",
  "components/meeting-ui/primitives/top-bar.tsx",
  "components/brand/logo-full.tsx",
  "components/brand/logo.tsx",
  "components/button.tsx",
  "components/audio-level-meter.tsx",
  "components/avatar-stack/index.tsx",
  "components/dialog.tsx",
  "components/input.tsx",
  "components/dropdown-menu.tsx",
  "components/meeting-ui/surfaces/call-controls/index.tsx",
  "components/meeting-ui/surfaces/meeting-island/index.ts",
  "components/meeting-ui/surfaces/tiles/tiles.tsx",
  "components/meeting-ui/surfaces/stage/stage.tsx",
  "components/meeting-ui/surfaces/stage/meeting-tile-layout.ts",
  "components/meeting-ui/surfaces/more-panel/meeting-more-panel.tsx",
  "components/meeting-ui/surfaces/more-panel/more-panel.tsx",
  "components/meeting-ui/surfaces/side-panel/side-panel.tsx",
  "components/meeting-ui/surfaces/reactions/reaction-stream.tsx",
  "components/alert-dialog.tsx",
  "components/meeting-ui/surfaces/status/status.tsx",
];
const visited = new Set();
const icons = new Set();
// The supplied tiles entry references this old name; retain Hyper's current asset.
const iconAliases = { LucideVideoOff: "HyperVideoOffDuotone" };
const external = new Set();
const manifest = [];
const hash = (text) => crypto.createHash("sha256").update(text).digest("hex");
function findFile(base) {
  for (const file of [
    base,
    base + ".ts",
    base + ".tsx",
    base + ".js",
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ]) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  throw new Error("Cannot resolve " + base);
}
function targetOf(file) {
  if (file.startsWith(uiRoot + "/"))
    return path.join(destination, "ui", path.relative(uiRoot, file));
  if (file.startsWith(iconsRoot + "/"))
    return path.join(destination, "icons", path.relative(iconsRoot, file));
  throw new Error("Outside source roots: " + file);
}
function importPath(from, target) {
  let relative = path
    .relative(path.dirname(targetOf(from)), target)
    .replaceAll(path.sep, "/")
    .replace(/\.(tsx?|jsx?)$/, "");
  if (!relative.startsWith(".")) relative = "./" + relative;
  return relative;
}
function visit(file) {
  if (visited.has(file)) return;
  visited.add(file);
  const original = fs.readFileSync(file, "utf8");
  const ast = ts.createSourceFile(file, original, ts.ScriptTarget.Latest, true);
  const edits = [];
  function inspect(node) {
    const spec =
      ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
        ? node.moduleSpecifier
        : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword
          ? node.arguments[0]
          : null;
    if (spec && ts.isStringLiteral(spec)) {
      const name = spec.text;
      let resolved;
      let replacement;
      if (name === "@hypervideo/icons") {
        const bindings = node.importClause?.namedBindings || node.exportClause;
        if (!bindings || (!ts.isNamedImports(bindings) && !ts.isNamedExports(bindings)))
          throw new Error("Expected named icons: " + file);
        for (const item of bindings.elements) {
          const icon = (item.propertyName || item.name).text;
          icons.add(icon);
          const iconPath = path.join(iconsRoot, "icons", (iconAliases[icon] || icon) + ".tsx");
          visit(fs.existsSync(iconPath) ? iconPath : path.join(iconsRoot, "types.ts"));
        }
        replacement = importPath(file, path.join(destination, "icons/index.ts"));
      } else if (name.startsWith("@hypervideo/ui/")) {
        const publicPath = "./" + name.slice("@hypervideo/ui/".length);
        const definition = exportsMap[publicPath];
        const mapped = typeof definition === "object" ? definition.default : definition;
        const rel = mapped
          ? mapped.replace(/^\.\/dist\//, "").replace(/\.js$/, ".ts")
          : name.slice("@hypervideo/ui/".length);
        try {
          resolved = findFile(path.join(uiRoot, rel));
        } catch {
          resolved = findFile(path.join(uiRoot, rel.replace(/\.ts$/, ".tsx")));
        }
      } else if (name.startsWith("@hypervideo/icons/")) {
        resolved = findFile(path.join(iconsRoot, name.slice("@hypervideo/icons/".length)));
      } else if (name.startsWith(".")) {
        resolved = findFile(path.resolve(path.dirname(file), name));
      } else if (name === "@hypervideo/tile-layouts") {
        replacement = importPath(file, path.join(destination, "tile-layouts/dist/index.js"));
      } else external.add(name);
      if (resolved) {
        visit(resolved);
        replacement = importPath(file, targetOf(resolved));
      }
      if (replacement)
        edits.push({ start: spec.getStart(ast) + 1, end: spec.getEnd() - 1, text: replacement });
    }
    ts.forEachChild(node, inspect);
  }
  inspect(ast);
  let adapted = original;
  for (const edit of edits.sort((a, b) => b.start - a.start))
    adapted = adapted.slice(0, edit.start) + edit.text + adapted.slice(edit.end);
  // The prototype uses 20px primary call-control icons; caret sizes stay native.
  if (file.startsWith(path.join(uiRoot, "components/meeting-ui/surfaces/call-controls/"))) {
    adapted = adapted.replaceAll("size-4.5", "size-5");
    adapted = adapted.replace('size === "lg" ? 22 : 18', 'size === "lg" ? 22 : 20');
  }
  // Match participant mute indicators to the call control's original Hyper glyph.
  if (file === path.join(uiRoot, "components/meeting-ui/surfaces/tiles/tile-overlays.tsx")) {
    adapted = adapted.replace("  LucideMicOff,", "  HugeMicOff02Duotone as LucideMicOff,");
  }
  // Device-menu settings use the stroke counterpart of the footer settings glyph.
  if (
    file ===
    path.join(uiRoot, "components/meeting-ui/surfaces/call-controls/desktop-call-controls-picker-model.tsx")
  ) {
    adapted = adapted.replaceAll("LucideSettings", "HugeSettings02Stroke");
  }
  // The requested Figma replacement is owned by the site's composition layer.
  if (
    file ===
    path.join(uiRoot, "components/meeting-ui/surfaces/call-controls/meeting-video-off-icon.tsx")
  ) {
    const iconAdapter = path.resolve("components/hyper-meeting/icons/meeting-video-off-icon.tsx");
    adapted = `export { MeetingVideoOffIcon } from "${importPath(file, iconAdapter)}";\n`;
  }
  const target = targetOf(file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, adapted);
  manifest.push({
    source: path.relative(sourceRoot, file),
    file: path.relative(destination, target),
    sourceSha256: hash(original),
    snapshotSha256: hash(adapted),
  });
}
for (const icon of [
  "LucideChevronDown",
  "LucideLayoutPanelLeft",
  "LucideSearch",
  "HugeSettings02Duotone",
  "HugeSettings02Stroke",
  "HugeAirplayLineDuotone",
  "HugeCallEnd04Duotone",
  "HugeChatting01Duotone",
  "HugeUserMultiple02Duotone",
  "HugeUserAdd01Stroke",
  "HugeClosedCaptionDuotone",
  "HugeSecurityDuotone",
]) {
  icons.add(icon);
  visit(path.join(iconsRoot, "icons", icon + ".tsx"));
}
for (const entry of entries) visit(path.join(uiRoot, entry));
fs.writeFileSync(
  path.join(destination, "icons/index.ts"),
  [...icons]
    .sort()
    .map((icon) => {
      const asset = iconAliases[icon] || icon;
      const isType = !fs.existsSync(path.join(iconsRoot, "icons", asset + ".tsx"));
      return `export ${isType ? "type " : ""}{ ${asset}${asset !== icon ? " as " + icon : ""} } from "./${isType ? "types" : "icons/" + asset}";`;
    })
    .join("\n") + "\n",
);
const tileRoot = path.join(sourceRoot, "packages/ui/node_modules/@hypervideo/tile-layouts");
fs.cpSync(fs.realpathSync(tileRoot), path.join(destination, "tile-layouts"), { recursive: true });
for (const style of ["globals.css", "typeset.css", "logo-loader.css"]) {
  const original = fs.readFileSync(path.join(uiRoot, "styles", style), "utf8");
  const adapted =
    style === "globals.css"
      ? original
          .replace('@import "tailwindcss";', '@import "tailwindcss" source(none);')
          .replace(
            /^@import "(?:streamdown\/styles.css|@assistant-ui\/react-markdown\/styles\/dot.css|tw-shimmer)";\n/gm,
            "",
          )
          .replace(/^@source .*;\n/gm, "") +
        '\n@source "../**/*.{ts,tsx}";\n@source "../../../../components/hyper-meeting/**/*.{ts,tsx}";\n'
      : original;
  fs.mkdirSync(path.join(destination, "ui/styles"), { recursive: true });
  fs.writeFileSync(path.join(destination, "ui/styles", style), adapted);
  manifest.push({
    source: "packages/ui/src/styles/" + style,
    file: "ui/styles/" + style,
    sourceSha256: hash(original),
    snapshotSha256: hash(adapted),
  });
}
// Keep the preview self-contained with the same Inter asset used by Hyper's docs.
for (const [source, file] of [
  [
    "apps/docs/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
    "fonts/inter-latin-wght-normal.woff2",
  ],
  ["apps/docs/node_modules/@fontsource-variable/inter/LICENSE", "fonts/LICENSE"],
]) {
  const original = fs.readFileSync(path.join(sourceRoot, source));
  const target = path.join(destination, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, original);
  manifest.push({ source, file, sourceSha256: hash(original), snapshotSha256: hash(original) });
}
fs.writeFileSync(
  path.join(destination, "manifest.json"),
  JSON.stringify(
    {
      revision: execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: sourceRoot,
        encoding: "utf8",
      }).trim(),
      files: manifest.sort((a, b) => a.file.localeCompare(b.file)),
      externalImports: [...external].sort(),
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    { files: visited.size, icons: icons.size, externalImports: [...external].sort() },
    null,
    2,
  ),
);
