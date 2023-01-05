<template>
  <el-config-provider :locale="locale">
    <template v-if="NoMenu.includes(route.name)">
      <router-view></router-view>
    </template>
    <template v-else>
      <Dashboard />
    </template>
  </el-config-provider>
</template>
<script setup lang="ts">
import { defineComponent, watch, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { ElConfigProvider } from "element-plus";
import { getStore } from "@/utils/storage";
import zh from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import Dashboard from "@/pages/dashboard/index.vue";

const store = useStore();
const route = useRoute();
let locale: any = ref(zh);
let isMicro: Ref<boolean> = ref(store.getters.isMicro);
const menuList: RouterItem[] = [...store.getters.routeList];
const NoMenu = reactive(["login", "404"]);
watch(
  () => store.getters.language,
  (newVal, oldVal) => {
    locale = newVal === "zh" ? zh : en;
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  }
);

store.commit(
  "SET_SYSTEM_THEME",
  getStore({ name: "systemTheme" })
    ? getStore({ name: "systemTheme" })
    : store.getters.systemTheme
);
store.commit(
  "SET_MENU_THEME",
  getStore({ name: "menuTheme" })
    ? getStore({ name: "menuTheme" })
    : store.getters.menuTheme
);
store.commit(
  "SET_HEADER_THEME",
  getStore({ name: "headerTheme" })
    ? getStore({ name: "headerTheme" })
    : store.getters.headerTheme
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
