<template>
    <div class="system-log">
        <div> 系统日志 </div>
        <div class="setting">
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
            <el-table-column prop="createBy" label="创建者" width="180" />
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column prop="ip" label="IP地址" width="100" />
            <el-table-column prop="logType" label="日志类型" width="100" />
            <el-table-column prop="logContent" label="日志内容" />
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
    import { defineComponent, onBeforeMount, reactive, getCurrentInstance } from "vue"
    import { systemLogApi, deleteLogApi, deleteSelectLogApi, deleteAllApi } from "@/api/systemApi"
    import { ElMessage, ElMessageBox } from "element-plus"
    import { Res, Page } from "@/utils/interface"

    interface SystemLogItem {
        id: string
        create_by: string
        create_time: string
        ip: string
        log_type: string
        log_content: string
    }

    export default defineComponent({
        name: "SystemLog",
        setup() {
            const { proxy }: any = getCurrentInstance()
            const tableData: any = reactive({
                list: <SystemLogItem[]>[]
            })
            const page: Page = reactive({
                number: 1,
                size: 10,
                total: 0,
                sizes: [10, 50, 100, 200]
            })
            const selectList: any = reactive({
                list: <SystemLogItem[]>[]
            })

            const getList = () => {
                const params = {
                    number: page.number,
                    size: page.size
                }
                systemLogApi(params).then((res: Res) => {
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
                deleteLogApi(id).then((res: Res) => {
                    if (res.status === 200) {
                        page.number = 1
                        getList()
                    }
                })
            }
            const deleteAll = () => {
                deleteAllApi().then((res: Res) => {
                    if (res.status === 200) {
                        page.number = 1
                        getList()
                    } else {
                        ElMessage({
                            type: "warning",
                            message: res.data
                        })
                    }
                })
            }
            const deleteSelect = () => {
                const list: Array<String> = selectList.list.map((item: SystemLogItem) => {
                    return item.id
                })
                const params = list
                deleteSelectLogApi(params).then((res: Res) => {
                    if (res.status === 200) {
                        page.number = 1
                        getList()
                    } else {
                        ElMessage({
                            type: "warning",
                            message: res.data
                        })
                    }
                })
            }
            const deleteMessage = (type: string) => {
                if (type === "selected" && selectList.list.length === 0) {
                    ElMessage({
                        type: "warning",
                        message: "您还未选择任何一项！"
                    })
                    return
                }
                ElMessageBox.confirm("确定要删除这些数据么?", "Warning", {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                }).then(() => {
                    if (type === "selected") {
                        deleteSelect()
                    } else {
                        deleteAll()
                    }
                })
            }
            const handleSelectionChange = (val: SystemLogItem[]) => {
                selectList.list = val
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
                deleteRow,
                handleSelectionChange,
                deleteMessage
            }
        }
    })
</script>

<style lang="scss" scoped>
    .system-log {
        .setting {
            text-align: right;
            margin: 12px 0;
        }
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
