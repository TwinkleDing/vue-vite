<template>
  <div
    v-if="store.getters.tabsType === 1"
    class="router-history router-history-simple scrollbar"
  >
    <div
      :class="['item', route.path === item.path ? 'router-history-active' : '']"
      v-for="(item, index) in routeHistory"
      :key="index"
    >
      <b v-if="route.path === item.path" class="current-router" />
      <span @click="routeGo(item.path)">{{ $t(item.label) }}</span>
      <span v-if="!item.path.includes('home')">
        <el-icon
          :size="16"
          :color="route.path === item.path ? '#fff' : '#495060'"
          @click="closeCurrentRoute(index)"
          ><circle-close
        /></el-icon>
      </span>
    </div>
  </div>
  <div
    v-if="store.getters.tabsType === 2"
    class="router-history router-history-card scrollbar"
  >
    <div
      :class="['item', route.path === item.path ? 'router-history-active' : '']"
      v-for="(item, index) in routeHistory"
      :key="index"
    >
      <span class="router-history-name" @click="routeGo(item.path)">{{
        $t(item.label)
      }}</span>
      <el-icon
        v-if="!item.path.includes('home')"
        :size="16"
        color="#fff"
        @click="closeCurrentRoute(index)"
        ><close
      /></el-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { CircleClose, Close } from "@element-plus/icons-vue";
import { RouterItem } from "@/utils/interface";
const store = useStore();
const route = useRoute();
const router = useRouter();

const routeHistory = computed(() => {
  const history = store.getters.routeHistory;
  const list = diGui(store.getters.routeList, []);
  let showHistory: RouterItem[] = [];
  history.map((item: RouterItem) => {
    list.map((element: RouterItem) => {
      if (element.path === item.path) {
        showHistory.push(item);
      }
    });
  });
  store.commit("SET_ROUTE_HISTORY", showHistory);
  return showHistory;
});
const diGui = (list: RouterItem[], parent: RouterItem[]) => {
  list.map((element: RouterItem) => {
    if (element.children) {
      diGui(element.children, parent);
    } else {
      parent.push(element);
    }
    return element;
  });
  return parent;
};
const routeGo = (path: string) => router.push(path);

const closeCurrentRoute = (index: number) => {
  store.commit("REMOVE_ROUTE_HISTORY_INDEX", index);
};
</script>

<style lang="scss" scoped>
@import "@/css/theme.scss";
.router-history {
  width: 100%;
  position: absolute;
  top: 0;
  box-shadow: 6px 10px 10px 0px rgb(38 38 38 / 8%);
  background: #fff;
  z-index: 100;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  .item {
    display: inline-block;
    padding: 0 6px;
    color: #495060;
    height: 29px;
    line-height: 21px;
    cursor: pointer;
    &:hover {
      color: #fff !important;
      background-image: linear-gradient(to top right, $--color-primary, $--color-minor);
      i {
        color: #fff !important;
        width: 16px;
      }
    }
    span {
      padding: 4px;
      display: inline-block;
      vertical-align: middle;
      i {
        display: inline-block;
        vertical-align: text-top;
      }
    }
  }

  .router-history-active {
    background-image: linear-gradient(to top right, $--color-minor, $--color-primary);
    color: #fff !important;
  }
}
.router-history-simple {
  padding: 6px;
  .item {
    margin: 0 6px;
    border: 1px solid #d8dce5;
  }

  .current-router {
    display: inline-block;
    vertical-align: middle;
    width: 12px;
    height: 12px;
    background-image: linear-gradient(to top right, $--color-primary, $--color-minor);
    border-radius: 50%;
  }
}
.router-history-card {
  padding: 6px 6px 0;
  .item {
    &:hover {
      border-radius: 6px 6px 0 0;
      .router-history-name {
        transition: 0.3s;
        padding-left: 12px;
        padding-right: 12px;
      }
    }
    .router-history-name {
      transition: 0.3s;
      padding-left: 4px;
    }
    i {
      width: 0;
      overflow: hidden;
      padding: 4px;
      vertical-align: middle;
    }
  }
  .router-history-active {
    border-radius: 6px 6px 0 0;
    .router-history-name {
      transition: 0.3s;
      padding-left: 12px;
      padding-right: 12px;
    }
    i {
      transition: 0.3s;
      width: 16px;
    }
  }
}
</style>
