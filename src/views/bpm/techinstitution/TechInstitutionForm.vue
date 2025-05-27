<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" style="width: 1000px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      v-loading="formLoading"
    >
      <!--      <el-form-item label="申请人" prop="userId">-->
      <!--        <el-input v-model="formData.userId" placeholder="请输入申请人" />-->
      <!--      </el-form-item>-->
      <el-form-item label="制度编号" prop="institutionCode" v-if="formType ==='update'">
        <el-input v-model="formData.institutionCode" placeholder="请输入制度编号" maxlength="100" show-word-limit disabled/>
      </el-form-item>
      <el-form-item label="制度名称" prop="institutionName">
        <el-input v-model="formData.institutionName" placeholder="请输入制度名称" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="制度年度" prop="institutionYear">
        <el-input v-model="formData.institutionYear" placeholder="请输入制度年度" maxlength="10" show-word-limit />
      </el-form-item>
      <el-form-item label="制度等级" prop="institutionLevel">
        <el-select v-model="formData.institutionLevel" placeholder="请选择制度等级">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.INSTITUTION_LEVEL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="技术领域" prop="techField">
        <el-input v-model="formData.techField" placeholder="请输入技术领域" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="批准单位" prop="approvalUnit">
        <el-input v-model="formData.approvalUnit" placeholder="请输入批准单位" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="制度文号" prop="documentNumber">
        <el-input v-model="formData.documentNumber" placeholder="请输入制度文号" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker
          v-model="formData.publishTime"
          type="date"
          value-format="x"
          placeholder="选择发布时间"
        />
      </el-form-item>
      <el-form-item label="执行时间" prop="executeTime">
        <el-date-picker
          v-model="formData.executeTime"
          type="date"
          value-format="x"
          placeholder="选择执行时间"
        />
      </el-form-item>
      <el-form-item label="制度密级" prop="securityLevel">
        <el-select v-model="formData.securityLevel" placeholder="请选择制度密级">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.SECURITY_LEVEL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="PDF/扫描件附件" prop="attachment">
        <UploadFile v-model="formData.attachment"   />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="warning" :disabled="formLoading">提 交</el-button>
      <el-button @click="saveForm" type="primary" :disabled="formLoading">保 存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {TechInstitutionApi, TechInstitutionVO} from '@/api/bpm/techinstitution'
import { useUserStoreWithOut } from '@/store/modules/user'

/** 科技制度属性管理 表单 */
defineOptions({name: 'TechInstitutionForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const userStore = useUserStoreWithOut() // 用户信息缓存

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

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
const formRules = reactive({
  userId: [{required: true, message: '申请人不能为空', trigger: 'blur'}],
  institutionCode: [{required: true, message: '制度编号不能为空', trigger: 'blur'}],
  institutionName: [{required: true, message: '制度名称不能为空', trigger: 'blur'}],
  institutionYear: [{ required: true, message: '制度年度不能为空', trigger: 'blur' }],
  institutionLevel: [{ required: true, message: '制度等级不能为空', trigger: 'change' }],
  techField: [{ required: true, message: '技术领域不能为空', trigger: 'blur' }],
  approvalUnit: [{ required: true, message: '批准单位不能为空', trigger: 'blur' }],
  documentNumber: [{ required: true, message: '制度文号不能为空', trigger: 'blur' }],
  publishTime: [{ required: true, message: '发布时间不能为空', trigger: 'blur' }],
  executeTime: [{ required: true, message: '执行时间不能为空', trigger: 'blur' }],
  securityLevel: [{ required: true, message: '制度密级不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await TechInstitutionApi.getTechInstitution(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const saveForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as TechInstitutionVO
    const userId = userStore.getUser.id
    data.userId = userId
    if (formType.value === 'create') {
      await TechInstitutionApi.createTechInstitution(data)
      message.success(t('common.createSuccess'))
    } else {
      await TechInstitutionApi.updateTechInstitution(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  await message.confirm('确认提交当前申请吗？提交后不可修改。')
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as TechInstitutionVO
    const userId = userStore.getUser.id
    data.userId = userId
    if (formType.value === 'create') {
      await TechInstitutionApi.createAndSubmitTechInstitution(data)
      message.success(t('common.submitSuccess'))
    } else {
      await TechInstitutionApi.updateAndSubmitTechInstitution(data)
      message.success(t('common.submitSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

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
</script>
