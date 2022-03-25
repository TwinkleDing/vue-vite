<template>
    <div>
        <!-- <robot /> -->
        <soldier />
    </div>
</template>
<script lang="ts" setup>
import robot from "./robot.vue"
import soldier from "./soldier.vue"

import { useRoute } from "vue-router"

const route = useRoute()
</script>

<style scoped>
</style>