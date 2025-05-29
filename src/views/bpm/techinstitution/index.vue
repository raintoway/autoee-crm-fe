<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <!--      <el-form-item label="申请人" prop="userId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.userId"-->
      <!--          placeholder="请输入申请人"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="制度编号" prop="institutionCode">
        <el-input
          v-model="queryParams.institutionCode"
          placeholder="请输入制度编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="制度名称" prop="institutionName">
        <el-input
          v-model="queryParams.institutionName"
          placeholder="请输入制度名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="制度年度" prop="institutionYear">
        <el-input
          v-model="queryParams.institutionYear"
          placeholder="请输入制度年度"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="制度等级" prop="institutionLevel">
        <el-select
          v-model="queryParams.institutionLevel"
          placeholder="请选择制度等级"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.INSTITUTION_LEVEL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="技术领域" prop="techField">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.techField"-->
      <!--          placeholder="请输入技术领域"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="批准单位" prop="approvalUnit">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.approvalUnit"-->
      <!--          placeholder="请输入批准单位"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="制度文号" prop="documentNumber">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.documentNumber"-->
      <!--          placeholder="请输入制度文号"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="发布时间" prop="publishTime">-->
      <!--        <el-date-picker-->
      <!--          v-model="queryParams.publishTime"-->
      <!--          value-format="YYYY-MM-DD HH:mm:ss"-->
      <!--          type="daterange"-->
      <!--          start-placeholder="开始日期"-->
      <!--          end-placeholder="结束日期"-->
      <!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
      <!--          class="!w-220px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="执行时间" prop="executeTime">-->
      <!--        <el-date-picker-->
      <!--          v-model="queryParams.executeTime"-->
      <!--          value-format="YYYY-MM-DD HH:mm:ss"-->
      <!--          type="daterange"-->
      <!--          start-placeholder="开始日期"-->
      <!--          end-placeholder="结束日期"-->
      <!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
      <!--          class="!w-220px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="制度密级" prop="securityLevel">
        <el-select
          v-model="queryParams.securityLevel"
          placeholder="请选择制度密级"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.SECURITY_LEVEL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择审批结果"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="创建时间" prop="createTime">-->
      <!--        <el-date-picker-->
      <!--          v-model="queryParams.createTime"-->
      <!--          value-format="YYYY-MM-DD HH:mm:ss"-->
      <!--          type="daterange"-->
      <!--          start-placeholder="开始日期"-->
      <!--          end-placeholder="结束日期"-->
      <!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
      <!--          class="!w-220px"-->
      <!--        />-->
      <!--      </el-form-item>-->

    </el-form>
    <el-row :gutter="10"  style="padding:  10px 10px 0px 10px">
      <el-col v-if="true" :span="1.5">
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['bpm:tech-institution:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
      </el-col>
      <el-col v-if="true" :span="1.5">
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['bpm:tech-institution:export']"
        >
          <Icon icon="ep:download" class="mr-5px"/>
          导出
        </el-button>
      </el-col>

      <el-col :span="0.5">
        <el-divider direction="vertical"/>
      </el-col>
      <el-col v-if="true" :span="1.5">
        <el-button @click="handleQuery"  type="primary">
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
      </el-col>
      <el-col v-if="true" :span="1.5">
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
      </el-col>
    </el-row>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键" align="center" prop="id"/>
      <!--      <el-table-column label="申请人" align="center" prop="userId"/>-->
      <el-table-column label="制度编号" align="center" prop="institutionCode"/>
      <el-table-column label="制度名称" align="center" prop="institutionName"/>
      <el-table-column label="制度年度" align="center" prop="institutionYear"/>
      <el-table-column label="制度等级" align="center" prop="institutionLevel">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INSTITUTION_LEVEL" :value="scope.row.institutionLevel"/>
        </template>
      </el-table-column>
      <el-table-column label="技术领域" align="center" prop="techField"/>
      <!--      <el-table-column label="批准单位" align="center" prop="approvalUnit"/>-->
      <!--      <el-table-column label="制度文号" align="center" prop="documentNumber"/>-->
      <!--      <el-table-column-->
      <!--        label="发布时间"-->
      <!--        align="center"-->
      <!--        prop="publishTime"-->
      <!--        :formatter="dateFormatter"-->
      <!--        width="180px"-->
      <!--      />-->
      <!--      <el-table-column-->
      <!--        label="执行时间"-->
      <!--        align="center"-->
      <!--        prop="executeTime"-->
      <!--        :formatter="dateFormatter"-->
      <!--        width="180px"-->
      <!--      />-->
      <el-table-column label="制度密级" align="center" prop="securityLevel">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SECURITY_LEVEL" :value="scope.row.securityLevel"/>
        </template>
      </el-table-column>
      <!--      <el-table-column label="PDF/扫描件附件" align="center" prop="attachment"/>-->
      <el-table-column align="center" label="审批状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="180px" fixed="right">
        <template #default="scope">
          <el-button
            v-if="scope.row.status ===-1 || scope.row.status ===3|| scope.row.status ===4"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['bpm:tech-institution:update']"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.status ===-1 "
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['bpm:tech-institution:delete']"
          >
            删除
          </el-button>
          <el-button
            v-hasPermi="['bpm:tech-institution:query']"
            link
            type="primary"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-if="scope.row.status != -1 "
            v-hasPermi="['bpm:tech-institution:create']"
            link
            type="primary"
            @click="handleProcessDetail(scope.row)"
          >
            进度
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

  <!-- 表单弹窗：添加/修改 -->
  <TechInstitutionForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {TechInstitutionApi, TechInstitutionVO} from '@/api/bpm/techinstitution'
import TechInstitutionForm from './TechInstitutionForm.vue'

const router = useRouter() // 路由

/** 科技制度属性管理 列表 */
defineOptions({name: 'TechInstitution'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<TechInstitutionVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  institutionCode: undefined,
  institutionName: undefined,
  institutionYear: undefined,
  institutionLevel: undefined,
  techField: undefined,
  approvalUnit: undefined,
  documentNumber: undefined,
  publishTime: [],
  executeTime: [],
  securityLevel: undefined,
  status: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TechInstitutionApi.getTechInstitutionPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await TechInstitutionApi.deleteTechInstitution(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}

/** 详情操作 */
const handleDetail = (row: LeaveApi.LeaveVO) => {
  // 需要定义const router = useRouter() // 路由
  router.push({
    name: 'techinstitutionDetail',
    query: {
      id: row.id
    }
  })
}


/** 审批进度 */
const handleProcessDetail = (row) => {
  // 需要定义const router = useRouter() // 路由
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstanceId
    }
  })
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await TechInstitutionApi.exportTechInstitution(queryParams)
    download.excel(data, '科技制度属性管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
