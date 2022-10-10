<template>
    <div class="system-log">
        <div> 系统日志 </div>
        {{ tableData }}
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="create_by" label="创建者" width="180" />
            <el-table-column prop="create_time" label="创建时间" width="180" />
            <el-table-column prop="ip" label="IP地址" />
            <el-table-column prop="log_content" label="日志内容" />
            <el-table-column prop="log_type" label="日志类型" />
            <el-table-column prop="username" label="用户名称" />
        </el-table>
        <div class="pagination">
            <el-pagination
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
    import { systemLogApi } from "@/api/systemApi"

    export default defineComponent({
        name: "SystemLog",
        setup() {
            const tableData: any = reactive([])
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
                    tableData.value = res.data.list
                })
            }
            const handleSizeChange = () => {}
            const handleCurrentChange = () => {}
            onBeforeMount(() => {
                getList()
            })
            return {
                tableData,
                page,
                handleSizeChange,
                handleCurrentChange
            }
        }
    })
</script>

<style lang="scss" scoped>
    .system-log {
        .pagination {
            float: right !important;
        }
    }
</style>
