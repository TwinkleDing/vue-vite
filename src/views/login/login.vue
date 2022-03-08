<template>
    <div class="login">
        <div class="login-box">
            <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="用户名" prop="name">
                    <el-input
                        v-model="ruleForm.pass"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                    <el-input
                        type="password"
                        v-model="ruleForm.checkPass"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm"
                        >提交</el-button
                    >
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
interface ruleForm {
    name: string;
    pass: string;
}
type $refs = {
    ruleForm: HTMLInputElement;
};
export default {
    // $refs: {
    //     validate: HTMLFormElement,
    // },
    data() {
        var validatePass = (rule: any, value: string, callback: any) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                name: "",
                pass: "",
            },
            rules: {
                pass: [{ validator: validatePass, trigger: "blur" }],
            },
        };
    },
    methods: {
        submitForm() {
            const ruleForm: any = this.$refs.ruleForm;
            ruleForm.validate((valid: any) => {
                if (valid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm() {
            const ruleForm: any = this.$refs.ruleForm;
            ruleForm.resetFields();
        },
    },
};
</script>

<style lang="less" scoped>
.login {
    width: 100%;
    height: 100%;
    &-box {
        width: 500px;
        height: 300px;
        border: 1px solid #ac0;
        border-radius: 20px;
        margin: 0 auto;
        position: relative;
        top: 200px;
    }
}
</style>