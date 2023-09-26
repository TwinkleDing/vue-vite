<template>
  <div class="model" ref="model">
    <el-tabs
      class="model-tabs"
      type="border-card"
      tab-position="left"
      v-model="showModel"
    >
      <el-tab-pane
        v-for="item in tabList"
        :key="item.key"
        :name="item.key"
        :label="item.label"
        :lazy="true"
      >
        <component
          :is="item.component"
          v-if="showModel === item.key"
          :height="height"
          :width="width"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, Ref, reactive, onMounted, shallowRef } from "vue";
import robot from "./components/robot.vue";
import soldier from "./components/soldier.vue";
import three7 from "./components/three7.vue";
import earth from "@/components/Earth/index.vue";
import waves from "./components/waves.vue";
import bee from "./components/bee.vue";
import trois from "./components/trois.vue";
import { useRoute } from "vue-router";

interface Components {
  key: string;
  label: string;
  component: any;
}

const route = useRoute();
const CANVAS_HEIGHT: number = 820;
const CANVAS_WIDTH: number = 1540;

const showModel: Ref<string> = ref("trois");
const height: Ref<number> = ref(CANVAS_HEIGHT);
const width: Ref<number> = ref(CANVAS_WIDTH);
const model = ref();
const tabList: Components[] = reactive([
  {
    key: "robot",
    label: "Robot",
    component: shallowRef(robot),
  },
  {
    key: "soldier",
    label: "Soldier",
    component: shallowRef(soldier),
  },
  {
    key: "three7",
    label: "Three7",
    component: shallowRef(three7),
  },
  {
    key: "earth",
    label: "Earth",
    component: shallowRef(earth),
  },
  {
    key: "waves",
    label: "Waves",
    component: shallowRef(waves),
  },
  {
    key: "bee",
    label: "Bee",
    component: shallowRef(bee),
  },
  {
    key: "trois",
    label: "Trois",
    component: shallowRef(trois),
  },
]);

onMounted(() => {
  height.value = model.value.clientHeight - 30;
  width.value = model.value.clientWidth - 130;
  console.log(width.value)
  window.onresize = function () {
    height.value = model.value.clientHeight - 30;
    width.value = model.value.clientWidth - 130;
  };
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
      box-sizing: border-box;
    }
    .el-tab-pane {
      height: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
