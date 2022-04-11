<template>
    <div class="model">
        <el-tabs class="model-tabs" type="border-card" @tab-click="tabClick" tab-position="left">
            <el-tab-pane key="robot" label="Robot">
                <robot :height="height" :width="width" v-if="showModel === 'Robot'" />
            </el-tab-pane>
            <el-tab-pane key="soldier" label="Soldier">
                <soldier :height="height" :width="width" v-if="showModel === 'Soldier'" />
            </el-tab-pane>
            <el-tab-pane key="three7" label="Three7">
                <three7 :height="height" :width="width" v-if="showModel === 'Three7'" />
            </el-tab-pane>
            <el-tab-pane key="earth" label="earth">
                <earth :height="height" :width="width" v-if="showModel === 'earth'" />
            </el-tab-pane>
            <el-tab-pane key="earth1" label="earth1">
                <earth1 :height="height" :width="width" v-if="showModel === 'earth1'" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts" setup>
import { ref, Ref } from "vue"
import robot from "./components/robot.vue"
import soldier from "./components/soldier.vue"
import three7 from "./components/three7.vue"
import earth from "@/components/Earth.vue"
import earth1 from "./components/Earth1.vue"
import { useRoute } from "vue-router"
// loader/gltf
// ammo/cloth
// controls/fly

const route = useRoute()

const showModel: Ref<string> = ref("Robot")

const height: Ref<number> = ref(765)
const width: Ref<number> = ref(1360)

const tabClick = (e: any) => {
    showModel.value = e.props.label
}
</script>

<style lang="scss">
.lil-gui.autoPlace {
    top: 120px !important;
    position: fixed;
    right: 20px;
}
.model {
    height: 795px;
    &-tabs {
        height: 100%;
    }
}
</style>