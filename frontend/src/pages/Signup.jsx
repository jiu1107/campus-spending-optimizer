import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../api/auth'

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nickname: '', email: '', password: '', passwordConfirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.nickname || !form.email || !form.password || !form.passwordConfirm) {
      setError('모든 항목을 입력해주세요.')
      return
    }
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    setLoading(true)
    try {
      await signup(form.email, form.password, form.nickname)
      navigate('/login')
    } catch {
      setError('이미 사용 중인 이메일입니다.')
    } finally {
      setLoading(false)
    }
  }

  // 엔터키 제출
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const inputStyle = {
    width: '100%', height: '40px', border: '0.5px solid #d1d5db',
    borderRadius: '8px', padding: '0 12px', fontSize: '14px',
    outline: 'none', color: 'var(--color-text-primary)',
    boxSizing: 'border-box',
  }
  const labelStyle = { display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '5px' }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid #e5e7eb', padding: '32px 28px', width: '100%', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '4px' }}>회원가입</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>간단한 정보로 시작해보세요</p>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>닉네임</label>
            <input type="text" name="nickname" placeholder="닉네임을 입력하세요" value={form.nickname} onChange={handleChange} onKeyDown={handleKeyDown} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>이메일</label>
            <input type="email" name="email" placeholder="example@email.com" value={form.email} onChange={handleChange} onKeyDown={handleKeyDown} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>비밀번호</label>
            <input type="password" name="password" placeholder="8자 이상 입력하세요" value={form.password} onChange={handleChange} onKeyDown={handleKeyDown} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>비밀번호 확인</label>
            <input type="password" name="passwordConfirm" placeholder="비밀번호를 다시 입력하세요" value={form.passwordConfirm} onChange={handleChange} onKeyDown={handleKeyDown} style={inputStyle} />
          </div>

          {error && <p style={{ fontSize: '12px', color: '#ef4444', marginBottom: '8px' }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', height: '40px', background: '#0076F1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '8px' }}
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>

          <hr style={{ border: 'none', borderTop: '0.5px solid #e5e7eb', margin: '20px 0' }} />
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" style={{ color: '#0076F1', fontWeight: '500', textDecoration: 'none' }}>로그인</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup