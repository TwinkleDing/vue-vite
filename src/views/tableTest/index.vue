<template>
  <div class="table-test">
    <div>表格测试</div>
    <div class="setting">
      <div class="left">
        <el-input
          v-model="searchValue"
          clearable
          class="search"
          placeholder="搜索name"
          :suffix-icon="Search"
          @change="search"
        />
        <el-select
          class="select"
          v-model="sort"
          placeholder="排序方式"
          @change="sortChange"
        >
          <el-option label="正序" value="asc" />
          <el-option label="倒序" value="desc" />
        </el-select>
        <el-select
          class="select"
          v-model="quantity"
          placeholder="quantity"
          @change="quantityChange"
        >
          <el-option label="全部" value="" />
          <el-option label="quantity0" value="0" />
          <el-option label="quantity1" value="1" />
        </el-select>
      </div>
      <el-button type="primary" @click="openDialog">新增</el-button>
      <el-button type="primary" @click="tableVolume">批量新增</el-button>
      <el-button type="primary" @click="deleteMessage">批量删除</el-button>
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
      >
        <template #default="scope">
          <div v-if="item.prop === 'state'">
            {{ scope.row.state === 1 ? true : false }}
          </div>
          <div v-else class="text-overflow">
            <template v-if="item.prop === 'content'">
              <el-tooltip
                effect="dark"
                :content="scope.row[item.prop]"
                placement="top-start"
              >
                {{ scope.row[item.prop] }}
              </el-tooltip>
            </template>
            <template v-else>
              {{ scope.row[item.prop] }}
            </template>
          </div>
        </template>
      </el-table-column>
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
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="name" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="quantity" prop="quantity">
          <el-select v-model="form.quantity" placeholder="Activity zone">
            <el-option label="quantity0" :value="0" />
            <el-option label="quantity1" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="state" prop="state">
          <el-switch v-model="form.state" :active-value="1" :inactive-value="0" />
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
<script setup lang="ts">
import {
  onBeforeMount,
  reactive,
  ref,
  Ref,
  getCurrentInstance,
} from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import {
  tableListApi,
  tableAddApi,
  tableVolumeApi,
  tableDeleteApi,
} from "@/api/tableTestApi";
import { Res, Page } from "@/utils/interface";

interface TableTestItem {
  id: string;
  sort: number;
  name: string;
  content: string;
  create_time: string;
  quantity: number;
  state: boolean;
  type: string[];
}

const { proxy }: any = getCurrentInstance();
const column = [
  {
    prop: "sort",
    width: "55",
  },
  {
    prop: "name",
    width: "180",
  },
  {
    prop: "content",
    width: "auto",
  },
  {
    prop: "quantityName",
    width: "120",
  },
  {
    prop: "state",
    width: "100",
  },
  {
    prop: "createTime",
    width: "200",
  },
  {
    prop: "type",
    width: "180",
  },
];
const dialogVisible: Ref<boolean> = ref(false);
const searchValue: Ref<string> = ref("");
const ruleFormRef = ref<FormInstance>();
const tableData: any = reactive({
  list: <TableTestItem[]>[],
});
const page: Page = reactive({
  number: 1,
  size: 10,
  total: 0,
  sizes: [10, 50, 100, 200],
});
const sort: Ref<string> = ref("asc");
const quantity: Ref<string> = ref("");
const form = reactive({
  id: null,
  name: "",
  content: "",
  quantity: 0,
  state: false,
  type: [],
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: "Please input Activity name", trigger: "blur" }],
});
const selectList: any = reactive({
  list: <TableTestItem[]>[],
});

const init = (): void => {
  page.number = 1;
  getList();
};
//获取列表
const getList = (): void => {
  let params = {
    number: page.number,
    size: page.size,
    searchName: searchValue.value,
    sort: sort.value,
    quantity: quantity.value,
  };
  tableListApi(params).then((res: Res) => {
    page.total = res.data.total;
    tableData.list = res.data.list;
  });
};
// 提交新增或修改
const submit = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let params = {
        id: form.id ? form.id : null,
        name: form.name,
        content: form.content,
        quantity: form.quantity,
        state: form.state,
        type: form.type.toString(),
      };
      tableAddApi(params).then((res: Res) => {
        if (res.status === 200) {
          closeDialog();
          // params.id && (page.number = 1)
          ElMessage({
            type: "success",
            message: res.message,
          });
          getList();
        } else {
          ElMessage({
            type: "warning",
            message: res.message,
          });
        }
      });
    }
  });
};
// 重置弹窗内容
const reset = (formEl: FormInstance | undefined): void => {
  if (!formEl) return;
  formEl.resetFields();
};
// 模糊查询
const search = (): void => init();
// 批量新增
const tableVolume = (): void => {
  const Item = {
    name: "",
    content: "",
    quantity: 0,
    state: 0,
    type: "",
  };
  let list = [];
  for (let i = 0; i < 10; i++) {
    let item = { ...Item };
    let a = (Math.random() * 1000).toString();
    item.name = parseInt(a).toString();
    list.push(item);
  }
  tableVolumeApi(list).then((res: Res) => {
    ElMessage({
      type: "success",
      message: res.message,
    });
    init();
  });
};
// 删除
const deleteRow = (id: string): Promise<void> =>
  tableDeleteApi([id]).then((res: Res): void => {
    ElMessage({
      type: "success",
      message: res.message,
    });
    init();
  });
// 批量删除
const deleteMessage = (): void => {
  if (!selectList.list.length) {
    ElMessage({
      type: "warning",
      message: "您还未选择任何一项！",
    });
    return;
  }
  ElMessageBox.confirm("确定要删除这些数据么?", "警告", {
    confirmButtonText: proxy.$t("confirm"),
    cancelButtonText: proxy.$t("cancel"),
    type: "warning",
  }).then(() => {
    const list: string[] = selectList.list.map((item: TableTestItem) => {
      return item.id;
    });
    tableDeleteApi(list).then((res: Res) => {
      ElMessage({
        type: "success",
        message: res.message,
      });
      init();
    });
  });
};
// 更换排序
const sortChange = (): void => init();
const quantityChange = (): void => init();
// 多选
const handleSelectionChange = (val: TableTestItem[]): void => {
  selectList.list = val;
};
// 分页操作
const handleSizeChange = (): void => init();
// 分页切换
const handleCurrentChange = (): void => getList();
// 关闭弹窗
const handleClose = (): void => closeDialog();
// 打开新增或修改弹窗
const openDialog = (row: any): void => {
  dialogVisible.value = true;
  if (row) {
    form.id = row.id;
    form.name = row.name;
    form.state = row.state;
    form.content = row.content;
    form.quantity = row.quantity;
    form.type = row.type ? row.type.split(",") : [];
  }
};
// 关闭弹窗
const closeDialog = (): void => {
  dialogVisible.value = false;
};

onBeforeMount(() => {
  init();
});
</script>

<style lang="scss" scoped>
.table-test {
  .setting {
    text-align: right;
    margin: 12px 0;
  }
  .left {
    float: left;
    .search {
      width: 300px;
    }
    .select {
      width: 100px;
      margin-left: 20px;
    }
  }
}
</style>
