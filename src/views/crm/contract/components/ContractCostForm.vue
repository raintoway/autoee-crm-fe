<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="行程信息" min-width="180">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.tripInfo`"  class="mb-0px!">
            <el-input v-model="row.tripInfo" placeholder="请输入行程信息" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="120">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-select v-model="row.type" placeholder="请选择">
              <el-option 
              v-for="dict in getIntDictOptions(DICT_TYPE.CRM_TRIP_TYPE)"
              :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="航班号" min-width="120">
        <template #default="{ row }">
          <el-input v-model="row.flightNo" placeholder="请输入航班号" />
        </template>
      </el-table-column>
      <el-table-column label="出发时间" min-width="200">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-date-picker
              v-model="row.startTime" 
              placeholder="请输入出发时间" 
              type="datetime"
              value-format="x"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="人数" prop="passengerNum" fixed="right" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.passengerNum`" :rules="formRules.passengerNum" class="mb-0px!">
            <el-input-number
              v-model="row.passengerNum"
              controls-position="right"
              :min="0"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="价格（元）" min-width="120">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input-number
              v-model="row.price"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="车型" prop="carModel" fixed="right" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.carModel`" class="mb-0px!">
            <el-input v-model="row.carModel" placeholder="请输入车型" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" fixed="right" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="付款金额" min-width="120">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input-number
              v-model="row.costPrice"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="付款备注" prop="costRemark" fixed="right" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.costRemark`" class="mb-0px!">
            <el-input v-model="row.costRemark" placeholder="请输入付款备注" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="付款类型" min-width="120">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-select v-model="row.type" placeholder="请选择">
              <el-option 
              v-for="dict in getIntDictOptions(DICT_TYPE.CRM_COST_TYPE)"
              :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <!-- 付款截图 -->
      <el-table-column label="付款截图" min-width="120">
        <template #default="{ row }">
          <el-upload
            :file-list="getFileList(row.costImages)"
            :action="uploadUrl"
            :show-file-list="true"
            :http-request="httpRequest"
            :on-success="(response, file, fileList) => handleSuccess(response, file, fileList, row)"
            :on-remove="(file, fileList) => handleImageRemove(file, fileList, row)"
            :on-preview="handlePreview"
            list-type="picture-card"
            multiple
            class="custom-upload"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加费用</el-button>
  </el-row>
  <el-image-viewer
      v-if="showImgViewer"
      @close="onCloseImgViewer"
      :url-list="[previewUrl]"
      :z-index="3000"
  />
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useUpload } from '@/components/UploadFile/src/useUpload'
import { ElImageViewer } from 'element-plus'


const { uploadUrl, httpRequest } = useUpload()

interface CostRow {
  id?: number | undefined
  tripInfo?: string
  type: number
  flightNo?: string
  startTime: number
  passengerNum: number
  price: number
  costPrice: number
  carModel?: string
  remark?: string
  costRemark?: string
  costType: number
  costImages: any[]
}

const showImgViewer = ref<boolean>(false)
const previewUrl = ref<string>('')
const props = defineProps<{ costs: CostRow[] }>()
const formLoading = ref(false) // 表单的加载中
const formData = ref<CostRow[]>([])
const formRules = reactive({
  tripInfo: [{ required: true, message: '行程信息不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
  flightNo: [{ required: true, message: '航班号不能为空', trigger: 'blur' }],
  startTime: [{ required: true, message: '出发时间不能为空', trigger: 'blur' }],
  passengerNum: [{ required: true, message: '人数不能为空', trigger: 'blur' }],
  carModel: [{ required: true, message: '车型不能为空', trigger: 'blur' }],
  remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

watch(
  () => props.costs,
  async (val) => {
    console.log(val)
    formData.value = val || []
  },
  {immediate: true}
)

const onCloseImgViewer = () => {
  console.log('关闭图片预览')
  showImgViewer.value = false
  previewUrl.value = ''
}


/** 处理上传成功的事件 */
const handleSuccess = (response, file, fileList, row) => {
  if (response.code === 0) {
    const url = response.data
    // 只存url字符串
    row.costImages = [...row.costImages, url]
    console.log('上传成功，当前 row.costImages:', row.costImages)
  }
}

// 添加图片预览函数
const handlePreview = (file) => {
  console.log('预览文件:', file)
  
  // 获取预览的URL
  const url = file.url || (file.response && file.response.data)
  
  if (url) {
    showImgViewer.value = true
    previewUrl.value = url
  }
}


// 移除图片处理
const handleImageRemove = (file, fileList, row) => {
  // file.url为el-upload file-list对象的url
  console.log('移除文件:', file)
  const index = row.costImages.indexOf(file.url)
  if (index !== -1) {
    const newUrls = [...row.costImages]
    newUrls.splice(index, 1)
    row.costImages = newUrls
    console.log('移除后的 row.costImages:', row.costImages)
  }
}

/** 新增按钮操作 */
const handleAdd = () => {
  const row: CostRow = {
    id: undefined,
    tripInfo: undefined,
    type: 0,
    flightNo: undefined,
    startTime: new Date().getTime(),
    passengerNum: 1,
    price: 0,
    costPrice: 0,
    carModel: undefined,
    remark: undefined,
    costRemark: undefined,
    costType: 0,
    costImages: [],
  }
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index: number) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value?.validate()
}
defineExpose({ validate })

/** 初始化 */
onMounted(async () => {
})

// fileList转换方法：将url数组转为el-upload file-list对象数组
function getFileList(urls: string[]) {
  if (!urls) return []
  return urls.map((url, idx) => ({
    name: `图片${idx + 1}`,
    url
  }))
}
</script>

<style scoped>
/* 自定义上传组件尺寸 */
.custom-upload :deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 100px; /* 调整卡片大小，默认是 148px */
  width: var(--el-upload-picture-card-size);
  height: var(--el-upload-picture-card-size);
  line-height: var(--el-upload-picture-card-size);
}

/* 调整已上传图片的尺寸 */
.custom-upload :deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: var(--el-upload-picture-card-size);
  height: var(--el-upload-picture-card-size);
}

/* 调整图片预览尺寸 */
.custom-upload :deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 调整图标大小 */
.custom-upload :deep(.el-icon) {
  font-size: 20px; /* 默认可能是 28px */
  color: var(--el-text-color-secondary);
}
</style>