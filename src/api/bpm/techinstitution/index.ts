import request from '@/config/axios'

// 科技制度属性管理 VO
export interface TechInstitutionVO {
  id: number // 请假表单主键
  userId: number // 申请人
  institutionCode: string // 制度编号
  institutionName: string // 制度名称
  institutionYear: string // 制度年度
  institutionLevel: string // 制度等级
  techField: string // 技术领域
  approvalUnit: string // 批准单位
  documentNumber: string // 制度文号
  publishTime: Date // 发布时间
  executeTime: Date // 执行时间
  securityLevel: string // 制度密级
  attachment: string // PDF/扫描件附件
}

// 科技制度属性管理 API
export const TechInstitutionApi = {
  // 查询科技制度属性管理分页
  getTechInstitutionPage: async (params: any) => {
    return await request.get({ url: `/bpm/tech-institution/page`, params })
  },

  // 查询科技制度属性管理详情
  getTechInstitution: async (id: number) => {
    return await request.get({ url: `/bpm/tech-institution/get?id=` + id })
  },

  // 新增科技制度属性管理
  createTechInstitution: async (data: TechInstitutionVO) => {
    return await request.post({ url: `/bpm/tech-institution/create`, data })
  },
  createAndSubmitTechInstitution: async (data: TechInstitutionVO) => {
    return await request.post({ url: `/bpm/tech-institution/createAndSubmit`, data })
  },

  // 修改科技制度属性管理
  updateTechInstitution: async (data: TechInstitutionVO) => {
    return await request.put({ url: `/bpm/tech-institution/update`, data })
  },
  updateAndSubmitTechInstitution: async (data: TechInstitutionVO) => {
    return await request.put({ url: `/bpm/tech-institution/updateAndSubmit`, data })
  },

  // 删除科技制度属性管理
  deleteTechInstitution: async (id: number) => {
    return await request.delete({ url: `/bpm/tech-institution/delete?id=` + id })
  },

  // 导出科技制度属性管理 Excel
  exportTechInstitution: async (params) => {
    return await request.download({ url: `/bpm/tech-institution/export-excel`, params })
  }
}
