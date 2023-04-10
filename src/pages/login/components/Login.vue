<template>
  <div class="login">
    <el-form ref="form" label-width="0px">
      <el-form-item>
        <el-input
          v-model="userName"
          :placeholder="$t('login.userName')"
          :prefix-icon="User"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          v-model="password"
          :placeholder="$t('login.userPassword')"
          :prefix-icon="UserFilled"
          @keyup.enter.native="login"
        />
      </el-form-item>
      <el-form-item class="login-handle">
        <el-button type="primary" @click="register">
          {{ $t("login.register") }}
        </el-button>
        <el-button type="primary" @click="login">{{ $t("login.login") }}</el-button>
        <el-button type="primary" @click="tourists">
          {{ $t("login.touristsLogin") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, getCurrentInstance } from "vue";
import { User, UserFilled } from "@element-plus/icons-vue";
import { ElLoading, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { UserInfo } from "@/utils/interface";
import { loginApi } from "@/api/loginApi";

const { proxy }: any = getCurrentInstance();
const router = useRouter();
const store = useStore();
const $emit = defineEmits(["register"]);

const userName: Ref<string> = ref("");
const password: Ref<string> = ref("");

const login = () => {
  if (!userName.value) {
    ElMessage({
      type: "error",
      message: "请输入账号！",
    });
    return;
  }
  if (!password.value) {
    ElMessage({
      type: "error",
      message: "请输入密码！",
    });
    return;
  }
  // ElMessage({
  //     type: "warning",
  //     message: "暂无服务器，无法注册，请使用游客登陆！"
  // })
  const params = {
    username: userName.value,
    password: password.value,
  };
  loginApi(params).then((res: any) => {
    if (res.status === 200) {
      ElMessage({
        type: "success",
        message: res.message,
      });
      const userInfo: UserInfo = {
        userName: userName.value,
        type: "user",
      };
      store.commit("SET_USER_INFO", userInfo);
      goIndex();
    } else {
      ElMessage({
        type: "error",
        message: res.message,
      });
    }
  });
};
const register = () => {
  $emit("register");
};
const tourists = () => {
  const userInfo: UserInfo = {
    userName: "twinkleDing",
    type: "tourist",
  };
  store.commit("SET_USER_INFO", userInfo);
  goIndex();
};
const goIndex = () => {
  // 页面跳转
  ElLoading.service({
    lock: true,
    text: proxy.$t("loading"),
    background: "rgba(0, 0, 0, 0.7)",
  });
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
};
</script>

<style lang="scss" scoped>
.login {
  .el-input {
    input {
      background: transparent;
      margin-bottom: 20px;
      height: 40px;
    }
  }
}
</style>
