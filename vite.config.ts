// vite.config.ts (library build)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.lib.json",
      entryRoot: "src",
      outDir: "dist",
      insertTypesEntry: true,
      exclude: ["playground/**"],
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ReactFlexibleTags",
      fileName: (format) => `react-flexible-tags.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
