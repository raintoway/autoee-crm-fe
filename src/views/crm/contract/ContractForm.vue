<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="2000">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="订单编号" prop="no">
            <el-input disabled v-model="formData.no" placeholder="保存时自动生成" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入订单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
        <el-col :span="8">
          <el-form-item label="客户名称" prop="customerId">
            <el-select
              v-model="formData.customerId"
              placeholder="请选择客户"
              class="w-1/1"
              @change="handleCustomerChange"
            >
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8"> -->
          <!-- <el-form-item label="商机名称" prop="businessId">
            <el-select
              @change="handleBusinessChange"
              :disabled="!formData.customerId"
              v-model="formData.businessId"
              class="w-1/1"
            >
              <el-option
                v-for="item in getBusinessOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id!"
              />
            </el-select>
          </el-form-item> -->
        <!-- </el-col> -->
        <el-col :span="8">
          <el-form-item label="行程状态" prop="tripStatus">
            <el-select v-model="formData.tripStatus" class="w-1/1">
              <el-option
                v-for="item in getIntDictOptions(DICT_TYPE.CRM_TRIP_STATUS)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款状态" prop="paymentStatus">
            <el-select v-model="formData.paymentStatus" class="w-1/1">
              <el-option
                v-for="item in getIntDictOptions(DICT_TYPE.CRM_PAYMENT_STATUS)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="下单日期" prop="orderDate">
            <el-date-picker
              v-model="formData.orderDate"
              placeholder="选择下单日期"
              type="date"
              value-format="x"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="formData.startTime"
              placeholder="选择开始时间"
              type="date"
              value-format="x"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="formData.endTime"
              placeholder="选择结束时间"
              type="date"
              value-format="x"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <!-- <el-col :span="8">
          <el-form-item label="公司签约人" prop="signUserId">
            <el-select v-model="formData.signUserId" class="w-1/1">
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.nickname"
                :value="item.id!"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户签约人" prop="signContactId">
            <el-select
              v-model="formData.signContactId"
              :disabled="!formData.customerId"
              class="w-1/1"
            >
              <el-option
                v-for="item in getContactOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 子表的表单 -->
      <ContentWrap>
        <el-tabs v-model="tripFormName" class="-mt-15px -mb-10px">
          <el-tab-pane label="行程信息" name="trip">  
            <ContractTripForm
              ref="tripFormRef"
              :trips="formData.trips"
            />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <ContentWrap>
        <el-tabs v-model="costFormName" class="-mt-15px -mb-10px">
          <el-tab-pane label="费用信息" name="cost">
            <ContractCostForm
              ref="costFormRef"
              :costs="formData.costs"
            />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <el-row>
        <el-col :span="8">
          <el-form-item label="行程总金额" prop="totalTripPrice">
            <el-input
              disabled
              v-model="formData.totalTripPrice"
              :formatter="erpPriceInputFormatter"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="整单折扣（%）" prop="discountPercent">
            <el-input-number
              v-model="formData.discountPercent"
              placeholder="请输入整单折扣"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="折扣后金额" prop="totalPrice">
            <el-input
              disabled
              v-model="formData.totalPrice"
              placeholder="请输入商机金额"
              :formatter="erpPriceInputFormatter"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">保存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as CustomerApi from '@/api/crm/customer'
import * as ContractApi from '@/api/crm/contract'
import * as UserApi from '@/api/system/user'
import * as ContactApi from '@/api/crm/contact'
import * as BusinessApi from '@/api/crm/business'
import { erpPriceMultiply, erpPriceInputFormatter } from '@/utils'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useUserStore } from '@/store/modules/user'

import ContractProductForm from '@/views/crm/contract/components/ContractProductForm.vue'
import ContractTripForm from '@/views/crm/contract/components/ContractTripForm.vue'
import ContractCostForm from '@/views/crm/contract/components/ContractCostForm.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  no: undefined,
  name: undefined,
  customerId: undefined,
  businessId: undefined,
  orderDate: undefined,
  startTime: undefined,
  endTime: undefined,
  signUserId: undefined,
  signContactId: undefined,
  ownerUserId: undefined,
  discountPercent: 0,
  totalTripPrice: undefined,
  remark: undefined,
  tripStatus: 0,
  paymentStatus: 0,
  trips: [],
  costs: []
})
const formRules = reactive({
  name: [{ required: true, message: '订单名称不能为空', trigger: 'blur' }],
  customerId: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
  orderDate: [{ required: true, message: '下单日期不能为空', trigger: 'blur' }],
  ownerUserId: [{ required: true, message: '负责人不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表
const customerList = ref([]) // 客户列表的数据
const businessList = ref<BusinessApi.BusinessVO[]>([])
const contactList = ref<ContactApi.ContactVO[]>([])

const tripFormName = ref('trip')
const tripFormRef = ref()

const costFormName = ref('cost')
const costFormRef = ref()

/** 计算 discountPrice、totalPrice 价格 */
watch(
  () => formData.value,
  (val) => {
    if (!val) {
      return
    }
    const totalTripPrice = val.trips.reduce((prev, curr) => prev + curr.price, 0)
    const discountPrice =
      val.discountPercent != null
        ? erpPriceMultiply(totalTripPrice, val.discountPercent / 100.0)
        : 0
    const totalPrice = totalTripPrice - discountPrice
    // 赋值
    formData.value.totalTripPrice = totalTripPrice
    formData.value.totalPrice = totalPrice
  },
  { deep: true }
)

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
      formData.value = await ContractApi.getContract(id)
    } finally {
      formLoading.value = false
    }
  }
  // 获得客户列表
  customerList.value = await CustomerApi.getCustomerSimpleList()
  // 获得用户列表
  userOptions.value = await UserApi.getSimpleUserList()
  // 默认新建时选中自己
  if (formType.value === 'create') {
    formData.value.ownerUserId = useUserStore().getUser.id
  }
  // 获取联系人
  contactList.value = await ContactApi.getSimpleContactList()
  // 获得商机列表
  businessList.value = await BusinessApi.getSimpleBusinessList()
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
  tripFormRef.value.validate()
  costFormRef.value.validate()
  try {
    const data = unref(formData.value) as unknown as ContractApi.ContractVO
    if (formType.value === 'create') {
      await ContractApi.createContract(data)
      message.success(t('common.createSuccess'))
    } else {
      await ContractApi.updateContract(data)
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
    no: undefined,
    name: undefined,
    customerId: undefined,
    businessId: undefined,
    orderDate: undefined,
    startTime: undefined,
    endTime: undefined,
    signUserId: undefined,
    signContactId: undefined,
    ownerUserId: undefined,
    discountPercent: 0,
    totalTripPrice: undefined,
    remark: undefined,
    tripStatus: 0,
    paymentStatus: 0,
    trips: [],
    costs: []
  }
  formRef.value?.resetFields()
}

/** 处理切换客户 */
const handleCustomerChange = () => {
  formData.value.businessId = undefined
  formData.value.signContactId = undefined
  // formData.value.trips = []
}

/** 处理商机变化 */
const handleBusinessChange = async (businessId: number) => {
  const business = await BusinessApi.getBusiness(businessId)
  business.trips.forEach((item) => {
    item.price = item.businessPrice
  })
  // formData.value.trips = business.trips
}

/** 动态获取客户联系人 */
const getContactOptions = computed(() =>
  contactList.value.filter((item) => item.customerId == formData.value.customerId)
)
/** 动态获取商机 */
const getBusinessOptions = computed(() =>
  businessList.value.filter((item) => item.customerId == formData.value.customerId)
)
</script>
