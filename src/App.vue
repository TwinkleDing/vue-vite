<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script lang="ts">
import index from "./views/index/index.vue";
export default {
    name: "App",
    components: {
        index,
    },
};
</script>

<style lang="less" scoped>
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