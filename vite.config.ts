import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { VueAmapResolver } from "@vuemap/unplugin-resolver";
import userConfig from "./config";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3003,
    host: "0.0.0.0",
    hmr: true,
  },
  define: {
    "process.env":
      process.env.NODE_ENV === "production"
        ? userConfig.buildEnv
        : userConfig.devEnv,
  },
  css: {
    // preprocessorOptions: {
    //   scss: {
    //     additionalData: `@import "@/styles/variable.scss";`,
    //   },
    // },
  },
  plugins: [
    vue(),
    vueJsx(),
    VueSetupExtend(),
    Components({
      resolvers: [VantResolver(), VueAmapResolver()],
    }),
    AutoImport({
      imports: ["vue", "vue-router", "vue-i18n"],
      dts: "src/auto-import.d.ts",
      resolvers: [VueAmapResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@pages": resolve(__dirname, "src/pages"),
      "@components": resolve(__dirname, "src/components"),
      "@layout": resolve(__dirname, "src/layout"),
      "@api": resolve(__dirname, "src/api"),
      "@utils": resolve(__dirname, "src/utils"),
      "@store": resolve(__dirname, "src/store"),
      "@assets": resolve(__dirname, "src/assets"),
      "@i18n": resolve(__dirname, "src/i18n"),
      "@type": resolve(__dirname, "src/type"),
    },
  },
});
