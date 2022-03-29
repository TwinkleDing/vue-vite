<template>
    <div> 用户列表 </div>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="userId" label="userId" width="180" />
        <el-table-column prop="userName" label="userName" width="180" />
        <el-table-column prop="description" label="description" />
        <el-table-column label="Operations">
            <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                    >Edit</el-button
                >
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
                    >Delete</el-button
                >
            </template>
        </el-table-column>
    </el-table>
</template>
<script lang="ts" setup>
import { reactive } from "vue"
import { ElMessage } from "element-plus"
import routeList from "@/router/routeList"

interface DataItem {
    userId: string
    userName: string
    description: string
}

const tableData: DataItem[] = reactive([
    {
        userId: "TwinkleDing",
        userName: "TwinkleDing",
        description: "游客账号"
    }
])
const handleEdit = (index: number, row: DataItem) => {
    console.log(index)
    console.log(row)
}
const handleDelete = () => {
    ElMessage({
        type: "error",
        message: "仅此一个账号，无法删除"
    })
}
</script>

<style lang="scss" scoped>
</style>