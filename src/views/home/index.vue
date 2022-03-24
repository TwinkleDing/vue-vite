<template>
    <div>
        <robot />
    </div>
</template>
<script lang="ts" setup>
import robot from "./robot.vue"

import { useRoute } from "vue-router"

const route = useRoute()
</script>

<style scoped>
</style>