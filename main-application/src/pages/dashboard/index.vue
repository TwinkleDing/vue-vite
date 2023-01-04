<template>
  <div class="pages">
    <header-top>
      <template v-if="!store.getters.menuPosition" #menu>
        <left-menu :menuList="menuList" />
      </template>
    </header-top>
    <div class="pages-content">
      <div v-if="store.getters.menuPosition" class="pages-left">
        <left-menu :menuList="menuList" />
      </div>
      <div class="pages-right">
        <tabs v-if="store.getters.tabsShow" />
        <div
          :class="['right-content', !store.getters.tabsShow || 'mg-t-40', 'scrollbar']"
        >
          <div v-show="isMicro" id="frame"></div>
          <div v-show="!isMicro" id="main">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
    <system-icon />
  </div>
</template>
<script setup lang="ts">
import { defineComponent, Ref, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import LeftMenu from "./components/LeftMenu.vue";
import { RouterItem } from "@/utils/interface";
import SystemIcon from "./components/SystemIcon.vue";
import HeaderTop from "./components/HeaderTop.vue";
import Tabs from "./components/Tabs.vue";
import initMicro from "@/micro";
import Apps from "@/micro/apps.ts";

const store = useStore();
const route = useRoute();
const isMicro: Ref<boolean> = ref(store.getters.isMicro);
const menuList: RouterItem[] = [...store.getters.routeList];

watch(
  () => route,
  () => {
    if (route.path.includes("Micro")) {
      isMicro.value = true;
      store.commit("SET_MICRO", true);
      initMicro(Apps);
    } else {
      isMicro.value = false;
      store.commit("SET_MICRO", false);
    }
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  }
);
</script>

<style lang="scss" scoped>
.pages {
  height: 100%;
  width: 100%;
  min-width: 1200px;
  &-content {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
  }
  &-left {
    height: 100%;
    width: 200px;
    min-width: 200px;
    box-shadow: 6px 0px 10px 0px rgb(38 38 38 / 8%);
  }
  &-right {
    height: 100%;
    flex: 1;
    overflow: hidden;
    position: relative;
    .right-content {
      padding: 24px;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      width: 100%;
      height: calc(100% - 40px);
      overflow: auto;
    }
  }
}
</style>
