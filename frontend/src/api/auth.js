import instance from './instance'

export const signup = async (email, password, nickname) => {
  const res = await instance.post('/api/auth/signup', { email, password, nickname })
  return res.data
}

export const login = async (email, password) => {
  const res = await instance.post('/api/auth/login', { email, password })
  return res.data
}
