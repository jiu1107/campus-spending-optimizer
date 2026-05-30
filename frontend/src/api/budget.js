import instance from './instance'

// 예산 조회
export const getBudgets = async (month) => {
  const res = await instance.get('/api/budgets', {
    params: { month }
  })
  return res.data
}

// 예산 등록
export const createBudget = async (data) => {
  const res = await instance.post('/api/budgets', data)
  return res.data
}

// 예산 수정
export const updateBudget = async (id, data) => {
  const res = await instance.patch(`/api/budgets/${id}`, data)
  return res.data
}