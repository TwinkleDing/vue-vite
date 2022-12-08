<template>
    <el-config-provider :locale="locale">
        <router-view />
    </el-config-provider>
</template>
<script lang="ts">
    import { defineComponent } from "vue"
    import { getStore } from "@/utils/storage"
    import { useStore } from "vuex"
    import { ElConfigProvider } from "element-plus"
    import zhCn from "element-plus/dist/locale/zh-cn.mjs"

    export default defineComponent({
        name: "App",
        components: {
            ElConfigProvider
        },
        setup() {
            const store = useStore()

            store.commit(
                "SET_SYSTEM_THEME",
                getStore({ name: "systemTheme" })
                    ? getStore({ name: "systemTheme" })
                    : store.getters.systemTheme
            )
            store.commit(
                "SET_MENU_THEME",
                getStore({ name: "menuTheme" })
                    ? getStore({ name: "menuTheme" })
                    : store.getters.menuTheme
            )
            store.commit(
                "SET_HEADER_THEME",
                getStore({ name: "headerTheme" })
                    ? getStore({ name: "headerTheme" })
                    : store.getters.headerTheme
            )
            return {
                locale: zhCn
            }
        }
    })
</script>
