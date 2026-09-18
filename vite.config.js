import { readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf-8"));

/**
 * stampServiceWorkerCacheVersion
 *
 * One job: after the static `public/sw.js` is copied into `dist/`, replace
 * its `__CACHE_VERSION__` placeholder with a value that's guaranteed to
 * change on every build (package.json version + build timestamp). Vite's
 * `define` can't reach files under `public/` because they're copied
 * verbatim, not run through the module transform pipeline — hence this
 * small post-build string substitution instead of pulling in a full PWA
 * plugin just for cache-busting one file.
 */
function stampServiceWorkerCacheVersion() {
  return {
    name: "stamp-service-worker-cache-version",
    closeBundle() {
      const outDir = resolve(__dirname, "dist");
      const swPath = resolve(outDir, "sw.js");
      let stat;
      try {
        stat = statSync(swPath);
      } catch {
        return; // dist/sw.js wasn't emitted (e.g. a non-default build layout).
      }
      if (!stat.isFile()) return;

      const cacheVersion = `${pkg.version}-${Date.now()}`;
      const contents = readFileSync(swPath, "utf-8");
      writeFileSync(swPath, contents.replaceAll("__CACHE_VERSION__", cacheVersion));
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [stampServiceWorkerCacheVersion()],
  build: {
    outDir: "dist",
  },
});
