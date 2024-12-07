import type { LibraryFormats } from "vite";

import { defineConfig } from "vite";

const entry = "./src/vue.worker.ts";
const formats: LibraryFormats[] = ["es"];
const lib = { entry, formats };
const entryFileNames = "[name].js";
const output = { entryFileNames };
const external = ["vue"];
const rollupOptions = { external, output };
const build = { lib, rollupOptions };
const path = "path-browserify";
const alias = { path };
const resolve = { alias };
export default defineConfig({ build, resolve });
