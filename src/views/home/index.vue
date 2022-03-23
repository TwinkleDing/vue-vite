<template>
    <div>
        <robbot />
    </div>
</template>
<script lang="ts" setup>
import robbot from "./robbot.vue"

import { useRoute } from "vue-router"

const route = useRoute()
</script>

<style scoped>
</style>