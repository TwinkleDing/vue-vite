<template>
    <div>
        <el-tabs type="border-card" @tab-click="tabClick" tab-position="left">
            <el-tab-pane key="robot" label="Robot">
                <robot v-if="showModel === 'Robot'" />
            </el-tab-pane>
            <el-tab-pane key="soldier" label="Soldier">
                <soldier v-if="showModel === 'Soldier'" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts" setup>
import { ref, Ref } from "vue"
import robot from "./robot.vue"
import soldier from "./soldier.vue"
import { useRoute } from "vue-router"

const route = useRoute()

const showModel: Ref<string> = ref("Robot")

const tabClick = (e: any) => {
    showModel.value = e.props.label
}
</script>

<style>
.lil-gui.autoPlace {
    top: 120px !important;
    position: fixed;
    right: 20px;
}
</style>