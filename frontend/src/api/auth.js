import instance from './instance'

export const signup = async (email, password, nickname) => {
  const res = await instance.post('/api/auth/signup', { email, password, nickname })
  return res.data
}

export const login = async (email, password) => {
  const res = await instance.post('/api/auth/login', { email, password })
  return res.data
}

// 닉네임 수정
export const updateNickname = async (userId, nickname) => {
  const res = await instance.put(`/api/users/${userId}/nickname`, { nickname })
  return res.data
}