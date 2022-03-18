<template>
    <div class="login">
        <el-form ref="form" :model="formInline" label-width="0px">
            <el-form-item>
                <el-input
                    v-model="formInline.userId"
                    :placeholder="$t('login.userId')"
                    :prefix-icon="User"
                />
            </el-form-item>
            <el-form-item>
                <el-input
                    type="password"
                    v-model="formInline.password"
                    :placeholder="$t('login.userPassword')"
                    :prefix-icon="UserFilled"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="register">{{
                    $t("login.register")
                }}</el-button>
                <el-button type="primary" @click="login">{{
                    $t("login.login")
                }}</el-button>
                <el-button type="primary" @click="tourists">{{
                    $t("login.touristsLogin")
                }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
import { User, UserFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { userData } from "@/utils/interface";

// 第一步将useRouter函数执行放在顶部，不然执行报错为undefined
const { proxy }: any = getCurrentInstance();
const router = useRouter();
const store = useStore();
const $emit = defineEmits(["register"]);

let formInline: userData = reactive({
    userId: "",
    password: "",
});

const login = () => {
    if (!formInline.userId) {
        proxy.$message({
            type: "error",
            message: "请输入账号",
        });
    } else {
        proxy.$message({
            type: "warning",
            message: "暂无服务器，无法注册，请使用游客登陆！",
        });
    }
};
const register = () => {
    $emit("register");
};
const tourists = () => {
    formInline = {
        userId: "twinkleDing",
        password: "twinkleDing",
        account: "twinkleDing",
        type: "tourist",
    };
    store.commit("SET_USER_INFO", formInline);
    goIndex();
};
const goIndex = () => {
    // 页面跳转
    const loading = proxy.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
    });
    setTimeout(() => {
        loading.close();
        router.push("/index");
    }, 1000);
};
</script>

<style lang='scss' scoped>
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
