<!-- 订单详情页面组件-->
<template>
  <div>
    <ContractDetailsHeader v-loading="loading" :contract="contract">
      <el-button v-if="permissionListRef?.validateWrite" @click="openForm('update', contract.id)">
        编辑
      </el-button>
      <el-button v-if="permissionListRef?.validateOwnerUser" type="primary"
                 @click="transferContract">
        转移
      </el-button>
    </ContractDetailsHeader>
    <el-col>
      <el-tabs v-model="activeName">
        <el-tab-pane label="跟进记录" name="followup">
          <FollowUpList
            v-if="contract.id"
            :biz-id="contract.id"
            :biz-type="BizTypeEnum.CRM_CONTRACT"/>
        </el-tab-pane>

        <el-tab-pane label="回款" name="receivable">
          <ReceivablePlanList
            v-if="contract.id && contract.customerId"
            :contract-id="contract.id"
            :customer-id="contract.customerId"
            @create-receivable="createReceivable"
          />
          <ReceivableList
            v-if="contract.id && contract.customerId"
            ref="receivableListRef"
            :contract-id="contract.id"
            :customer-id="contract.customerId"
          />
        </el-tab-pane>
        <el-tab-pane label="基本信息" name="base">
          <ContractDetailsInfo v-if="contract.id" :contract="contract"/>
        </el-tab-pane>
        <el-tab-pane label="产品" name="product">
          <ContractProductList :contract="contract"/>
        </el-tab-pane>
        <el-tab-pane label="行程" name="trip">
          <ContractTripList :contract="contract"/>
        </el-tab-pane>
        <el-tab-pane label="团队成员" name="team">
          <PermissionList
            ref="permissionListRef"
            :biz-id="contract.id!"
            :biz-type="BizTypeEnum.CRM_CONTRACT"
            :show-action="true"
            @quit-team="close"
          />
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="operateLog">
          <OperateLogV2 :log-list="logList"/>
        </el-tab-pane>
      </el-tabs>
    </el-col>

    <!-- 表单弹窗：添加/修改 -->
    <ContractForm ref="formRef" @success="getContractData"/>
    <CrmTransferForm ref="transferFormRef" :biz-type="BizTypeEnum.CRM_CONTRACT" @success="close"/>
  </div>
</template>
<script lang="ts" setup>
import {useTagsViewStore} from '@/store/modules/tagsView'
import {OperateLogVO} from '@/api/system/operatelog'
import * as ContractApi from '@/api/crm/contract'
import ContractDetailsInfo from './ContractDetailsInfo.vue'
import ContractDetailsHeader from './ContractDetailsHeader.vue'
import ContractProductList from './ContractProductList.vue'
import {BizTypeEnum} from '@/api/crm/permission'
import {getOperateLogPage} from '@/api/crm/operateLog'
import ContractForm from '@/views/crm/contract/ContractForm.vue'
import CrmTransferForm from '@/views/crm/permission/components/TransferForm.vue'
import PermissionList from '@/views/crm/permission/components/PermissionList.vue'
import FollowUpList from '@/views/crm/followup/index.vue'
import ReceivableList from '@/views/crm/receivable/components/ReceivableList.vue'
import ReceivablePlanList from '@/views/crm/receivable/plan/components/ReceivablePlanList.vue'
import ContractTripList from '@/views/crm/contract/detail/ContractTripList.vue'
defineOptions({name: 'CrmContractDetail'})
const props = defineProps<{ id?: number }>()

const route = useRoute()
const message = useMessage()
const contractId = ref(0) // 编号
const loading = ref(true) // 加载中
const activeName = ref('base')
// const contract = ref<ContractApi.ContractVO>({} as ContractApi.ContractVO) // 详情
const contract = ref<ContractApi.ContractVO>({
  id: 0,
  customerId: 0,
  // 其他必要字段初始化
} as ContractApi.ContractVO) // 初始化订单对象
const permissionListRef = ref<InstanceType<typeof PermissionList>>() // 团队成员列表 Ref

/** 编辑 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 获取详情 */
const getContractData = async () => {
  loading.value = true
  try {
    contract.value = await ContractApi.getContract(contractId.value)
    await getOperateLog(contractId.value)
  } finally {
    loading.value = false
  }
}

/** 获取操作日志 */
const logList = ref<OperateLogVO[]>([]) // 操作日志列表
const getOperateLog = async (contractId: number) => {
  if (!contractId) {
    return
  }
  const data = await getOperateLogPage({
    bizType: BizTypeEnum.CRM_CONTRACT,
    bizId: contractId
  })
  logList.value = data.list
}

/** 从回款计划创建回款 */
const receivableListRef = ref<InstanceType<typeof ReceivableList>>() // 回款列表 Ref
const createReceivable = (planData: any) => {
  receivableListRef.value?.createReceivable(planData)
}

/** 转移 */
const transferFormRef = ref<InstanceType<typeof CrmTransferForm>>() // 订单转移表单 ref
const transferContract = () => {
  transferFormRef.value?.open(contract.value.id)
}

/** 关闭 */
const {delView} = useTagsViewStore() // 视图操作
const {currentRoute} = useRouter() // 路由
const close = () => {
  delView(unref(currentRoute))
}

/** 初始化 */
onMounted(async () => {
  console.log("props.id=" + props.id)
  console.log("route.params.id=" + route.params.id)
  console.log("route.query.activeName=" + route.query.activeName)
  const id = props.id || route.params.id
  if (!id) {
    message.warning('参数错误，订单不能为空！')
    close()
    return
  }
  activeName.value = route.query.activeName || 'base' 
  contractId.value = id as unknown as number
  await getContractData()
})
</script>
