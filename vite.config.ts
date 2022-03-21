import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    base: "/",
    mode: "development",
    publicDir: "public",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
        },
    },
    server: {
        host: "0.0.0.0",
        port: 667,
        open: true,
    },
});
