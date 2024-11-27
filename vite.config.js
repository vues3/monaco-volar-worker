export default {
  build: {
    lib: {
      entry: "vue.worker.js",
      formats: ["es"],
      name: "vue.worker.js",
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
};
