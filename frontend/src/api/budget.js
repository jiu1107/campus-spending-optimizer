import instance from './instance'

const getUserId = () => localStorage.getItem('userId')

// 예산 조회
export const getBudgets = async (year, month) => {
  const userId = getUserId()
  const res = await instance.get(`/api/budgets/${userId}`, {
    params: { year, month }
  })
  return res.data
}

// 예산 설정
export const setBudget = async (year, month, category, amount) => {
  const userId = getUserId()
  const res = await instance.post(`/api/budgets/${userId}`, {
    year, month, category, amount
  })
  return res.data
}
