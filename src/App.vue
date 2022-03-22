<template>
    <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { getStore } from "@/utils/store"
import { useStore } from "vuex"

export default defineComponent({
    name: "App",
    setup() {
        const store = useStore()

        store.commit(
            "SET_THEME_COLOR",
            getStore({ name: "themeColor" })
                ? getStore({ name: "themeColor" })
                : store.getters.themeColor
        )
    }
})
</script>