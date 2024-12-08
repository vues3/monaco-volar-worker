import type {
  LibraryFormats,
  BuildEnvironmentOptions,
  LibraryOptions,
} from "vite";
import type { InputOption } from "rollup";
import { defineConfig } from "vite";
import { resolve } from "path";

/** Build specific options */
const build = (() => {
  const lib = (() => {
    /** Path of library entry */
    const entry = resolve(resolve("src"), "vue.worker.ts") as InputOption;
    /** Output bundle formats */
    const formats = ["es"] as LibraryFormats[];
    /**
     * The name of the package file output. The default file name is the name
     * option of the project package.json. It can also be defined as a function
     * taking the format as an argument.
     */
    const fileName = "[name]";
    /**
     * Build in library mode. The value should be the global name of the lib in
     * UMD mode. This will produce esm + cjs + umd bundle formats with default
     * configurations that are suitable for distributing libraries.
     */
    return { entry, formats, fileName } as LibraryOptions;
  })();
  return { lib } as BuildEnvironmentOptions;
})();

export default defineConfig({ build });
