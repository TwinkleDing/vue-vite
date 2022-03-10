<template>
    <div class="regest">
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
                <el-button type="primary" @click="regest">{{
                    $t("login.sure")
                }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
// import { register } from "@/api/user";

export default {
    name: "Regest",
    data() {
        return {
            form: {},
        };
    },
    methods: {
        regest() {
            // this.$message({
            //   type: 'warning',
            //   message: '暂无服务器，无法注册，请使用游客登陆！'
            // });
            // register({
            //     "user_name": this.form.account,
            //     "user_id": this.form.id,
            //     "user_pwd": this.form.password
            // }).then(res=>{
            //     if(res.code === 200) {
            //         this.$message({
            //             type: "success",
            //             message: res.msg
            //         });
            //         this.goBack();
            //     }else {
            //         this.$message({
            //             type: "error",
            //             message: res.msg
            //         });
            //     }
            // });
        },
        goBack() {
            this.$emit("regest");
        },
    },
};
</script>

<style lang='less' scoped>
.regest {
    .el-input {
        input {
            background: none !important;
            margin-bottom: 20px;
            height: 40px;
        }
    }
}
</style>
