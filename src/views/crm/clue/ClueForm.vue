<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="线索名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入线索名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户来源" prop="source">
            <el-select v-model="formData.source" placeholder="请选择客户来源" class="w-1/1">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.CRM_CUSTOMER_SOURCE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属运营" prop="operatorUserId">
            <el-select
              v-model="formData.operatorUserId"
              :disabled="formType !== 'create'"
              class="w-1/1"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="ownerUserId">
            <el-select
              v-model="formData.ownerUserId"
              :disabled="formType !== 'create'"
              class="w-1/1"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 用户UID -->
        <el-col :span="12">
          <el-form-item label="客户UID" prop="customerUid">
            <el-input v-model="formData.customerUid" placeholder="请输入用户UID" />
          </el-form-item>
        </el-col>
        <!-- 联系方式 -->
        <el-col :span="12">
          <el-form-item label="联系方式" prop="contact">
            <el-input v-model="formData.contact" placeholder="请输入联系方式" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="咨询时间" prop="consultTime">
            <el-date-picker
              v-model="formData.consultTime"
              placeholder="选择咨询时间"
              type="datetime"
              value-format="x"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 截图 文件上传  支持多个 -->
        <el-col :span="12">
          <el-form-item label="截图" prop="images">
            <el-upload
              ref="uploadRef"
              v-model:file-list="fileList"
              :action="uploadUrl"
              :show-file-list="true"
              :http-request="httpRequest"
              :on-success="handleSuccess"
              :on-remove="handleImageRemove"
              list-type="picture-card"
              :auto-upload="true"
              multiple
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as ClueApi from '@/api/crm/clue'
import * as AreaApi from '@/api/system/area'
import * as UserApi from '@/api/system/user'
import { useUserStore } from '@/store/modules/user'
import { useUpload } from '@/components/UploadFile/src/useUpload'
const { uploadUrl, httpRequest } = useUpload()
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const areaList = ref([]) // 地区列表
const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表

const fileList = ref([]) // 用于显示已上传文件列表
const imageUrls = ref<string[]>([]) // 存储所有上传成功的图片URL
    
const formData = ref({
  id: undefined,
  name: undefined,
  contactNextTime: undefined,
  ownerUserId: 0,
  mobile: undefined,
  telephone: undefined,
  qq: undefined,
  wechat: undefined,
  email: undefined,
  areaId: undefined,
  detailAddress: undefined,
  industryId: undefined,
  level: undefined,
  source: undefined,
  remark: undefined,
  // #############
  consultTime: undefined,
  customerUid: undefined,
  contact: undefined,
  operatorUserId: undefined,
  images: []
})
const formRules = reactive({
  name: [{ required: true, message: '线索名称不能为空', trigger: 'blur' }],
  ownerUserId: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
  customerUid: [{ required: true, message: '客户UID不能为空', trigger: 'blur' }],
  contact: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
  operatorUserId: [{ required: true, message: '所属运营不能为空', trigger: 'blur' }],
  consultTime: [{ required: true, message: '咨询时间不能为空', trigger: 'blur' }],
  source: [{ required: true, message: '客户来源不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

// 监听 imageUrls 变化，更新表单字段
watch(
  imageUrls, 
  (newVal) => {
    console.log('imageUrls changed:', newVal)
    // 使用展开运算符创建新数组，确保引用变化
    formData.value.images = [...newVal]
    
    // 手动触发表单验证
    if (formRef.value) {
      formRef.value.validateField('images')
    }
  },
  { deep: true } // 添加深度监听
)


/** 处理上传成功的事件 */
const handleSuccess = (response, file, fileList) => {
  if (response.code === 0) {
    const url = response.data
    // 创建新数组并赋值，确保触发响应式更新
    imageUrls.value = [...imageUrls.value, url]
    console.log('上传成功，当前 imageUrls:', imageUrls.value)
  }
}

// 移除图片处理
const handleImageRemove = (file, fileList) => {
  // 从 imageUrls 中移除对应的URL
  console.log('移除文件:', file)
  const index = imageUrls.value.indexOf(file.url)
  if (index !== -1) {
    // 创建新数组并赋值，确保触发响应式更新
    const newUrls = [...imageUrls.value]
    newUrls.splice(index, 1)
    imageUrls.value = newUrls
    console.log('移除后的 imageUrls:', imageUrls.value)
  }
}

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
      const data = await ClueApi.getClue(id)
      formData.value = data
            
      // 确保 images 是数组
      if (data.images) {
        // 如果后端返回的是字符串（如逗号分隔的URL），需要转换为数组
        const imagesArray = Array.isArray(data.images) 
          ? data.images 
          : typeof data.images === 'string' 
            ? data.images.split(',') 
            : []
        
        console.log('处理后的图片数组:', imagesArray)
        
        // 更新 imageUrls
        imageUrls.value = [...imagesArray]
        
        // 构建 fileList 用于 El-Upload 显示
        fileList.value = imagesArray.map((url, index) => ({
          name: `图片${index + 1}`,
          url: url,
          status: 'success',
          uid: Date.now() + index // 确保每个文件有唯一ID
        }))
        
        console.log('设置的 fileList:', fileList.value)
      }
    } finally {
      formLoading.value = false
    }
  }
  // 获得地区列表
  areaList.value = await AreaApi.getAreaTree()
  // 获得用户列表
  userOptions.value = await UserApi.getSimpleUserList()
  // 默认新建时选中自己
  if (formType.value === 'create') {
    formData.value.ownerUserId = useUserStore().getUser.id
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ClueApi.ClueVO
    console.log('data', data)
    if (formType.value === 'create') {
      await ClueApi.createClue(data)
      message.success(t('common.createSuccess'))
    } else {
      await ClueApi.updateClue(data)
      message.success(t('common.updateSuccess'))
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
    name: undefined,
    contactNextTime: undefined,
    ownerUserId: 0,
    mobile: undefined,
    telephone: undefined,
    qq: undefined,
    wechat: undefined,
    email: undefined,
    areaId: undefined,
    detailAddress: undefined,
    industryId: undefined,
    level: undefined,
    source: undefined,
    remark: undefined,
    consultTime: undefined,
    customerUid: undefined,
    contact: undefined,
    operatorUserId: undefined,
    images: []
  }
  formRef.value?.resetFields()
  fileList.value = []
  imageUrls.value = []
}
</script>
