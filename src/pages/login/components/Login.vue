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

<script>
// import { loginByUsername } from "@/api/user";

export default {
    name: "Login",
    data() {
        return {
            form: {
                account: "",
                password: "",
            },
        };
    },
    methods: {
        login() {
            if (!this.form.account) {
                this.$message({
                    type: "error",
                    message: "请输入账号",
                });
            } else {
                let params = {
                    user_id: this.form.account,
                    user_pwd: this.form.password,
                };
            }
        },
        register() {
            this.$emit("register");
        },
        tourists() {
            let data = {
                account: "twinkeDing",
                password: "twinkeDing",
                user_name: "twinkeDing",
                type: "tourist",
            };
            this.$store.dispatch("userInfo", data);
            this.$store.dispatch("route", data.type);
            this.form = data;
            this.goIndex();
        },
        goIndex() {
            // 页面跳转
            const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            setTimeout(() => {
                loading.close();
                this.$router.push({ path: "/index" });
            }, 1000);
        },
    },
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
