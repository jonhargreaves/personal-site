import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
async function sources(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "layout-engine" ? [] : sources(file);
    return /\.(ts|tsx)$/.test(entry.name) ? [file] : [];
  }))).flat();
}
function imports(source) {
  return [...source.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)["']([^"']+)["']/g)].map((match) => match[1]);
}
function resolveImport(file, specifier) {
  if (specifier.startsWith("@/")) return path.resolve(root, specifier.slice(2));
  if (specifier.startsWith(".")) return path.resolve(path.dirname(file), specifier);
  return null;
}

test("the shared viewer has no product implementation dependencies", async () => {
  for (const file of await sources(path.join(root, "components/prototype"))) {
    for (const specifier of imports(await readFile(file, "utf8"))) {
      const target = resolveImport(file, specifier);
      assert.ok(!target?.startsWith(path.join(root, "prototypes/")), `${path.relative(root, file)} imports ${specifier}`);
    }
  }
});

test("prototype source cannot depend on another project's implementation", async () => {
  for (const file of await sources(path.join(root, "prototypes"))) {
    const relative = path.relative(path.join(root, "prototypes"), file);
    if (!relative.includes(path.sep)) continue; // catalog is the explicit registration boundary
    const project = relative.split(path.sep)[0];
    for (const specifier of imports(await readFile(file, "utf8"))) {
      const target = resolveImport(file, specifier);
      if (!target?.startsWith(path.join(root, "prototypes/"))) continue;
      assert.equal(path.relative(path.join(root, "prototypes"), target).split(path.sep)[0], project,
        `${path.relative(root, file)} crosses a prototype boundary: ${specifier}`);
    }
  }
});

async function resolveSource(file, specifier) {
  const base = resolveImport(file, specifier);
  if (!base) return null;
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
    if (/\.(ts|tsx)$/.test(candidate)) {
      try { return { file: candidate, content: await readFile(candidate, "utf8") }; } catch { /* Try the next module extension. */ }
    }
  }
  return null;
}

test("portfolio previews cannot pull in interactive compositions or state", async () => {
  const visited = new Set();
  async function visit(file, content) {
    if (visited.has(file)) return;
    visited.add(file);
    for (const specifier of imports(content)) {
      const next = await resolveSource(file, specifier);
      if (!next || !next.file.startsWith(path.join(root, "prototypes/"))) continue;
      const relative = path.relative(path.join(root, "prototypes"), next.file);
      const [project, bucket] = relative.split(path.sep);
      assert.ok(!["components", "state", "data", "layout-engine"].includes(bucket) && bucket !== `${project}.tsx`,
        `Portfolio preview reaches interactive code: ${relative}`);
      await visit(next.file, next.content);
    }
  }
  const catalog = path.join(root, "prototypes/catalog.ts");
  await visit(catalog, await readFile(catalog, "utf8"));
});
