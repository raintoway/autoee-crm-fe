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
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加行程</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
const props = defineProps<{
  trips: undefined
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  tripInfo: [{ required: true, message: '行程信息不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
  flightNo: [{ required: true, message: '航班号不能为空', trigger: 'blur' }],
  startTime: [{ required: true, message: '出发时间不能为空', trigger: 'blur' }],
  passengerNum: [{ required: true, message: '人数不能为空', trigger: 'blur' }],
  carModel: [{ required: true, message: '车型不能为空', trigger: 'blur' }],
  remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
})
const formRef = ref([]) // 表单 Ref

watch(
  () => props.trips,
  async (val) => {
    console.log(val)
    formData.value = val
  },
  {immediate: true}
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    tripInfo: undefined,
    type: 0,
    flightNo: undefined,
    // 当前时间
    startTime: new Date().getTime(),
    passengerNum: 1,
    price: 0,
    carModel: undefined,
    remark: undefined,
  }
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index: number) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}
defineExpose({ validate })

/** 初始化 */
onMounted(async () => {
})
</script>
