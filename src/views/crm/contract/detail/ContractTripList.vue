<template>
  <ContentWrap>
    <el-table :data="contract.trips" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column
        align="center"
        label="行程信息"
        fixed="left"
        prop="tripInfo"
        min-width="160"
      >
        <template #default="scope">
          {{ scope.row.tripInfo }}
        </template>
      </el-table-column>
      <el-table-column label="航班号" align="center" prop="flightNo" min-width="120" />
      <el-table-column align="center" label="类型" prop="type" min-width="160">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.CRM_TRIP_TYPE" :value="row.type" />
        </template>
      </el-table-column>
      <el-table-column
        label="出发时间"
        align="center"
        prop="startTime"
        min-width="140"
      >
        <template #default="{ row }">
          {{ formatDate(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="人数"
        align="center"
        prop="passengerNum"
        min-width="140"
      />
      <el-table-column
        label="产品价格（元）"
        align="center"
        prop="price"
        min-width="140"
        :formatter="erpPriceTableColumnFormatter"
      />
      <el-table-column
        align="center"
        label="车型"
        prop="carModel"
        min-width="100px"
      />
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        min-width="140"
      />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import * as ContractApi from '@/api/crm/contract'
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { erpPriceInputFormatter, erpPriceTableColumnFormatter } from '@/utils'

const { contract } = defineProps<{
  contract: ContractApi.ContractVO
}>()
</script>
