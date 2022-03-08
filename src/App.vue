<template>
    <router-view />
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

<style scoped>
</style>