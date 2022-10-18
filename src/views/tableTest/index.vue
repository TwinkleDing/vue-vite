<template>
    <div class="table-test">
        <div> 表格测试 </div>
        <div class="setting">
            <el-button type="primary" @click="addNew()">新增</el-button>
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
                :prop="item.prop"
                :width="item.width"
            />
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
                    <el-button type="primary" @click="submit">{{ $t("confirm") }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import { defineComponent, onBeforeMount, reactive, ref, Ref } from "vue"
    import type { FormInstance, FormRules } from "element-plus"
    import { tableListApi } from "@/api/tableTestApi"
    import { Res, Page } from "@/utils/interface"

    interface TableTestItem {
        id: string
        sort: number
        name: string
        content: string
        create_time: string
    }

    export default defineComponent({
        name: "TableTst",
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
                    width: "180"
                },
                {
                    prop: "state",
                    width: "180"
                },
                {
                    prop: "type",
                    width: "180"
                }
            ]
            const dialogVisible: Ref<boolean> = ref(false)
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
                name: "",
                content: "",
                quantity: "",
                state: "",
                type: []
            })
            const rules = reactive<FormRules>({
                name: [
                    { required: true, message: "Please input Activity name", trigger: "blur" },
                    { min: 3, max: 10, message: "Length should be 3 to 5", trigger: "blur" }
                ]
            })

            const getList = () => {
                const params = {
                    number: page.number,
                    size: page.size
                }
                tableListApi(params).then((res: Res) => {
                    console.log(res)
                })
            }
            const addNew = () => {
                dialogVisible.value = true
            }
            const reset = (formEl: FormInstance | undefined) => {
                if (!formEl) return
                formEl.resetFields()
            }
            const submit = () => {}
            const deleteMessage = () => {}
            const handleSelectionChange = () => {}
            const handleSizeChange = () => {
                page.number = 1
                getList()
            }
            const handleCurrentChange = () => getList()
            const handleClose = () => {
                dialogVisible.value = false
            }

            onBeforeMount(() => {
                getList()
            })
            return {
                dialogVisible,
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
                addNew,
                submit,
                handleClose,
                reset
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
    }
</style>
