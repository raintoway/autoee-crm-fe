<template>
  <el-descriptions :column="2" border :label-width="150" style="width: 90%;">
    <!-- 基础信息 -->
<!--    <el-descriptions-item label="申请人">{{ formData.userId }}</el-descriptions-item>-->
    <el-descriptions-item label="制度编号">{{ formData.institutionCode }}</el-descriptions-item>
    <el-descriptions-item label="制度名称">{{ formData.institutionName }}</el-descriptions-item>
    <el-descriptions-item label="制度年度">{{ formData.institutionYear }}</el-descriptions-item>

    <!-- 下拉选择字段 -->
    <el-descriptions-item label="制度等级">
      <dict-tag :type="DICT_TYPE.INSTITUTION_LEVEL" :value="formData.institutionLevel"/>
    </el-descriptions-item>
    <el-descriptions-item label="技术领域">{{ formData.techField }}</el-descriptions-item>
    <el-descriptions-item label="批准单位">{{ formData.approvalUnit }}</el-descriptions-item>
    <el-descriptions-item label="制度文号">{{ formData.documentNumber }}</el-descriptions-item>

    <!-- 日期字段 -->
    <el-descriptions-item label="发布时间">
      {{ formatDate(formData.publishTime, 'YYYY-MM-DD') }}
    </el-descriptions-item>
    <el-descriptions-item label="执行时间">
      {{ formatDate(formData.executeTime, 'YYYY-MM-DD') }}
    </el-descriptions-item>

    <!-- 密级与附件 -->
    <el-descriptions-item label="制度密级">
      <dict-tag :type="DICT_TYPE.SECURITY_LEVEL" :value="formData.securityLevel"/>
    </el-descriptions-item>
    <el-descriptions-item label="PDF/扫描件附件">
        <UploadFile v-model="formData.attachment"   disabled/>
    </el-descriptions-item>
  </el-descriptions>
</template>
<script setup lang="ts">
import { formatDate } from '@/utils/formatTime'
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {TechInstitutionApi, TechInstitutionVO} from '@/api/bpm/techinstitution'
import {propTypes} from '@/utils/propTypes'

/** 科技制度属性管理 表单 */
defineOptions({name: 'TechInstitutionForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const {query} = useRoute() // 查询参数

// 通过props.id获取业务数据的id，用于查询业务详细内容
const props = defineProps({
  id: propTypes.number.def(undefined)
})
const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号

console.log("queryId=", queryId)
console.log("props.id=", props.id)
const formData = ref({
  id: undefined,
  userId: undefined,
  institutionCode: undefined,
  institutionName: undefined,
  institutionYear: undefined,
  institutionLevel: undefined,
  techField: undefined,
  approvalUnit: undefined,
  documentNumber: undefined,
  publishTime: undefined,
  executeTime: undefined,
  securityLevel: undefined,
  attachment: undefined
})

const formRef = ref() // 表单 Ref


/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    userId: undefined,
    institutionCode: undefined,
    institutionName: undefined,
    institutionYear: undefined,
    institutionLevel: undefined,
    techField: undefined,
    approvalUnit: undefined,
    documentNumber: undefined,
    publishTime: undefined,
    executeTime: undefined,
    securityLevel: undefined,
    attachment: undefined
  }
  formRef.value?.resetFields()
}


/** 获得数据 */
const getInfo = async () => {
  formLoading.value = true
  try {
    formData.value = await TechInstitutionApi.getTechInstitution(props.id || queryId)
  } finally {
    formLoading.value = false
  }
}
defineExpose({open: getInfo}) // 提供 open 方法，用于打开弹窗

/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
