<template>
    <div> 用户列表 </div>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="userId" label="userId" width="180" />
        <el-table-column prop="userName" label="userName" width="180" />
        <el-table-column prop="description" label="description" />
        <el-table-column label="Operations">
            <template>
                <el-button type="primary" size="small" @click="permissionRoute">
                    权限页面设置
                </el-button>
                <el-button type="success" size="small" @click="restoreRoute"> 恢复 </el-button>
                <el-button type="primary" size="small" @click="openPermission">
                    查看权限
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="权限管理" width="600px" :destroy-on-close="true">
        <el-tree :data="tree.value" :props="defaultProps">
            <template #default="{ data }">
                <span class="custom-tree-node">
                    <span>{{ data.label }}</span>
                    <span>
                        <el-switch
                            :disabled="data.name.includes('home')"
                            v-model="data.permission"
                            @change="switchPermission(data)"
                        />
                    </span>
                </span>
            </template>
        </el-tree>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="savePermission">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts">
    import { defineComponent, onMounted, ref, Ref, reactive } from "vue"
    import { ElMessage, ElMessageBox } from "element-plus"
    import { useStore } from "vuex"

    interface DataItem {
        userId: string
        userName: string
        description: string
    }

    export default defineComponent({
        name: "Permission",
        setup() {
            const store = useStore()
            const dialogVisible: Ref<boolean> = ref(false)
            const defaultProps: any = reactive({
                children: "children",
                label: "name"
            })
            const tree: any = reactive([])
            const tableData: DataItem[] = reactive([
                {
                    userId: "TwinkleDing",
                    userName: "TwinkleDing",
                    description: "游客账号"
                }
            ])

            const openPermission = () => {
                dialogVisible.value = true
                store.dispatch("router").then((res: any) => {
                    tree.value = digui(res)
                })
            }
            const digui = (list: any) => {
                return list.map((element: any) => {
                    element.label = element.meta.label
                    element.permission = element.meta.permission
                    if (element.children) {
                        digui(element.children)
                    }
                    return element
                })
            }
            const handleDelete = () => {
                ElMessage({
                    type: "error",
                    message: "仅此一个账号，无法删除"
                })
            }

            const switchPermission = (data: any) => {
                console.log(data.permission)
            }

            const savePermission = () => {
                dialogVisible.value = false
                // setTimeout(() => {
                //     store.commit("SET_ROUTE_LIST", tree.value)
                //     window.location.reload()
                // }, 1000)
            }

            const permissionRoute = async () => {
                let list = [...(await store.dispatch("getRouteList"))]
                if (list.length > 3) {
                    list.splice(1, 1)
                    ElMessage({
                        type: "success",
                        message: "路由设置成功，将刷新页面"
                    })
                    setTimeout(() => {
                        store.commit("SET_ROUTE_LIST", list)
                        window.location.reload()
                    }, 1000)
                } else {
                    ElMessage({
                        type: "error",
                        message: "无法继续设置路由权限"
                    })
                }
            }
            const restoreRoute = async () => {
                let list = [...(await store.dispatch("router"))]
                ElMessage({
                    type: "success",
                    message: "路由恢复成功，将刷新页面"
                })
                setTimeout(() => {
                    store.commit("SET_ROUTE_LIST", list)
                    window.location.reload()
                }, 1000)
            }

            onMounted(() => {})
            return {
                dialogVisible,
                defaultProps,
                tree,
                tableData,
                openPermission,
                switchPermission,
                savePermission,
                permissionRoute,
                restoreRoute
            }
        }
    })
</script>

<style lang="scss" scoped>
    .custom-tree-node {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        font-size: 16px;
    }
</style>
