import instance from './instance'

const getUserId = () => localStorage.getItem('userId')

const CATEGORY_MAP = {
  식비: 'FOOD', 카페: 'CAFE', 편의점: 'CONVENIENCE_STORE',
  문화: 'CULTURE', 쇼핑: 'SHOPPING',
}
const CATEGORY_MAP_REVERSE = {
  FOOD: '식비', CAFE: '카페', CONVENIENCE_STORE: '편의점',
  CULTURE: '문화', SHOPPING: '쇼핑',
}

// 소비 내역 조회
export const getConsumptions = async (year, month) => {
  const userId = getUserId()
  const startDate = `${year}-${String(month).padStart(2, '0')}-01T00:00:00`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}T23:59:59`
  const res = await instance.get(`/api/consumptions/${userId}`, {
    params: { startDate, endDate }
  })
  return res.data.map(c => ({
    id: c.id,
    date: c.consumedAt.substring(0, 10),
    day: getDayName(c.consumedAt),
    place: c.storeName,
    category: CATEGORY_MAP_REVERSE[c.category] || c.category,
    amount: c.amount,
    card: c.cardName || '',
  }))
}

// 소비 내역 등록
export const createConsumption = async (data) => {
  const userId = getUserId()
  const res = await instance.post(`/api/consumptions/${userId}`, {
    amount: Number(data.amount),
    category: CATEGORY_MAP[data.category] || data.category,
    storeName: data.place,
    consumedAt: `${data.date}T${new Date().toTimeString().substring(0, 8)}`,
    latitude: null,
    longitude: null,
    cardName: data.card || null,
  })
  return res.data
}

// 소비 내역 수정
export const updateConsumption = async (consumptionId, data) => {
  const userId = getUserId()
  const res = await instance.put(`/api/consumptions/${userId}/${consumptionId}`, {
    amount: Number(data.amount),
    category: CATEGORY_MAP[data.category] || data.category,
    storeName: data.place,
    consumedAt: `${data.date}T${new Date().toTimeString().substring(0, 8)}`,
    latitude: null,
    longitude: null,
    cardName: data.card || null,
  })
  return res.data
}

// 카테고리별 소비 집계
export const getConsumptionSummary = async (year, month) => {
  const userId = getUserId()
  const startDate = `${year}-${String(month).padStart(2, '0')}-01T00:00:00`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}T23:59:59`
  const res = await instance.get(`/api/consumptions/summary/category/${userId}`, {
    params: { startDate, endDate }
  })
  return res.data
}

const getDayName = (dateStr) => {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  return days[new Date(dateStr).getDay()]
}

// 소비 내역 삭제
export const deleteConsumption = async (consumptionId) => {
  const userId = getUserId()
  const res = await instance.delete(`/api/consumptions/${userId}/${consumptionId}`)
  return res.data
}