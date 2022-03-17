import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig({
    plugins: [
        vue(),
        ElementPlus({
            useSource: true,
        })
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
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/css/element/index.scss" as *;`,
            },
        },
    },
    server: {
        host: "0.0.0.0",
        port: 667,
        open: true,
    },
});
