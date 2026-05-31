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
  const [userCards, setUserCards] = useState([])
  const [budgets, setBudgets] = useState({
    '2026-5': { 식비: 150000, 카페: 50000, 편의점: 30000, 문화: 0, 쇼핑: 0 }
  })

  const dateKey = `${currentDate.year}-${currentDate.month}`
  const currentBudgets = budgets[dateKey] || { 식비: 0, 카페: 0, 편의점: 0, 문화: 0, 쇼핑: 0 }

  const handleAddBudget = (category, amount) => {
    setBudgets(prev => ({ ...prev, [dateKey]: { ...(prev[dateKey] || {}), [category]: amount } }))
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
              <Route path="/" element={<PrivateRoute><Home currentBudgets={currentBudgets} currentDate={currentDate} userCards={userCards} /></PrivateRoute>} />
              <Route path="/map" element={<PrivateRoute><Map /></PrivateRoute>} />
              <Route path="/analysis" element={<PrivateRoute><Analysis currentBudgets={currentBudgets} currentDate={currentDate} onAddBudget={handleAddBudget} userCards={userCards} onNavigateMonth={handleNavigateMonth} /></PrivateRoute>} />
              <Route path="/recommend" element={<PrivateRoute><Recommend /></PrivateRoute>} />
              <Route path="/performance" element={<PrivateRoute><Performance currentDate={currentDate} userCards={userCards} /></PrivateRoute>} />
              <Route path="/mypage" element={<PrivateRoute><MyPage userCards={userCards} onRegisterCard={handleRegisterCard} onDeleteCard={handleDeleteCard} /></PrivateRoute>} />
            </Routes>
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
