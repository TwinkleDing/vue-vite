<template>
  <div class="model" ref="model">
    <el-tabs
      class="model-tabs"
      type="border-card"
      @tab-click="tabClick"
      tab-position="left"
    >
      <el-tab-pane key="robot" label="Robot" :lazy="true">
        <robot :height="height" :width="width" v-if="showModel === 'Robot'" />
      </el-tab-pane>
      <el-tab-pane key="soldier" label="Soldier" :lazy="true">
        <soldier :height="height" :width="width" v-if="showModel === 'Soldier'" />
      </el-tab-pane>
      <el-tab-pane key="three7" label="Three7" :lazy="true">
        <three7 :height="height" :width="width" v-if="showModel === 'Three7'" />
      </el-tab-pane>
      <el-tab-pane key="earth" label="earth" :lazy="true">
        <earth :height="height" :width="width" v-if="showModel === 'earth'" />
      </el-tab-pane>
      <el-tab-pane key="waves" label="waves" :lazy="true">
        <waves :height="height" :width="width" v-if="showModel === 'waves'" />
      </el-tab-pane>
      <el-tab-pane key="bee" label="bee" :lazy="true">
        <bee :height="height" :width="width" v-if="showModel === 'bee'" />
      </el-tab-pane>
      <el-tab-pane key="trois" label="trois" :lazy="true">
        <trois v-if="showModel === 'trois'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, Ref, onMounted } from "vue";
import robot from "./components/robot.vue";
import soldier from "./components/soldier.vue";
import three7 from "./components/three7.vue";
import earth from "@/components/Earth/index.vue";
import waves from "./components/waves.vue";
import bee from "./components/bee.vue";
import trois from "./components/trois.vue";
import { useRoute } from "vue-router";
// loader/gltf
// ammo/cloth
// controls/fly
const route = useRoute();
const CANVAS_HEIGHT: number = 765;
const CANVAS_WIDTH: number = 1360;

const showModel: Ref<string> = ref("Robot");
const height: Ref<number> = ref(CANVAS_HEIGHT);
const width: Ref<number> = ref(CANVAS_WIDTH);
const model = ref();

const tabClick = (e: any): void => {
  showModel.value = e.props.label;
};
onMounted(() => {
  height.value = model.value.clientHeight - 30;
  width.value = model.value.clientWidth - 130;
});
</script>

<style scoped lang="scss">
.model {
  height: 100%;
  :deep(.el-tabs) {
    height: 100%;
    .el-tabs__header {
      width: 100px;
      box-sizing: border-box;
      border-bottom: 0;
      margin: 0;
    }
    .el-tabs__content {
      height: 100%;
    }
    .el-tab-pane {
      height: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
