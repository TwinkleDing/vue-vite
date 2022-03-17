<template>
    <div class="login">
        <el-form ref="form" :model="form" label-width="0px">
            <el-form-item>
                <el-input
                    v-model="form.account"
                    :placeholder="$t('login.userId')"
                    :prefix-icon="User"
                />
            </el-form-item>
            <el-form-item>
                <el-input
                    type="password"
                    v-model="form.password"
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

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
import { User, UserFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
export default defineComponent({
    name: "Login",
    components: {
        User,
        UserFilled,
    },
    setup() {
        // 第一步将useRouter函数执行放在顶部，不然执行报错为undefined
        const router = useRouter();
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
                router.push("/index");
            }, 1000);
        };
        return {
            form,
            login,
            register,
            tourists,
            goIndex,
            User,
            UserFilled,
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
