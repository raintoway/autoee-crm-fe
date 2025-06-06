<template>
  <doc-alert title="流程发起、取消、重新发起" url="https://doc.iocoder.cn/bpm/process-instance/" />

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入流程名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
      </el-form-item>

      <!-- TODO @ tuituji：style 可以使用 unocss -->
      <el-form-item label="" prop="category" :style="{ position: 'absolute', right: '300px' }">
        <!-- TODO @tuituji：应该选择好分类，就触发搜索啦。 RE:done & to check-->
        <el-select
          v-model="queryParams.category"
          placeholder="请选择流程分类"
          clearable
          class="!w-155px"
          @change="handleQuery"
        >
          <el-option
            v-for="category in categoryList"
            :key="category.code"
            :label="category.name"
            :value="category.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="status" :style="{ position: 'absolute', right: '130px' }">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择流程状态"
          clearable
          class="!w-155px"
          @change="handleQuery"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <!-- 高级筛选 -->
      <!-- TODO @ tuituji：style 可以使用 unocss -->
      <el-form-item :style="{ position: 'absolute', right: '0px' }">
        <el-popover
          :visible="showPopover"
          persistent
          :width="400"
          :show-arrow="false"
          placement="bottom-end"
        >
          <template #reference>
            <el-button @click="showPopover = !showPopover">
              <Icon icon="ep:plus" class="mr-5px" />高级筛选
            </el-button>
          </template>
          <el-form-item label="流程发起人" class="bold-label" label-position="top" prop="category">
            <el-select
              v-model="queryParams.category"
              placeholder="请选择流程发起人"
              clearable
              class="!w-390px"
            >
              <el-option
                v-for="category in categoryList"
                :key="category.code"
                :label="category.name"
                :value="category.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="所属流程"
            class="bold-label"
            label-position="top"
            prop="processDefinitionKey"
          >
            <el-input
              v-model="queryParams.processDefinitionKey"
              placeholder="请输入流程定义的标识"
              clearable
              @keyup.enter="handleQuery"
              class="!w-390px"
            />
          </el-form-item>
          <el-form-item label="发起时间" class="bold-label" label-position="top" prop="createTime">
            <el-date-picker
              v-model="queryParams.createTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
              class="!w-240px"
            />
          </el-form-item>
          <!-- TODO tuituiji：参考钉钉，1）按照清空、取消、确认排序。2）右对齐。3）确认增加 primary -->
          <el-form-item class="bold-label" label-position="top">
            <el-button @click="handleQuery"> 确认</el-button>
            <el-button @click="showPopover = false"> 取消</el-button>
            <el-button @click="resetQuery"> 清空</el-button>
          </el-form-item>
        </el-popover>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="流程名称" align="center" prop="name" min-width="200px" fixed="left" />
      <el-table-column label="摘要" prop="summary" min-width="180" fixed="left">
        <template #default="scope">
          <div class="flex flex-col" v-if="scope.row.summary && scope.row.summary.length > 0">
            <div v-for="(item, index) in scope.row.summary" :key="index">
              <el-text type="info"> {{ item.key }} : {{ item.value }} </el-text>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="流程分类"
        align="center"
        prop="categoryName"
        min-width="100"
        fixed="left"
      />
      <!-- TODO 摘要 -->
      <!-- TODO tuituiji：参考钉钉；1）审批中时，展示审批任务；2）非审批中，展示状态 -->
      <el-table-column label="流程状态" prop="status" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="发起时间"
        align="center"
        prop="startTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        width="180"
        :formatter="dateFormatter"
      />
      <!--<el-table-column align="center" label="耗时" prop="durationInMillis" width="160">
        <template #default="scope">
          {{ scope.row.durationInMillis > 0 ? formatPast2(scope.row.durationInMillis) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="当前审批任务" align="center" prop="tasks" min-width="120px">
        <template #default="scope">
          <el-button type="primary" v-for="task in scope.row.tasks" :key="task.id" link>
            <span>{{ task.name }}</span>
          </el-button>
        </template>
      </el-table-column>
      -->
      <el-table-column label="操作" align="center" fixed="right" width="180">
        <template #default="scope">
          <el-button
            link
            type="primary"
            v-hasPermi="['bpm:process-instance:cancel']"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            v-if="scope.row.status === 1"
            v-hasPermi="['bpm:process-instance:query']"
            @click="handleCancel(scope.row)"
          >
            取消
          </el-button>
          <el-button link type="primary" v-else @click="handleCreate(scope.row)">
            重新发起
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>
<script lang="ts" setup>
// TODO @tuituji：List 改成 <Icon icon="ep:plus" class="mr-5px" /> 类似这种组件哈。 RE:done & to check
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { ElMessageBox } from 'element-plus'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import { CategoryApi, CategoryVO } from '@/api/bpm/category'
import { ProcessInstanceVO } from '@/api/bpm/processInstance'
import * as DefinitionApi from '@/api/bpm/definition'

defineOptions({ name: 'BpmProcessInstanceMy' })

const router = useRouter() // 路由
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  processDefinitionKey: undefined,
  category: undefined,
  status: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const categoryList = ref<CategoryVO[]>([]) // 流程分类列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProcessInstanceApi.getProcessInstanceMyPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const showPopover = ref(false)

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 发起流程操作 **/
const handleCreate = async (row?: ProcessInstanceVO) => {
  // 如果是【业务表单】，不支持重新发起
  if (row?.id) {
    const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
      row.processDefinitionId
    )
    if (processDefinitionDetail.formType === 20) {
      message.error('重新发起流程失败，原因：该流程使用业务表单，不支持重新发起')
      return
    }
  }
  // 跳转发起流程界面
  await router.push({
    name: 'BpmProcessInstanceCreate',
    query: { processInstanceId: row?.id }
  })
}

/** 查看详情 */
const handleDetail = (row: ProcessInstanceVO) => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.id
    }
  })
}

/** 取消按钮操作 */
const handleCancel = async (row: ProcessInstanceVO) => {
  // 二次确认
  const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
    inputErrorMessage: '取消原因不能为空'
  })
  // 发起取消
  await ProcessInstanceApi.cancelProcessInstanceByStartUser(row.id, value)
  message.success('取消成功')
  // 刷新列表
  await getList()
}

/** 激活时 **/
onActivated(() => {
  getList()
})

/** 初始化 **/
onMounted(async () => {
  await getList()
  categoryList.value = await CategoryApi.getCategorySimpleList()
})
</script>
<style>
.bold-label .el-form-item__label {
  font-weight: bold; /* 将字体加粗 */
}
</style>
