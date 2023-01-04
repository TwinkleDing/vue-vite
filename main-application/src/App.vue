<template>
  <el-config-provider :locale="locale">
  <!-- <div id="frame"></div> -->
    <router-view />
  </el-config-provider>
</template>
<script setup lang="ts">
import { defineComponent, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { ElConfigProvider } from "element-plus";
import { getStore } from "@/utils/storage";
import zh from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import initMicro from "@/micro";
import Apps from "@/micro/apps.ts";

const store = useStore();
const route = useRoute();
let locale: any = ref(zh);
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

watch(
  () => route,
  () => {
    if (route.path.includes("Micro")) {
      store.commit("SET_MICRO", true)
      initMicro(Apps);
    } else {
      store.commit("SET_MICRO", false)
    }
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