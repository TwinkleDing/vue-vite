import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver()]
        }),
        visualizer()
    ],
    base: "/",
    mode: "development",
    publicDir: "public",
    resolve: {
        alias:
        {
            "@": path.resolve(__dirname, "src"),
            "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
        }
        ,
        extensions: ['.js', '.ts', '.tsx', '.json']
    },
    server: {
        host: "0.0.0.0",
        port: 667,
        open: true,
        hmr: true
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id: string) {
                    if (id.includes("node_modules")) {
                        return id.toString().split("node_modules/")[1].split("/")[0].toString()
                    }
                },
                assetFileNames: "static/[ext]/[name]-[hash].[ext]"
            }
        },
        target: "esnext",
        brotliSize: false,
        minify: "esbuild"
    }
})
