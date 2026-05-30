import { useState } from 'react'
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
  const [currentDate, setCurrentDate] = useState({ year: 2026, month: 5 })
  const [userCards, setUserCards] = useState([
    { id: 1, card_name: 'KB국민 노리2 체크카드', company: 'KB국민', benefits: { 식비: 5, 카페: 3, 편의점: 2, 문화: 0, 쇼핑: 0 }, color: '#185FA5' },
    { id: 2, card_name: '신한 Hey Young 체크카드', company: '신한', benefits: { 식비: 0, 카페: 10, 편의점: 0, 문화: 15, 쇼핑: 5 }, color: '#7F77DD' },
  ])
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2026-05-12', day: '화요일', place: 'OO 김밥', category: '식비', amount: 8000, card: 'KB국민 노리2 체크카드' },
    { id: 2, date: '2026-05-12', day: '화요일', place: '팀 회식', category: '식비', amount: 15000, card: '더치페이 적용' },
    { id: 3, date: '2026-05-08', day: '금요일', place: 'OO 덮밥', category: '식비', amount: 8000, card: '신한 Hey Young 체크카드' }
  ])
  const [budgets, setBudgets] = useState({
    '2026-5': { 식비: 150000, 카페: 50000, 편의점: 30000, 문화: 0, 쇼핑: 0 }
  })

  const dateKey = `${currentDate.year}-${currentDate.month}`
  const currentBudgets = budgets[dateKey] || { 식비: 0, 카페: 0, 편의점: 0, 문화: 0, 쇼핑: 0 }

  const handleAddBudget = (category, amount) => {
    setBudgets(prev => ({ ...prev, [dateKey]: { ...(prev[dateKey] || {}), [category]: amount } }))
  }

  const handleAddExpense = (newExpense) => {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
    const dayName = days[new Date(newExpense.date).getDay()]
    setExpenses(prev => [{ id: Date.now(), ...newExpense, day: dayName, amount: Number(newExpense.amount) }, ...prev])
  }

  const handleDeleteExpense = (id) => {
    if (window.confirm('이 소비 내역을 삭제하시겠습니까?')) {
      setExpenses(prev => prev.filter(exp => exp.id !== id))
    }
  }

  const handleRegisterCard = (newCard) => setUserCards(prev => [...prev, newCard])
  const handleDeleteCard = (cardId) => {
    if (window.confirm('선택하신 카드를 삭제하시겠습니까?')) {
      setUserCards(prev => prev.filter(card => card.id !== cardId))
    }
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
              <Route path="/" element={<PrivateRoute><Home expenses={expenses} currentBudgets={currentBudgets} currentDate={currentDate} userCards={userCards} /></PrivateRoute>} />
              <Route path="/map" element={<PrivateRoute><Map /></PrivateRoute>} />
              <Route path="/analysis" element={<PrivateRoute><Analysis currentBudgets={currentBudgets} expenses={expenses} currentDate={currentDate} onAddBudget={handleAddBudget} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} userCards={userCards} /></PrivateRoute>} onNavigateMonth={handleNavigateMonth} />
              <Route path="/recommend" element={<PrivateRoute><Recommend /></PrivateRoute>} />
              <Route path="/performance" element={<PrivateRoute><Performance expenses={expenses} currentDate={currentDate} userCards={userCards} /></PrivateRoute>} />
              <Route path="/mypage" element={<PrivateRoute><MyPage userCards={userCards} onRegisterCard={handleRegisterCard} onDeleteCard={handleDeleteCard} /></PrivateRoute>} />
            </Routes>
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
