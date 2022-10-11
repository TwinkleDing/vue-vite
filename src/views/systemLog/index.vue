<template>
    <div class="system-log">
        <div> 系统日志 </div>
        <el-table :data="tableData.list" stripe max-height="740">
            <el-table-column prop="create_by" label="创建者" width="180" />
            <el-table-column prop="create_time" label="创建时间" width="180" />
            <el-table-column prop="ip" label="IP地址" width="100" />
            <el-table-column prop="log_type" label="日志类型" width="100" />
            <el-table-column prop="log_content" label="日志内容" />
            <el-table-column label="操作" width="100">
                <template #default="scope">
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
    </div>
</template>
<script lang="ts">
    import { defineComponent, onBeforeMount, reactive } from "vue"
    import { systemLogApi, deleteLogApi } from "@/api/systemApi"
    import { ElMessage, ElMessageBox } from "element-plus"

    export default defineComponent({
        name: "SystemLog",
        setup() {
            let tableData: any = reactive({
                list: []
            })
            const page: any = reactive({
                number: 1,
                size: 10,
                total: 0,
                sizes: [10, 50, 100, 200]
            })
            const getList = () => {
                const params = {
                    number: page.number,
                    size: page.size
                }
                systemLogApi(params).then((res: any) => {
                    console.log(res)
                    page.total = res.data.total
                    tableData.list = res.data.list
                })
            }
            const handleSizeChange = () => {
                page.number = 1
                getList()
            }
            const handleCurrentChange = () => getList()
            const deleteRow = (id: string) => {
                deleteLogApi(id).then((res: any) => {
                    if (res.status === 200) {
                        page.number = 1
                        getList()
                    }
                })
            }
            const deleteAll = () => {
                ElMessageBox.confirm(
                    "proxy will permanently delete the file. Continue?",
                    "Warning",
                    {
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        type: "warning"
                    }
                )
                    .then(() => {
                        ElMessage({
                            type: "success",
                            message: "Delete completed"
                        })
                    })
                    .catch(() => {
                        ElMessage({
                            type: "info",
                            message: "Delete canceled"
                        })
                    })
            }
            onBeforeMount(() => {
                getList()
            })
            return {
                tableData,
                page,
                getList,
                handleSizeChange,
                handleCurrentChange,
                deleteRow
            }
        }
    })
</script>

<style lang="scss" scoped>
    .system-log {
        .pagination {
            margin-top: 24px;
            position: relative;
            height: 36px;
            .el-pagination {
                position: absolute;
                right: 0;
            }
        }
    }
</style>
