import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// 요청 시 토큰 자동 주입
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 응답 처리
instance.interceptors.response.use(
  response => response,
  error => {
    // 401: 토큰 만료 시 로그인 페이지로 이동
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance