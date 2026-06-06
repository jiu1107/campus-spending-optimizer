import instance from './instance'

const getUserId = () => localStorage.getItem('userId')

// 전체 카드 목록 조회
export const getCards = async () => {
  const res = await instance.get('/api/cards')
  return res.data
}

// 보유 카드 목록 조회
export const getUserCards = async () => {
  const userId = getUserId()
  const res = await instance.get(`/api/cards/user/${userId}`)
  return res.data
}

// 보유 카드 등록
export const registerUserCard = async (cardId) => {
  const userId = getUserId()
  const res = await instance.post(`/api/cards/user/${userId}`, { cardId })
  return res.data
}

// 보유 카드 삭제
export const deleteUserCard = async (cardId) => {
  const userId = getUserId()
  const res = await instance.delete(`/api/cards/user/${userId}/${cardId}`)
  return res.data
}

// 카드 추천 조회
export const getRecommendedCards = async () => {
  const userId = localStorage.getItem('userId')
  const res = await instance.get(`/api/recommendations/cards/${userId}`)
  return res.data
}
