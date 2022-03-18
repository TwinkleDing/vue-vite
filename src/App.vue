<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
import { getStore } from "@/utils/store";

export default defineComponent({
    name: "App",
    setup() {
        const { proxy }: any = getCurrentInstance();

        proxy.$store.commit(
            "SET_THEME_COLOR",
            getStore({ name: "themeColor" })
                ? getStore({ name: "themeColor" })
                : proxy.$store.getters.themeColor
        );
        return {};
    },
});
</script>

<style lang="scss" scoped>
html,
body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    width: 100%;
}
</style>