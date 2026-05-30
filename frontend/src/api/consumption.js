import instance from './instance'

// 소비 내역 조회
export const getConsumptions = async (month) => {
  const res = await instance.get('/api/consumptions', {
    params: { month }
  })
  return res.data
}

// 소비 내역 등록
export const createConsumption = async (data) => {
  const res = await instance.post('/api/consumptions', data)
  return res.data
}

// 소비 내역 수정
export const updateConsumption = async (id, data) => {
  const res = await instance.patch(`/api/consumptions/${id}`, data)
  return res.data
}

// 소비 내역 삭제
export const deleteConsumption = async (id) => {
  const res = await instance.delete(`/api/consumptions/${id}`)
  return res.data
}

// 카테고리별 소비 집계
export const getConsumptionSummary = async (startDate, endDate) => {
  const res = await instance.get('/api/consumptions/summary/category', {
    params: { startDate, endDate }
  })
  return res.data
}