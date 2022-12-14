<template>
  <div class="undone">
    <div
      class="checkbox"
      v-for="(item, index) in listData"
      :key="index"
      @click="checkboxClick(item)"
    >
      <span>{{ item.title }}</span>
      <el-checkbox v-model="item.status" size="large"> </el-checkbox>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, onMounted, ref, Ref, reactive, getCurrentInstance } from "vue";

interface ListData {
  title: string;
  status: boolean;
}

const listData: Array<ListData> = reactive([
  {
    title: "star this repository",
    status: false,
  },
  {
    title: "fork this repository",
    status: false,
  },
  {
    title: "follow author",
    status: false,
  },
  {
    title: "vue3",
    status: true,
  },
  {
    title: "ts",
    status: true,
  },
  {
    title: "element-plus",
    status: true,
  },
  {
    title: "axios",
    status: true,
  },
  {
    title: "vite",
    status: true,
  },
]);

const checkboxClick = (item: ListData) => {
  item.status = !item.status;
};
</script>

<style lang="scss" scoped>
.undone {
  .checkbox {
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    color: var(--systemThemeColor);
    &:hover {
      background: var(--el-color-primary-light-9);
    }
  }
}
</style>
