<template>
  <ContentWrap>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="basicInfo">
        <template #title>
          <span class="text-base font-bold">基本信息</span>
        </template>
        <el-descriptions :column="4">
          <el-descriptions-item label="回款编号">{{ receivable.no }}</el-descriptions-item>
          <el-descriptions-item label="客户名称">
            {{ receivable.customerName }}
          </el-descriptions-item>
          <el-descriptions-item label="合同编号">
            {{ receivable.contract?.no }}
          </el-descriptions-item>
          <el-descriptions-item label="回款日期">
            {{ formatDate(receivable.returnTime, 'YYYY-MM-DD') }}
          </el-descriptions-item>
          <el-descriptions-item label="回款金额">
            {{ erpPriceInputFormatter(receivable.price) }}
          </el-descriptions-item>
          <el-descriptions-item label="回款方式">
            <dict-tag :type="DICT_TYPE.CRM_RECEIVABLE_RETURN_TYPE" :value="receivable.returnType" />
          </el-descriptions-item>
          <el-descriptions-item label="备注">{{ receivable.remark }}</el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
      <el-collapse-item name="systemInfo">
        <template #title>
          <span class="text-base font-bold">系统信息</span>
        </template>
        <el-descriptions :column="4">
          <el-descriptions-item label="负责人">
            {{ receivable.ownerUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="创建人">
            {{ receivable.creatorName }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(receivable.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(receivable.updateTime) }}
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
  </ContentWrap>
</template>
<script setup lang="ts">
import * as ReceivableApi from '@/api/crm/receivable'
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { erpPriceInputFormatter } from '@/utils'

defineOptions({ name: 'BpmReceivableDetailsInfo' })
const props = defineProps<{ id?: number }>()
const receivable = ref<ReceivableApi.ReceivableVO>({} as ReceivableApi.ReceivableVO) // 回款详情
// 展示的折叠面板
const activeNames = ref(['basicInfo', 'systemInfo'])

onMounted(async () => {
  const id = props.id
    console.log("props.id=" + props.id)
  if (!id) {
    message.warning('参数错误，回款不能为空！')
    close()
    return
  }
  await getReceivable(props.id)
})
const loading = ref(true) // 加载中
/** 获取详情 */
const getReceivable = async (id: number) => {
  loading.value = true
  try {
    receivable.value = await ReceivableApi.getReceivable(id)
  } finally {
    loading.value = false
  }
}


</script>
