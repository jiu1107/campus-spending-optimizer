import { useState, useEffect } from 'react'
import { getBudgets, setBudget } from './api/budget'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Map from './pages/Map'
import Analysis from './pages/Analysis'
import Recommend from './pages/Recommend'
import Performance from './pages/Performance'
import MyPage from './pages/MyPage'
import Login from './pages/Login'
import Signup from './pages/Signup'

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('token')
  return isLoggedIn ? children : <Navigate to="/login" />
}

function App() {
  const [currentDate, setCurrentDate] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 })
  const [userCards, setUserCards] = useState([])
  const [budgets, setBudgets] = useState({})
  const [expenses, setExpenses] = useState([])

  // 카드 목록 fetch
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    const fetchUserCards = async () => {
      try {
        const { getUserCards } = await import('./api/card')
        const data = await getUserCards()
        const CATEGORY_MAP = {
          FOOD: '식비', CAFE: '카페', CONVENIENCE_STORE: '편의점',
          CULTURE: '문화', SHOPPING: '쇼핑'
        }
        const COLOR_MAP = {
          '신한': '#7F77DD', '하나': '#1D9E75', '농협': '#4CAF50',
          '카카오뱅크': '#F9E000', '토스뱅크': '#0064FF', '우리': '#0076F1',
          'KB국민': '#185FA5', '기업': '#FF6B35'
        }
        setUserCards(data.map(card => ({
          id: card.cardId,
          card_name: card.cardName,
          company: card.company,
          benefits: Object.fromEntries(
            Object.entries(card.benefits || {}).map(([k, v]) => [CATEGORY_MAP[k] || k, v * 100])
          ),
          color: COLOR_MAP[card.company] || '#0076F1',
        })))
      } catch (err) {
        console.error('카드 목록 조회 실패:', err)
      }
    }
    fetchUserCards()
  }, [])

  // 예산 fetch
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    const fetchBudgets = async () => {
      try {
        const data = await getBudgets(currentDate.year, currentDate.month)
        const dateKey = `${currentDate.year}-${currentDate.month}`
        setBudgets(prev => ({ ...prev, [dateKey]: data }))
      } catch (err) {
        console.error('예산 조회 실패:', err)
      }
    }
    fetchBudgets()
  }, [currentDate.year, currentDate.month])

  // 소비 내역 fetch
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    const fetchExpenses = async () => {
      try {
        const { getConsumptions } = await import('./api/consumption')
        const data = await getConsumptions(currentDate.year, currentDate.month)
        setExpenses(data)
      } catch (err) {
        console.error('소비 내역 조회 실패:', err)
      }
    }
    fetchExpenses()
  }, [currentDate.year, currentDate.month])

  const dateKey = `${currentDate.year}-${currentDate.month}`
  const currentBudgets = budgets[dateKey] || { 식비: 0, 카페: 0, 편의점: 0, 문화: 0, 쇼핑: 0 }

  const handleAddBudget = async (category, amount) => {
    try {
      await setBudget(currentDate.year, currentDate.month, category, amount)
      setBudgets(prev => ({
        ...prev,
        [dateKey]: { ...(prev[dateKey] || {}), [category]: amount }
      }))
    } catch (err) {
      console.error('예산 설정 실패:', err)
    }
  }

  const handleRegisterCard = (newCard) => setUserCards(prev => [...prev, newCard])

  // MyPage에서 API 호출 완료 후 알려주면 App state만 업데이트
  const handleDeleteCard = (cardId) => {
    setUserCards(prev => prev.filter(card => card.id !== cardId))
  }

  const handleNavigateMonth = (direction) => {
    setCurrentDate(prev => {
      let newMonth = prev.month + direction
      let newYear = prev.year
      if (newMonth > 12) { newMonth = 1; newYear += 1 }
      else if (newMonth < 1) { newMonth = 12; newYear -= 1 }
      return { year: newYear, month: newMonth }
    })
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={
                <PrivateRoute>
                  <Home
                    currentBudgets={currentBudgets}
                    currentDate={currentDate}
                    userCards={userCards}
                    expenses={expenses}
                  />
                </PrivateRoute>
              } />
              <Route path="/map" element={<PrivateRoute><Map userCards={userCards} /></PrivateRoute>} />
              <Route path="/analysis" element={
                <PrivateRoute>
                  <Analysis
                    currentBudgets={currentBudgets}
                    currentDate={currentDate}
                    onAddBudget={handleAddBudget}
                    userCards={userCards}
                    onNavigateMonth={handleNavigateMonth}
                  />
                </PrivateRoute>
              } />
              <Route path="/recommend" element={<PrivateRoute><Recommend userCards={userCards} /></PrivateRoute>} />
              <Route path="/performance" element={<PrivateRoute><Performance currentDate={currentDate} userCards={userCards} /></PrivateRoute>} />
              <Route path="/mypage" element={
                <PrivateRoute>
                  <MyPage
                    userCards={userCards}
                    onRegisterCard={handleRegisterCard}
                    onDeleteCard={handleDeleteCard}
                  />
                </PrivateRoute>
              } />
            </Routes>
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App