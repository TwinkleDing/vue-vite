<template>
  <div class="openai">
    <div class="title">
      <span>OpenAI ChatGPT</span>
      <i>--简单对话</i>
    </div>
    <div class="search-box">
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-change="tabChange"
        tab-position="bottom"
      >
        <el-scrollbar class="res" ref="scrollbarRef" @scroll="scroll">
          <div ref="scrollRef">
            <el-row
              v-for="(item, index) in openaiRes"
              :key="index"
              :class="['res-item', item.type === 'ai' ? 'ai-item' : '']"
            >
              <div>
                <img
                  v-if="item.type === 'ai'"
                  src="./ai.jpg"
                  width="30"
                  height="30"
                  alt=""
                  class="icon"
                />
                <el-icon
                  v-if="item.type === 'user'"
                  class="icon icon-user"
                  :size="30"
                  color="white"
                >
                  <UserFilled />
                </el-icon>
              </div>
              <div>{{ item.text }}</div>
            </el-row>
          </div>
        </el-scrollbar>
        <div class="loading" v-loading="loading"></div>
        <el-tab-pane label="连续对话模式" name="1">
          <el-row class="search">
            <el-col :span="4"> <el-button @click="reset">重置</el-button></el-col>
            <el-col :span="1"> </el-col>
            <el-col :span="14">
              <el-input v-model="searchValue" @keyup.enter.native="search" />
            </el-col>
            <el-col :span="1"> </el-col>
            <el-col :span="4">
              <el-button @click="search" type="primary">对话</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="单次对话模式" name="2">
          <el-row class="search">
            <el-col :span="4"> <el-button @click="reset">重置</el-button></el-col>
            <el-col :span="1"> </el-col>
            <el-col :span="14">
              <el-input v-model="searchValue" @keyup.enter.native="search" />
            </el-col>
            <el-col :span="1"> </el-col>
            <el-col :span="4">
              <el-button @click="search" type="primary">对话</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, Ref, nextTick, onMounted } from "vue";
import { Configuration, OpenAIApi } from "openai";
import { UserFilled } from "@element-plus/icons-vue";
import { ElScrollbar, ElMessage, ElMessageBox } from "element-plus";
import { setStore, getStore } from "@/utils/storage";

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const scrollRef = ref<HTMLDivElement>();
const searchValue: Ref<string> = ref("");
const activeName: Ref<string> = ref("1");
const loading: Ref<boolean> = ref(false);
const openaiRes: Ref<any> = ref([]);
const ans: Ref<string> = ref("");
const value: Ref<number> = ref(0);
const configuration = new Configuration({
  apiKey: getStore({ name: "apiKey" }),
});
const openai = new OpenAIApi(configuration);

const tabChange = (): void => {
  reset();
};
const scroll = (e: any) => {
  value.value = e.scrollTop;
};
const search = (): void => {
  !loading.value && searchOpenAi();
};
const reset = (): void => {
  ans.value = "";
  openaiRes.value = [];
};
const delStartLine = (text: string): string => {
  if (text.startsWith("\n")) {
    return delStartLine(text.substring(1, text.length));
  }
  return text;
};
const scrollToBottom = async (): Promise<void> => {
  await nextTick();
  scrollbarRef.value!.setScrollTop(scrollRef.value!.clientHeight);
};

const searchOpenAi = async (): Promise<void> => {
  let prompt = ans.value + "\n Human:" + searchValue.value;
  if (!ans.value || searchValue.value === "2") {
    prompt = "Human:" + searchValue.value;
  }
  loading.value = true;
  const res: any = await openai.createCompletion(
    {
      model: "text-davinci-003",
      prompt,
      temperature: 0.1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },
    {
      headers: {
        "Example-Header": "example",
        "User-Agent": "'",
      },
    }
  );
  loading.value = false;
  if (res.error) {
    ElMessage({
      type: "error",
      message: res.error,
    });
  } else {
    ans.value = prompt + res.choices[0].text;
    let text = res.choices[0].text;
    text = delStartLine(text);
    openaiRes.value.push({ type: "user", text: searchValue.value });
    openaiRes.value.push({ type: "ai", text });
    searchValue.value = "";
    scrollToBottom();
  }
};

onMounted(() => {
  if (!getStore({ name: "apiKey" })) {
    ElMessageBox.prompt("请输入api-key", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputErrorMessage: "请输入api-key",
    })
      .then(({ value }) => {
        setStore({
          name: "apiKey",
          content: value,
        });
        window.location.reload();
      })
      .catch(() => {});
  }
});
</script>

<style lang="scss">
@import "@/css/theme.scss";
html,
body,
#app {
  min-width: 100%;
}
.openai {
  .title {
    height: 40px;
    font-size: 22px;
    line-height: 40px;
    padding: 10px 12px;
    box-sizing: border-box;
    i {
      font-size: 14px;
      background-image: linear-gradient(
        to bottom right,
        $--color-primary,
        $--color-minor
      );
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .search-box {
    width: 100%;
    height: calc(100vh - 40px);
    padding: 12px;
    box-sizing: border-box;
    white-space: pre-wrap;
  }
  .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-tabs__header {
      height: 40px;
    }
    .el-tabs__content {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0;
      .res {
        flex: 1;
        overflow: auto;
        padding-bottom: 24px;
        &-item {
          display: flex;
          padding: 6px 12px;
          flex-wrap: nowrap;
          .icon {
            margin-right: 6px;
          }
        }
        .ai-item {
          background: #f7f7f8;
          border: 1px solid #e5e5e5;
        }
      }
      .el-tab-pane {
        height: 34px;
        padding: 0 12px;
      }
    }
  }
  .icon-user {
    background: $--color-primary;
    border-radius: 2px;
  }
  .loading {
    height: 100px;
    width: 100%;
    position: absolute;
    bottom: 0;
  }
}
.el-message-box {
  width: 90%;
}
</style>
