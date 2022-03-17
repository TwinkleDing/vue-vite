<template>
    <div class="register">
        <el-form ref="form" :model="form" label-width="0px">
            <el-form-item>
                <el-input
                    v-model="form.account"
                    :placeholder="$t('login.userName')"
                    prefix-icon="el-icon-user"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input
                    v-model="form.id"
                    :placeholder="$t('login.userId')"
                    prefix-icon="el-icon-user-solid"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input
                    type="password"
                    v-model="form.password"
                    :placeholder="$t('login.userPassword')"
                    prefix-icon="el-icon-user-solid"
                ></el-input>
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

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
    name: "register",
    setup(props, context) {
        const { proxy }: any = getCurrentInstance();

        let form = {};
        const register = () => {
            proxy.$message({
                type: "warning",
                message: "暂无服务器，无法注册，请使用游客登陆！",
            });
        };
        const goBack = () => {
            context.emit("register");
        };
        return {
            form,
            register,
            goBack,
        };
    },
});
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
