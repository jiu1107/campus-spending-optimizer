import instance from './instance'

// 전체 카드 목록 조회
export const getCards = async () => {
  const res = await instance.get('/api/cards')
  return res.data
}

// 카드사별 카드 목록 조회
export const getCardsByCompany = async (company) => {
  const res = await instance.get(`/api/cards/${company}`)
  return res.data
}

// 보유 카드 목록 조회
export const getUserCards = async () => {
  const res = await instance.get('/api/user/cards')
  return res.data
}

// 보유 카드 등록
export const registerUserCard = async (cardId) => {
  const res = await instance.post('/api/user/cards', { card_id: cardId })
  return res.data
}

// 보유 카드 삭제
export const deleteUserCard = async (userCardId) => {
  const res = await instance.delete(`/api/user/cards/${userCardId}`)
  return res.data
}