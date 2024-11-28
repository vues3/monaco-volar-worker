export default {
  build: {
    lib: {
      entry: "./src/vue.worker.ts",
      formats: ["es"],
      name: "vue.worker.ts",
    },
    resolve: {
      alias: {
        path: "path-browserify",
      },
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
};
