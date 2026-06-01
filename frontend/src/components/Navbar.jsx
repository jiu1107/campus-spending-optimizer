import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import { FaCreditCard } from "react-icons/fa6"
import { MdAccountCircle } from 'react-icons/md'

const NAV_ITEMS = [
  { label: '혜택지도', path: '/map' },
  { label: '소비분석', path: '/analysis' },
  { label: '카드추천', path: '/recommend' },
  { label: '실적관리', path: '/performance' },
]

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    // 커스텀 이벤트로 같은 탭 로그아웃 감지
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem('token'))
    window.addEventListener('storage', checkLogin)
    window.addEventListener('authChange', checkLogin) // ← 커스텀 이벤트 추가
    checkLogin()
    return () => {
      window.removeEventListener('storage', checkLogin)
      window.removeEventListener('authChange', checkLogin)
    }
  }, [])

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}>
          <FaCreditCard size={14} />
        </span>
        소비최적화
      </Link>
      <ul className={styles.menu}>
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`${styles.menuItem} ${location.pathname === item.path ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {isLoggedIn ? (
        <button
          className={`${styles.userBtn} ${location.pathname === '/mypage' ? styles.active : ''}`}
          onClick={() => navigate('/mypage')}
        >
          <MdAccountCircle size={28} />
        </button>
      ) : (
        <div className={styles.authButtons}>
          <Link to="/login" className={styles.loginBtn}>로그인</Link>
          <Link to="/signup" className={styles.signupBtn}>회원가입</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar