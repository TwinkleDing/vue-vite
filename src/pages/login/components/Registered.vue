<template>
    <div class="register">
        <el-form ref="form" :model="formLine" label-width="0px">
            <el-form-item>
                <el-input
                    v-model="formLine.account"
                    :placeholder="$t('login.userName')"
                    :prefix-icon="User"
                />
            </el-form-item>
            <el-form-item>
                <el-input
                    v-model="formLine.userId"
                    :placeholder="$t('login.userId')"
                    :prefix-icon="UserFilled"
                />
            </el-form-item>
            <el-form-item>
                <el-input
                    type="password"
                    v-model="formLine.password"
                    :placeholder="$t('login.userPassword')"
                    :prefix-icon="UserFilled"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="goBack">{{
                    $t("login.back")
                }}</el-button>
                <el-button type="primary" @click="register">{{
                    $t("login.sure")
                }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
import { User, UserFilled } from "@element-plus/icons-vue";
import { userData } from "@/utils/interface";

const { proxy }: any = getCurrentInstance();
const $emit = defineEmits(["register"]);

const formLine: userData = reactive({
    account: "",
    userId: "",
    password: "",
});

const register = () => {
    proxy.$message({
        type: "warning",
        message: "暂无服务器，无法注册，请使用游客登陆！",
    });
};
const goBack = () => {
    $emit("register");
};
</script>

<style lang='scss' scoped>
.register {
    .el-input {
        input {
            background: none !important;
            margin-bottom: 20px;
            height: 40px;
        }
    }
}
</style>
