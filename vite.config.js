export default {
  build: {
    lib: {
      entry: "./src/vue.worker.ts",
      formats: ["es"],
      name: "vue.worker.ts",
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
};
