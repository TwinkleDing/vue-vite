<template>
    <div> {{ route.path }} </div>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router"

const route = useRoute()
</script>

<style scoped>
</style>