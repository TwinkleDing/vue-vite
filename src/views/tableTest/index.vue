<template>
    <div class="table-test">
        <div> 表格测试 </div>
        <div class="setting">
            <el-input
                v-model="searchValue"
                clearable
                class="search"
                placeholder="搜索name"
                :suffix-icon="Search"
                @change="search"
            />
            <el-button type="primary" @click="openDialog()">新增</el-button>
            <el-button type="primary" @click="deleteMessage('selected')">批量删除</el-button>
            <el-button type="primary" @click="deleteMessage('all')">全部删除</el-button>
        </div>
        <el-table
            :data="tableData.list"
            stripe
            max-height="684"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" />
            <el-table-column
                v-for="item in column"
                :key="item.prop"
                :label="item.prop"
                :prop="item.prop"
                :width="item.width"
            />
            <el-table-column label="操作" width="200">
                <template #default="scope">
                    <el-button type="primary" @click="openDialog(scope.row)">
                        {{ $t("edit") }}
                    </el-button>
                    <el-popconfirm
                        title="确定删除吗?"
                        :confirm-button-text="$t('confirm')"
                        :cancel-button-text="$t('cancel')"
                        @confirm="deleteRow(scope.row.id)"
                    >
                        <template #reference>
                            <el-button link type="primary">
                                {{ $t("delete") }}
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                align="right"
                v-model:currentPage="page.number"
                v-model:page-size="page.size"
                :page-sizes="page.sizes"
                background
                layout="sizes, prev, pager, next, jumper"
                :total="page.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <el-dialog v-model="dialogVisible" title="Tips" width="600px" :before-close="handleClose">
            <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="80px" status-icon>
                <el-form-item label="name" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="quantity" prop="quantity">
                    <el-select v-model="form.quantity" placeholder="Activity zone">
                        <el-option label="Zone one" :value="0" />
                        <el-option label="Zone two" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="state" prop="state">
                    <el-switch v-model="form.state" />
                </el-form-item>
                <el-form-item label="type" prop="type">
                    <el-checkbox-group v-model="form.type">
                        <el-checkbox label="aaa" name="type" />
                        <el-checkbox label="bbb" name="type" />
                        <el-checkbox label="ccc" name="type" />
                        <el-checkbox label="ddd" name="type" />
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="content" prop="content">
                    <el-input type="textarea" v-model="form.content" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" plain @click="reset(ruleFormRef)">
                        {{ $t("reset") }}
                    </el-button>
                    <el-button @click="dialogVisible = false">{{ $t("cancel") }}</el-button>
                    <el-button type="primary" @click="submit(ruleFormRef)">{{
                        $t("confirm")
                    }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import { defineComponent, onBeforeMount, reactive, ref, Ref } from "vue"
    import type { FormInstance, FormRules } from "element-plus"
    import { ElMessage } from "element-plus"
    import { Search } from "@element-plus/icons-vue"
    import { tableListApi, tableAddApi } from "@/api/tableTestApi"
    import { Res, Page } from "@/utils/interface"

    interface TableTestItem {
        id: string
        sort: number
        name: string
        content: string
        create_time: string
        quantity: number
        state: boolean
        type: Array<string>
    }

    export default defineComponent({
        name: "TableTst",
        components: { Search },
        setup() {
            const column = [
                {
                    prop: "sort",
                    width: "55"
                },
                {
                    prop: "name",
                    width: "180"
                },
                {
                    prop: "content",
                    width: "auto"
                },
                {
                    prop: "quantity",
                    width: "100"
                },
                {
                    prop: "state",
                    width: "100"
                },
                {
                    prop: "type",
                    width: "180"
                }
            ]
            const dialogVisible: Ref<boolean> = ref(false)
            const searchValue: Ref<string> = ref("")
            const ruleFormRef = ref<FormInstance>()
            const tableData: any = reactive({
                list: <TableTestItem[]>[]
            })
            const page: Page = reactive({
                number: 1,
                size: 10,
                total: 0,
                sizes: [10, 50, 100, 200]
            })
            const form = reactive({
                id: null,
                name: "",
                content: "",
                quantity: "",
                state: false,
                type: []
            })
            const rules = reactive<FormRules>({
                name: [{ required: true, message: "Please input Activity name", trigger: "blur" }]
            })

            //获取列表
            const getList = () => {
                const params = {
                    number: page.number,
                    size: page.size,
                    searchName: searchValue.value
                }
                tableListApi(params).then((res: Res) => {
                    page.total = res.data.total
                    tableData.list = res.data.list
                })
            }
            // 重置
            const reset = (formEl: FormInstance | undefined) => {
                if (!formEl) return
                formEl.resetFields()
            }
            // 提交
            const submit = async (formEl: FormInstance | undefined) => {
                if (!formEl) return
                await formEl.validate((valid, fields) => {
                    if (valid) {
                        let params = {
                            id: form.id ? form.id : null,
                            name: form.name,
                            content: form.content,
                            quantity: form.quantity,
                            state: form.state ? 1 : 0,
                            type: form.type.toString()
                        }
                        tableAddApi(params).then((res: Res) => {
                            if (res.status === 200) {
                                page.number = 1
                                getList()
                                closeDialog()
                            } else {
                                ElMessage({
                                    type: "warning",
                                    message: res.data
                                })
                            }
                        })
                    }
                })
            }
            const search = () => {
                page.number = 1
                getList()
            }
            const deleteRow = () => {}
            // 删除
            const deleteMessage = () => {}
            // 多选
            const handleSelectionChange = () => {}
            // 分页操作
            const handleSizeChange = () => {
                page.number = 1
                getList()
            }
            const handleCurrentChange = () => getList()
            // 关闭弹窗
            const handleClose = () => {
                closeDialog()
            }
            const openDialog = (row: any) => {
                dialogVisible.value = true
                if (row) {
                    form.name = row.name
                    form.content = row.content
                    form.id = row.id
                    form.quantity = row.quantity
                    form.state = row.state
                    form.type = row.type ? row.type.split(",") : []
                }
            }
            const closeDialog = () => {
                dialogVisible.value = false
            }

            onBeforeMount(() => {
                getList()
            })
            return {
                dialogVisible,
                searchValue,
                form,
                column,
                tableData,
                page,
                rules,
                ruleFormRef,
                handleSelectionChange,
                handleSizeChange,
                handleCurrentChange,
                deleteMessage,
                openDialog,
                submit,
                handleClose,
                reset,
                deleteRow,
                search,
                Search
            }
        }
    })
</script>

<style lang="scss" scoped>
    .table-test {
        .setting {
            text-align: right;
            margin: 12px 0;
        }
        .search {
            width: 300px;
            float: left;
        }
    }
</style>
