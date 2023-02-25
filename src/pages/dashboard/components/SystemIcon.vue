<template>
  <div
    v-if="systemPosition === OUT_SIDE"
    class="system-setting"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div
      class="box"
      @mousedown="mouseDown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
      @mouseout="mouseOut"
    ></div>
    <Cpu class="icon" />
  </div>
  <system-drawer :drawer-visible="drawerVisible" @visibleClose="onVisibleClose" />
</template>
<script setup lang="ts">
import { ref, Ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { Cpu } from "@element-plus/icons-vue";
import { SystemIcon } from "@/utils/interface";
import SystemMouse from "./SystemMouse";
import SystemDrawer from "./SystemDrawer.vue";
import { OUT_SIDE } from "@/settings/config";

const store = useStore();
const systemMouse = new SystemMouse();
const drawerVisible: Ref<boolean> = ref(false);
const x: Ref<number> = ref(systemMouse.x);
const y: Ref<number> = ref(systemMouse.y);
const systemPosition: Ref<string> = ref(store.getters.systemPosition);

const mouseDown = (e: any): void => {
  systemMouse.mouseDown(e);
};
const mouseOut = systemMouse.mouseOut;
const mouseMove = async (e: any): Promise<void> => {
  const coordinates: any = await systemMouse.mouseMove(e);
  x.value = coordinates.x;
  y.value = coordinates.y;
};
const mouseUp = async (): Promise<void> => {
  const coordinates: any = await systemMouse.mouseUp();
  if (coordinates.drawer) {
    drawerVisible.value = true;
    return;
  }
  x.value = coordinates.x;
  y.value = coordinates.y;
  store.commit("SET_SYSTEM_ICON_POSITION", {
    x: coordinates.x,
    y: coordinates.y,
  });
};
const onVisibleClose = (): void => {
  drawerVisible.value = false;
};

watch(
  () => store.getters.systemPosition,
  (e) => {
    systemPosition.value = e;
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  }
);

onMounted(() => {
  const systemIcon: SystemIcon | null = store.getters.systemIcon;
  if (systemIcon) {
    x.value = systemIcon.x;
    y.value = systemIcon.y;
  }
});
</script>

<style lang="scss">
@import "@/css/theme.scss";

.system-setting {
  height: 50px;
  width: 50px;
  position: fixed;
  color: #fff;
  font-size: 30px;
  background-image: linear-gradient(to bottom right, $--color-primary, $--color-minor);
  border-radius: 10px;
  cursor: pointer;
  z-index: 100;

  .box {
    z-index: 2;
    height: 100%;
    width: 100%;
    position: absolute;
  }

  .icon {
    height: 30px;
    position: absolute;
    z-index: 0;
    left: 10px;
    top: 10px;
  }
}

.system-drawer {
  header {
    margin: 0;

    h3 {
      line-height: 24px;
    }
  }

  .title div {
    font-size: 16px !important;
    display: inline-block;
    position: relative;
    text-align: center;
  }

  .interface-set .row {
    align-items: center;
  }
}
</style>
