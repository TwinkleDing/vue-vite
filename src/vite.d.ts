/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module "element-plus/dist/locale/zh-cn.mjs"
declare module "element-plus/dist/locale/en.mjs"
declare module "nprogress"
declare module "vue3-particles"
declare module "vue-i18n"
