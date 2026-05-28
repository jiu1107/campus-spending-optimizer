
import { useState } from 'react'

import HomePage from './pages/HomePage'
import BenefitMapPage from './pages/BenefitMapPage'
import DashboardPage from './pages/DashboardPage'
import CardRecommendPage from './pages/CardRecommendPage'
import PerformancePage from './pages/PerformancePage'
import CardRegisterPage from './pages/CardRegisterPage'
import MyPage from './pages/MyPage'

import './styles/global.css'

function App() {
  const [page, setPage] = useState('dashboard')
  const [open, setOpen] = useState(false)

  const [registeredCards, setRegisteredCards] =
    useState([
      {
        company: 'KB국민카드',
        name: 'KB국민 노리2',
        target: 300000,
        color: '#4361ee',
      },
    ])

  const [expenses, setExpenses] =
    useState([])

  return (
    <div>
      <div className="topbar">
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <h2>소비 최적화 서비스</h2>
      </div>

      {open && (
        <div className="sidebar">
          <button onClick={() => {
            setPage('home')
            setOpen(false)
          }}>
            홈
          </button>

          <button onClick={() => {
            setPage('map')
            setOpen(false)
          }}>
            혜택 지도
          </button>

          <button onClick={() => {
            setPage('dashboard')
            setOpen(false)
          }}>
            소비 패턴 분석
          </button>

          <button onClick={() => {
            setPage('recommend')
            setOpen(false)
          }}>
            카드 추천
          </button>

          <button onClick={() => {
            setPage('performance')
            setOpen(false)
          }}>
            실적 관리
          </button>

          <button onClick={() => {
            setPage('card')
            setOpen(false)
          }}>
            카드 등록
          </button>

          <button onClick={() => {
            setPage('mypage')
            setOpen(false)
          }}>
            마이페이지
          </button>
        </div>
      )}

      {page === 'home' && <HomePage />}
      {page === 'map' && <BenefitMapPage />}

      {page === 'dashboard' && (
        <DashboardPage
          registeredCards={registeredCards}
          expenses={expenses}
          setExpenses={setExpenses}
        />
      )}

      {page === 'recommend' && <CardRecommendPage />}

      {page === 'performance' && (
        <PerformancePage
          registeredCards={registeredCards}
          expenses={expenses}
        />
      )}

      {page === 'card' && (
        <CardRegisterPage
          registeredCards={registeredCards}
          setRegisteredCards={setRegisteredCards}
        />
      )}

      {page === 'mypage' && <MyPage />}
    </div>
  )
}

export default App
