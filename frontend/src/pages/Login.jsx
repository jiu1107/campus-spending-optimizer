import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      const res = await login(form.email, form.password)
      localStorage.setItem('token', res.accessToken)
      localStorage.setItem('nickname', res.nickname)
      navigate('/')
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: 'white', borderBottom: '0.5px solid #e5e7eb', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#0076F1', fontSize: '15px', fontWeight: '500' }}>💳 소비최적화</span>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid #e5e7eb', padding: '32px 28px', width: '100%', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '4px' }}>로그인</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>소비최적화 서비스에 오신 것을 환영해요</p>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '5px' }}>이메일</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              style={{ width: '100%', height: '40px', border: '0.5px solid #d1d5db', borderRadius: '8px', padding: '0 12px', fontSize: '14px', outline: 'none', color: 'var(--color-text-primary)' }}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '5px' }}>비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={handleChange}
              style={{ width: '100%', height: '40px', border: '0.5px solid #d1d5db', borderRadius: '8px', padding: '0 12px', fontSize: '14px', outline: 'none', color: 'var(--color-text-primary)' }}
            />
          </div>

          {error && <p style={{ fontSize: '12px', color: '#ef4444', marginBottom: '8px' }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', height: '40px', background: '#0076F1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '8px' }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <hr style={{ border: 'none', borderTop: '0.5px solid #e5e7eb', margin: '20px 0' }} />
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
            계정이 없으신가요?{' '}
            <Link to="/signup" style={{ color: '#0076F1', fontWeight: '500', textDecoration: 'none' }}>회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login