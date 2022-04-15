<template>
    <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { getStore } from "@/utils/storage"
import { useStore } from "vuex"

export default defineComponent({
    name: "App",
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
    }
})
</script>