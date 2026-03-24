/**
 * Bundles src/styles/entrypoints/theme.css into dist/immich-bliss.css.
 * Resolves @import chains, swaps font + performance profile fragments, writes build-meta.json.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const fontOptions = new Map([
  ["system", "system.css"],
  ["inter", "inter.css"],
  ["zalando", "zalando.css"],
  ["gabarito", "gabarito.css"],
]);

const profileOptions = new Map([
  ["default", "default.css"],
  ["max-performance", "max-performance.css"],
]);

const parseFontArg = () => {
  const value = process.argv.find((arg) => arg.startsWith("--font="));
  return value ? value.replace("--font=", "").trim().toLowerCase() : "system";
};

const parseProfileArg = () => {
  const value = process.argv.find((arg) => arg.startsWith("--profile="));
  return value ? value.replace("--profile=", "").trim().toLowerCase() : "default";
};

const selectedFont = parseFontArg();
const fontFile = fontOptions.get(selectedFont);
const selectedProfile = parseProfileArg();
const profileFile = profileOptions.get(selectedProfile);

if (!fontFile) {
  console.error(
    `Unsupported font "${selectedFont}". Use one of: ${Array.from(
      fontOptions.keys(),
    ).join(", ")}`,
  );
  process.exit(1);
}

if (!profileFile) {
  console.error(
    `Unsupported profile "${selectedProfile}". Use one of: ${Array.from(
      profileOptions.keys(),
    ).join(", ")}`,
  );
  process.exit(1);
}

const resolveCss = async (filePath, visited = new Set()) => {
  const absolutePath = path.resolve(filePath);
  if (visited.has(absolutePath)) return "";
  visited.add(absolutePath);

  const raw = await readFile(absolutePath, "utf8");
  const importPattern = /^\s*@import\s+"([^"]+)";\s*$/gm;
  let output = "";
  let lastIndex = 0;
  let match;

  while ((match = importPattern.exec(raw)) !== null) {
    const [statement, relativeImportPath] = match;
    output += raw.slice(lastIndex, match.index);
    const childPath = path.resolve(path.dirname(absolutePath), relativeImportPath);
    output += `\n/* Source: ${path.relative(repoRoot, childPath)} */\n`;
    output += await resolveCss(childPath, visited);
    output += "\n";
    lastIndex = match.index + statement.length;
  }

  output += raw.slice(lastIndex);
  return output;
};

const run = async () => {
  const entrypoint = path.join(repoRoot, "src/styles/entrypoints/theme.css");
  let template = await readFile(entrypoint, "utf8");
  template = template.replace(
    '@import "../fonts/system.css";',
    `@import "../fonts/${fontFile}";`,
  );
  template = template.replace(
    '@import "../profiles/default.css";',
    `@import "../profiles/${profileFile}";`,
  );

  const tempEntrypoint = path.join(
    repoRoot,
    "src/styles/entrypoints/.theme.build.css",
  );
  await writeFile(tempEntrypoint, template);
  const resolved = await resolveCss(tempEntrypoint);
  const importRegex = /^\s*@import\s+url\([^)]+\);\s*$/gm;
  const extractedImports = [];
  let importMatch;

  while ((importMatch = importRegex.exec(resolved)) !== null) {
    extractedImports.push(importMatch[0].trim());
  }

  const uniqueImports = [...new Set(extractedImports)];
  const bodyWithoutImports = resolved.replace(importRegex, "");
  const normalizedBody = bodyWithoutImports.replace(/\n{3,}/g, "\n\n").trim();
  const cleaned =
    uniqueImports.length > 0
      ? `${uniqueImports.join("\n")}\n\n${normalizedBody}`
      : normalizedBody;

  const distDir = path.join(repoRoot, "dist");
  const outFile = path.join(distDir, "immich-bliss.css");
  await mkdir(distDir, { recursive: true });

  const banner = `/*\n * Immich Bliss Theme\n * Generated file. Do not edit directly.\n * Source: src/styles/**\n * Font profile: ${selectedFont}\n * Performance profile: ${selectedProfile}\n */\n\n`;
  await writeFile(outFile, banner + cleaned + "\n");
  await writeFile(
    path.join(distDir, "build-meta.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        font: selectedFont,
        profile: selectedProfile,
        output: "dist/immich-bliss.css",
      },
      null,
      2,
    ) + "\n",
  );
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
