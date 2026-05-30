import instance from './instance'

// 전월 실적 조회
export const getPerformance = async () => {
  const res = await instance.get('/api/performance')
  return res.data
}

// 소비 방향 제안
export const getPerformanceSuggestion = async () => {
  const res = await instance.get('/api/performance/suggestion')
  return res.data
}