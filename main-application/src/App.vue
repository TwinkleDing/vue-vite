<template>
    <div v-show="micro" id="frame"></div>
    <div v-show="!micro" id="main">
        <router-view />
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, Ref, watch } from "vue"
    import { getStore } from "@/utils/storage"
    import { useStore } from "vuex"
    import { useRoute } from "vue-router"

    export default defineComponent({
        name: "App",
        setup() {
            const store = useStore()
            const route = useRoute()
            const micro: Ref<boolean> = ref(false)

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

            watch(
                () => route,
                () => {
                    if(route.path.includes('micro')) {
                        micro.value = true
                    }
                },
                {
                    immediate: true, // 立即执行
                    deep: true // 深度监听
                }
            )

            return {
                micro: micro
            }
        }
    })
</script>

<style>
    #main,
    #frame {
        height: 100%;
        width: 100%;
    }
</style>
