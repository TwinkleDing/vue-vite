<template>
  <div>
    <el-drawer
      v-model="visible"
      size="350px"
      custom-class="system-drawer"
      :direction="direction"
      :before-close="beforeClose"
    >
      <template #title>
        <h3>{{ $t("system") }}</h3>
      </template>
      <div>
        <el-divider class="title">{{ $t("systemTheme") }}</el-divider>
        <theme-color-picker
          :colorList="systemThemeList"
          :def="systemTheme"
          @choose="systemThemeChange"
        />
        <el-divider class="title">{{ $t("headerTheme") }}</el-divider>
        <theme-color-picker
          :colorList="headerThemeList"
          :def="headerTheme"
          @choose="headerThemeChange"
        />
        <template v-if="store.getters.menuPosition">
          <el-divider class="title">{{ $t("menuTheme") }}</el-divider>
          <theme-color-picker
            :colorList="menuThemeList"
            :def="menuTheme"
            @choose="menuThemeChange"
          />
        </template>
      </div>
      <div class="interface-set">
        <el-divider class="title">{{ $t("interfaceSettings") }}</el-divider>
        <el-row class="row">
          <el-col :span="16">{{ $t("systemPosition") }}</el-col>
          <el-col :span="8" align="center">
            <el-switch
              inline-prompt
              :active-text="$t('outSide')"
              :inactive-text="$t('inSide')"
              :active-value="OUT_SIDE"
              :inactive-value="IN_SIDE"
              :inactive-color="store.getters.systemTheme"
              v-model="systemPosition"
              @change="systemPositionChange"
            />
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="tabsShow ? 8 : 16">{{ $t("labelTab") }}</el-col>
          <el-col :span="8" v-if="tabsShow" align="center">
            <el-select
              v-model="tabsType"
              @change="tabsTypeChange"
              placeholder="Select"
              size="small"
            >
              <el-option :label="$t('tabSimple')" :value="1" />
              <el-option :label="$t('tabCard')" :value="2" />
            </el-select>
          </el-col>
          <el-col :span="8" align="center">
            <el-switch v-model="tabsShow" @change="tabsChange" />
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="16">{{ $t("menuPosition") }}</el-col>
          <el-col :span="8" align="center">
            <el-switch
              inline-prompt
              active-text="👈"
              inactive-text="👆"
              :inactive-color="store.getters.systemTheme"
              v-model="menuPosition"
              @change="menuPositionChange"
            />
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="16">{{ $t("language") }}</el-col>
          <el-col :span="8" align="center">
            <el-switch
              inline-prompt
              :active-text="$t('chinese')"
              :inactive-text="$t('english')"
              active-value="zh"
              inactive-value="en"
              :inactive-color="store.getters.systemTheme"
              v-model="language"
              @change="languageChange"
            />
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { getCurrentInstance, ref, Ref, watch } from "vue";
import { useStore } from "vuex";
import {
  APP_PRESET_COLOR_LIST,
  HEADER_PRESET_BG_COLOR_LIST,
  SIDE_BAR_BG_COLOR_LIST,
} from "@/settings/designSetting";
import ThemeColorPicker from "@/components/ThemeColorPicker/index.vue";
import { OUT_SIDE, IN_SIDE } from "@/settings/config";

const { proxy }: any = getCurrentInstance();
const $emit = defineEmits(["visibleClose"]);
const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false,
  },
});
const store = useStore();
const visible: Ref<Boolean> = ref(false);
const tabsShow: Ref<boolean> = ref(store.getters.tabsShow);
const menuPosition: Ref<boolean> = ref(store.getters.menuPosition);
const tabsType: Ref<number> = ref(store.getters.tabsType);
const language: Ref<string> = ref(store.getters.language);
const systemThemeList = APP_PRESET_COLOR_LIST;
const headerThemeList = HEADER_PRESET_BG_COLOR_LIST;
const menuThemeList = SIDE_BAR_BG_COLOR_LIST;
const systemTheme: Ref<string> = ref(store.getters.systemTheme);
const headerTheme: Ref<string> = ref(store.getters.headerTheme);
const menuTheme: Ref<string> = ref(store.getters.menuTheme);
const systemPosition: Ref<string> = ref(store.getters.systemPosition);
const direction: Ref<String> = ref(
  (window as any).config.ArLanuages?.includes(language.value) ? "ltr" : "rtl"
);

// 监听弹窗是否打开
watch(
  () => props.drawerVisible,
  (e) => {
    visible.value = e;
  },
  {
    immediate: true,
    deep: true,
  }
);

const beforeClose = (): void => {
  $emit("visibleClose");
};

const systemThemeChange = (e: string): void => {
  store.commit("SET_SYSTEM_THEME", e);
};
const menuThemeChange = (e: string): void => {
  store.commit("SET_MENU_THEME", e);
};
const headerThemeChange = (e: string): void => {
  store.commit("SET_HEADER_THEME", e);
};
const systemPositionChange = (e: string): void => {
  store.commit("SET_SYSTEM_POSITION", e);
};
const tabsChange = (e: boolean): void => {
  store.commit("SET_TABS_SHOW", e);
};
const tabsTypeChange = (e: number): void => {
  store.commit("SET_TABS_TYPE", e);
};
const menuPositionChange = (e: boolean): void => {
  store.commit("SET_MENU_POSITION", e);
  if (!e) {
    menuThemeChange(menuThemeList[0]);
  }
};
const languageChange = (lang: string): void => {
  const ArLanuages: string[] = (window as any).config.ArLanuages || [];
  proxy.$i18n.locale = lang;
  direction.value = ArLanuages.includes(lang) ? "ltr" : "rtl";
  store.commit("SET_LANGUAGE", lang);
};

// 监听系统设置的位置是否变化
watch(
  () => store.getters.systemPosition,
  (e) => {
    systemPosition.value = e;
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style scoped></style>
