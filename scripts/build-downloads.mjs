/**
 * Runs build-css.mjs for each font × profile and copies dist/immich-bliss.css into DOWNLOADS/.
 */
import { execFileSync } from "node:child_process";
import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const buildScript = path.join(repoRoot, "scripts", "build-css.mjs");

const fonts = ["system", "inter", "zalando", "gabarito"];

const runBuild = (font, profile) => {
  const args = [buildScript, `--font=${font}`];
  if (profile === "max-performance") {
    args.push("--profile=max-performance");
  }
  execFileSync(process.execPath, args, {
    cwd: repoRoot,
    stdio: "inherit",
  });
};

const distCss = path.join(repoRoot, "dist", "immich-bliss.css");

const run = async () => {
  const outs = [];

  for (const font of fonts) {
    runBuild(font, "default");
    const dest = path.join(
      repoRoot,
      "DOWNLOADS",
      `immich-bliss-${font}.css`,
    );
    await copyFile(distCss, dest);
    outs.push(path.relative(repoRoot, dest));
  }

  for (const font of fonts) {
    runBuild(font, "max-performance");
    const dest = path.join(
      repoRoot,
      "DOWNLOADS",
      `immich-bliss-${font}-perf.css`,
    );
    await copyFile(distCss, dest);
    outs.push(path.relative(repoRoot, dest));
  }

  console.log(
    `\nUpdated ${outs.length} DOWNLOADS/*.css files (${fonts.length} fonts × 2 profiles).`,
  );
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
