import {
  defineConfig
} from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import {
  ElementPlusResolver
} from "unplugin-vue-components/resolvers"
import {
  visualizer
} from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    visualizer(),
  ],
  base: "/",
  mode: "development",
  publicDir: "public",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
    }
  },
  server: {
    host: "0.0.0.0",
    port: 668,
    open: true
  },
  build: {
    outDir: "../dist/micro",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        // 微应用的包名，这里与主应用中注册的微应用名称一致
        library: 'MicroApp',
        // 将你的 library 暴露为所有的模块定义下都可运行的方式
        libraryTarget: 'umd',
        // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
        jsonpFunction: 'webpackJsonp_MicroApp'
      }
    },
    brotliSize: false,
    target: 'esnext',
    minify: 'esbuild'
  },
  define: {
    'process.env': {}
  }
})