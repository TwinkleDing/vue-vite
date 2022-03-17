<template>
    <div class="login">
        <el-form ref="form" :model="form" label-width="0px">
            <el-form-item>
                <el-input
                    v-model="form.account"
                    :placeholder="$t('login.userId')"
                    prefix-icon="el-icon-user"
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
                <el-button :icon="Search" type="primary" @click="register">{{
                    $t("login.register")
                }}</el-button>
                <el-button type="primary" @click="login">{{
                    $t("login.login")
                }}</el-button>
                <el-button type="primary" @click="tourists">{{
                    $t("login.touristsLogin")
                }}</el-button>
                <el-button type="primary" @click="color">设置颜色</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
import { Search } from "@element-plus/icons-vue";
export default defineComponent({
    name: "Login",
    setup() {
        const { proxy }: any = getCurrentInstance();

        let form = {
            account: "",
            password: "",
        };
        const login = () => {
            if (!form.account) {
                proxy.$message({
                    type: "error",
                    message: "请输入账号",
                });
            }
        };
        const register = () => {
            proxy.$emit("register");
        };
        const tourists = () => {
            console.log(this);
            let data = {
                account: "twinkeDing",
                password: "twinkeDing",
                user_name: "twinkeDing",
                type: "tourist",
            };
            form = data;
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
                proxy.$router.push({ path: "/index" });
            }, 1000);
        };
        const color = () => {
            proxy.$store.commit("SET_THEME_COLOR", "#536DF3")
        };
        return {
            form,
            login,
            register,
            tourists,
            goIndex,
            color,
        };
    },
});
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
