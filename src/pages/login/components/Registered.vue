<template>
    <div class="register">
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
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="goBack">{{ $t("login.back") }}</el-button>
                <el-button type="primary" @click="register">{{ $t("login.sure") }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
    import { ref, Ref } from "vue"
    import { User, UserFilled } from "@element-plus/icons-vue"
    import { ElMessage } from "element-plus"
    import { registerApi } from "@/api/loginApi"

    const $emit = defineEmits(["register"])

    const userName: Ref<string> = ref("")
    const password: Ref<string> = ref("")

    const register = () => {
        const params = {
            username: userName.value,
            password: password.value
        }
        registerApi(params).then((res: any) => {
            if (res.status === "200") {
                ElMessage({
                    type: "success",
                    message: res.message
                })
            } else {
                ElMessage({
                    type: "error",
                    message: res.message
                })
            }
        })
    }
    const goBack = () => {
        $emit("register")
    }
</script>

<style lang="scss" scoped>
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
