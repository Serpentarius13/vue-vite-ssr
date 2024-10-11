import vue from "@vitejs/plugin-vue";
// Vite does not handle prefetching CSS in dev mode while doing SSR
// which leads to flickers. Github: https://github.com/vitejs/vite/issues/16515
import { vitePluginSsrCss } from "@hiogawa/vite-plugin-ssr-css";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

export default defineConfig(({}) => ({
  plugins: [
    vue(),
    vitePluginSsrCss({
      entries: ["/src/entry-client"],
    }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },

  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src/app", import.meta.url)),
      },
      {
        find: "~",
        replacement: fileURLToPath(new URL("./src/shared", import.meta.url)),
      },
    ],
  },
}));
