import instance from './instance'

// 카테고리별 카드 추천
export const getRecommendByCategory = async (category) => {
  const res = await instance.get('/api/recommend/category', {
    params: { category }
  })
  return res.data
}

// 전체 합산 카드 추천
export const getRecommendTotal = async () => {
  const res = await instance.get('/api/recommend/total')
  return res.data
}