import { useState, useEffect } from 'react';
import { MdRestaurant, MdLocalCafe, MdStorefront, MdTheaters, MdShoppingBag, MdDelete, MdEdit, MdWarning, MdPlaylistAdd, MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { MdTune } from 'react-icons/md'
import { getConsumptions, createConsumption, updateConsumption, deleteConsumption } from '../api/consumption'
import Toast from '../components/Toast'

const categoryMeta = {
  식비: { icon: MdRestaurant, color: '#EF9F27', bg: '#FFF7E6' },
  카페: { icon: MdLocalCafe, color: '#7F77DD', bg: '#F3F2FF' },
  편의점: { icon: MdStorefront, color: '#D4537E', bg: '#FFF0F5' },
  문화: { icon: MdTheaters, color: '#1D9E75', bg: '#E8FBF4' },
  쇼핑: { icon: MdShoppingBag, color: '#378ADD', bg: '#EBF4FF' },
}

const ALL_CATEGORIES = ['식비', '카페', '편의점', '문화', '쇼핑']

const defaultExpenseForm = () => ({
  place: '', category: '식비', amount: '', card: '', date: new Date().toISOString().split('T')[0]
})

export default function ConsumptionAnalysisView({
  currentBudgets = {},
  currentDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
  onAddBudget,
  userCards = [],
  onNavigateMonth,
}) {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null) // 수정 중인 항목
  const [selectedFilter, setSelectedFilter] = useState('전체')
  const [sortOrder, setSortOrder] = useState('최신순') // 1번: 날짜 정렬

  // 3번: 예산 폼 - 5개 카테고리 한번에
  const [budgetForm, setBudgetForm] = useState({
    식비: '', 카페: '', 편의점: '', 문화: '', 쇼핑: ''
  })

  const [expenseForm, setExpenseForm] = useState(defaultExpenseForm())
  const [expenses, setExpenses] = useState([])
  const [toast, setToast] = useState({ show: false, message: '', type: 'default' })

  const showToast = (message, type = 'default') => setToast({ show: true, message, type })

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getConsumptions(currentDate.year, currentDate.month)
        setExpenses(data)
      } catch (err) {
        console.error('소비 내역 조회 실패:', err)
      }
    }
    fetchExpenses()
  }, [currentDate.year, currentDate.month])

  // 예산 모달 열 때 현재 예산값 미리 채우기
  const openBudgetModal = () => {
    setBudgetForm({
      식비: currentBudgets['식비'] || '',
      카페: currentBudgets['카페'] || '',
      편의점: currentBudgets['편의점'] || '',
      문화: currentBudgets['문화'] || '',
      쇼핑: currentBudgets['쇼핑'] || '',
    })
    setIsBudgetModalOpen(true)
  }

  const currentYearMonthStr = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`
  const monthlyExpenses = expenses.filter(exp => exp.date.startsWith(currentYearMonthStr))

  // 1번: 카테고리 + 날짜 정렬 적용
  const filteredExpenses = monthlyExpenses
    .filter(exp => selectedFilter === '전체' || exp.category === selectedFilter)
    .sort((a, b) => sortOrder === '최신순'
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date)
    )

  const getCategoryTotal = (cat) => monthlyExpenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
  const totalBudget = Object.values(currentBudgets).reduce((sum, val) => sum + val, 0)
  const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const remainingBudget = totalBudget - totalSpent

  const PERFORMANCE_GOAL = 300000
  const getCardBenefit = (card) => {
    const cardExpenses = monthlyExpenses.filter(exp =>
      exp.card && exp.card.includes(card.card_name?.replace(' 체크카드', '') || '')
    )
    return Object.entries(card.benefits || {}).reduce((total, [cat, val]) => {
  const rate = typeof val === 'object' ? val?.rate : val
  if (!rate) return total
  const catTotal = cardExpenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
  return total + Math.round(catTotal * rate / 100)
}, 0)
  }

  const getCardPerformance = (card) => monthlyExpenses
    .filter(exp => exp.card && exp.card.includes(card.card_name?.replace(' 체크카드', '') || ''))
    .reduce((sum, exp) => sum + exp.amount, 0)

  // 3번: 예산 한번에 저장
  const submitBudget = (e) => {
    e.preventDefault()
    ALL_CATEGORIES.forEach(cat => {
      if (budgetForm[cat] !== '' && Number(budgetForm[cat]) >= 0) {
        onAddBudget(cat, Number(budgetForm[cat]))
      }
    })
    setIsBudgetModalOpen(false)
    showToast('예산이 저장됐어요!', 'success')
  }

  // 소비 내역 추가 / 수정 통합 submit
  const submitExpense = async (e) => {
    e.preventDefault()
    if (!expenseForm.place || !expenseForm.amount || !expenseForm.date) return
    try {
      if (editingExpense) {
        // 2번: 수정 모드
        await updateConsumption(editingExpense.id, expenseForm)
        showToast('수정됐어요!', 'success')
      } else {
        await createConsumption(expenseForm)
        showToast('추가됐어요!', 'success')
      }
      const data = await getConsumptions(currentDate.year, currentDate.month)
      setExpenses(data)
      setExpenseForm(defaultExpenseForm())
      setEditingExpense(null)
      setIsExpenseModalOpen(false)
    } catch (err) {
      console.error('소비 내역 처리 실패:', err)
      showToast(editingExpense ? '수정에 실패했습니다.' : '추가에 실패했습니다.', 'error')
    }
  }

  // 2번: 수정 버튼 클릭 시 폼에 기존 값 채우기
  const handleEditExpense = (exp) => {
    setEditingExpense(exp)
    setExpenseForm({
      place: exp.place,
      category: exp.category,
      amount: exp.amount,
      card: exp.card || '',
      date: exp.date,
    })
    setIsExpenseModalOpen(true)
  }

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false)
    setEditingExpense(null)
    setExpenseForm(defaultExpenseForm())
  }

  const isCloseToOverBudget = ALL_CATEGORIES.some(cat => {
    const budget = currentBudgets[cat]
    if (!budget || budget === 0) return false
    return (getCategoryTotal(cat) / budget) >= 0.8
  })

  const groupedExpenses = filteredExpenses.reduce((acc, exp) => {
    if (!acc[exp.date]) acc[exp.date] = []
    acc[exp.date].push(exp)
    return acc
  }, {})

  const card = {
  background: '#fff', borderRadius: '12px',
  border: '0.5px solid var(--color-border)', padding: '18px',
  minHeight: '260px', display: 'flex', flexDirection: 'column',
  justifyContent: 'space-between',
}

  const btnPrimary = {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '6px 16px', height: '30px',
    background: 'var(--color-primary)', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '12px',
    fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap',
  }

  const btnOutline = {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '6px 12px', height: '30px', background: 'white',
    color: 'var(--color-primary)', border: '1px solid var(--color-primary)',
    borderRadius: '8px', fontSize: '12px', fontWeight: '500',
    cursor: 'pointer', whiteSpace: 'nowrap',
  }

  const inputStyle = {
    width: '100%', padding: '8px 10px',
    border: '0.5px solid var(--color-border)',
    borderRadius: '8px', fontSize: '13px', outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - 56px)', padding: '24px 40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-text-primary)' }}>소비 패턴 분석</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => {
              const now = new Date()
              const isPast = currentDate.year < now.getFullYear() ||
                (currentDate.year === now.getFullYear() && currentDate.month > 1)
              if (!isPast) { showToast('최대 1년 전까지만 확인할 수 있어요', 'warning'); return }
              onNavigateMonth?.(-1)
            }} style={{ width: '28px', height: '28px', borderRadius: '8px', border: '0.5px solid var(--color-border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
              <MdChevronLeft size={18} />
            </button>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
              {currentDate.year}년 {String(currentDate.month).padStart(2, '0')}월
            </span>
            <button onClick={() => {
              const now = new Date()
              if (currentDate.year >= now.getFullYear() && currentDate.month >= now.getMonth() + 1) {
                showToast('이번 달이 가장 최근이에요', 'warning'); return
              }
              onNavigateMonth?.(1)
            }} style={{ width: '28px', height: '28px', borderRadius: '8px', border: '0.5px solid var(--color-border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
              <MdChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 상단 요약 */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid var(--color-border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { label: '총 지출', value: `${totalSpent.toLocaleString()}원`, sub: `${currentDate.month}월 한 달 총소비 금액` },
            { label: '총 예산', value: `${totalBudget.toLocaleString()}원`, sub: `잔여 ${remainingBudget.toLocaleString()}원` },
            { label: '절약 금액', value: `${Math.max(remainingBudget, 0).toLocaleString()}원`, sub: '카드 혜택 활용' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '16px 24px', borderRight: i < 2 ? '0.5px solid var(--color-border)' : 'none' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{item.label}</p>
              <p style={{ fontSize: '22px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{item.value}</p>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{item.sub}</p>
            </div>
          ))}
        </div>

        {/* 소비 내역 + 카드별 혜택 달성도 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

          {/* 소비 내역 */}
          <div style={{ ...card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)' }}>소비 내역</h3>
                {/* 1번: 카테고리 필터 */}
                <select value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)}
                  style={{ fontSize: '11px', border: '0.5px solid var(--color-border)', borderRadius: '6px', padding: '2px 6px', background: '#F9FAFB', color: 'var(--color-text-secondary)', outline: 'none' }}>
                  <option value="전체">전체</option>
                  {ALL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {/* 1번: 날짜 정렬 */}
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}
                  style={{ fontSize: '11px', border: '0.5px solid var(--color-border)', borderRadius: '6px', padding: '2px 6px', background: '#F9FAFB', color: 'var(--color-text-secondary)', outline: 'none' }}>
                  <option value="최신순">최신순</option>
                  <option value="오래된순">오래된순</option>
                </select>
              </div>
              <button onClick={() => { setEditingExpense(null); setExpenseForm(defaultExpenseForm()); setIsExpenseModalOpen(true) }} style={btnPrimary}>
                <MdPlaylistAdd size={15} /> 내역 추가
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto', maxHeight: '180px' }}>
              {Object.keys(groupedExpenses).length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>소비 내역이 없습니다.</p>
                </div>
              ) : Object.entries(groupedExpenses)
                .sort(([a], [b]) => sortOrder === '최신순' ? b.localeCompare(a) : a.localeCompare(b))
                .map(([date, exps]) => (
                  <div key={date}>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '500', padding: '5px 2px 2px' }}>
                      {currentDate.month}월 {new Date(date + 'T00:00:00').getDate()}일 {exps[0]?.day || ''}
                    </p>
                    {exps.map(exp => {
                      const Meta = categoryMeta[exp.category]
                      const Icon = Meta?.icon || MdRestaurant
                      return (
                        <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 8px', borderRadius: '8px', background: '#F9FAFB', marginBottom: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: Meta?.bg || '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Icon size={11} color={Meta?.color || '#888'} />
                            </div>
                            <div>
                              <p style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)', margin: 0 }}>{exp.place}</p>
                              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '1px 0 0' }}>{exp.category} · {exp.card || '미지정'}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{exp.amount.toLocaleString()}원</span>
                            {/* 2번: 수정 버튼 */}
                            <button onClick={() => handleEditExpense(exp)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', display: 'flex', alignItems: 'center' }}>
                              <MdEdit size={13} color='var(--color-primary)' />
                            </button>
                            <button onClick={async () => {
                              try {
                                await deleteConsumption(exp.id)
                                setExpenses(prev => prev.filter(e => e.id !== exp.id))
                              } catch {
                                showToast('삭제에 실패했습니다.', 'error')
                              }
                            }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', display: 'flex', alignItems: 'center' }}>
                              <MdDelete size={13} color='rgb(239, 68, 68)' />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))
              }
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '0.5px solid var(--color-border)', marginTop: '8px', flexShrink: 0 }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-primary)' }}>{currentDate.month}월 총 지출액</span>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-primary)' }}>{totalSpent.toLocaleString()}원</span>
            </div>
          </div>

          {/* 카드별 혜택 달성도 */}
          <div style={{ ...card }}>
            <h3 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '10px', flexShrink: 0 }}>카드별 혜택 달성도</h3>
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {userCards.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>등록된 카드가 없습니다.</p>
                </div>
              ) : userCards.map(c => {
                const performance = getCardPerformance(c)
                const benefit = getCardBenefit(c)
                const isAchieved = performance >= PERFORMANCE_GOAL
                return (
                  <div key={c.id} style={{ padding: '10px 12px', borderRadius: '10px', background: isAchieved ? 'var(--color-primary-light)' : '#F9FAFB', border: `0.5px solid ${isAchieved ? 'var(--color-primary)' : 'var(--color-border)'}`, flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: isAchieved ? 'var(--color-primary)' : 'var(--color-text-primary)', margin: 0 }}>
                          {c.card_name?.replace(' 체크카드', '')}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                          {isAchieved ? '전월 실적 달성 완료' : `실적 ${performance.toLocaleString()} / ${PERFORMANCE_GOAL.toLocaleString()}`}
                        </p>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: isAchieved ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                        {benefit.toLocaleString()}원 적립
                      </span>
                    </div>
                    {!isAchieved && (
                      <div style={{ marginTop: '6px', height: '3px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min((performance / PERFORMANCE_GOAL) * 100, 100)}%`, background: c.color || 'var(--color-primary)', borderRadius: '999px' }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '0.5px solid var(--color-border)', marginTop: '8px', flexShrink: 0 }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-primary)' }}>이번달 총 혜택</span>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-primary)' }}>
                {userCards.reduce((sum, c) => sum + getCardBenefit(c), 0).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 카테고리별 예산 + 예산 소진 현황 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

          {/* 카테고리별 예산 */}
          <div style={{ ...card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 }}>
              <h3 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)' }}>카테고리별 예산</h3>
              <button onClick={openBudgetModal} style={btnOutline}>
                <MdTune size={14} /> 예산 설정
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
              {ALL_CATEGORIES.map(cat => {
                const amount = currentBudgets[cat] || 0
                const Meta = categoryMeta[cat]
                const Icon = Meta?.icon || MdRestaurant
                return (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: Meta?.bg || '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={12} color={Meta?.color || '#888'} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{cat}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: amount > 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                      {amount > 0 ? `${amount.toLocaleString()}원` : '미설정'}
                    </span>
                  </div>
                )
              })}
            </div>
            {totalBudget > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '0.5px solid var(--color-border)', marginTop: '8px', flexShrink: 0 }}>
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>총 예산</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-primary)' }}>{totalBudget.toLocaleString()}원</span>
              </div>
            )}
          </div>

          {/* 예산 소진 현황 */}
          <div style={{ ...card }}>
            <h3 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '12px', flexShrink: 0, height: '30px', display: 'flex', alignItems: 'center' }}>예산 소진 현황</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
              {ALL_CATEGORIES.map(cat => {
                const budget = currentBudgets[cat] || 0
                const spent = getCategoryTotal(cat)
                const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
                const Meta = categoryMeta[cat]
                const Icon = Meta?.icon || MdRestaurant
                const isOver = budget > 0 && spent > budget
                return (
                  <div key={cat} style={{ padding: '5px 10px', background: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Icon size={11} color={Meta?.color || '#888'} />
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{cat}</span>
                        {isOver && <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: '500' }}>초과</span>}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                        {spent.toLocaleString()} / {budget > 0 ? budget.toLocaleString() : '-'}원
                      </span>
                    </div>
                    <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percent}%`, background: isOver ? '#ef4444' : (Meta?.color || '#888'), borderRadius: '999px', transition: 'width 0.4s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '0.5px solid var(--color-border)', marginTop: '8px', flexShrink: 0 }}>
  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
    총 소진 {totalSpent.toLocaleString()}원 / {totalBudget > 0 ? totalBudget.toLocaleString() : '-'}원
  </span>
</div>
{isCloseToOverBudget && (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', color: '#ef4444', fontSize: '11px', fontWeight: '500', flexShrink: 0 }}>
    <MdWarning size={13} />
    일부 카테고리 예산 초과 또는 임박 상태
  </div>
)}
          </div>
        </div>
      </div>

      {/* 3번: 예산 모달 - 5개 한번에 */}
      {isBudgetModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          onClick={() => setIsBudgetModalOpen(false)}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '360px' }} onClick={e => e.stopPropagation()}>
            <h4 style={{ fontSize: '15px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '4px' }}>월 예산 설정</h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>카테고리별 이번달 예산을 입력해주세요</p>
            <form onSubmit={submitBudget} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ALL_CATEGORIES.map(cat => {
                const Meta = categoryMeta[cat]
                const Icon = Meta?.icon || MdRestaurant
                return (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '72px', flexShrink: 0 }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: Meta?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={11} color={Meta?.color} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{cat}</span>
                    </div>
                    <input
                      type="number"
                      placeholder="0"
                      value={budgetForm[cat]}
                      onChange={e => setBudgetForm(p => ({ ...p, [cat]: e.target.value }))}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', flexShrink: 0 }}>원</span>
                  </div>
                )
              })}
              {/* 총 금액 실시간 표시 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '0.5px solid var(--color-border)' }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>총 예산</span>
              <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--color-primary)' }}>
                {ALL_CATEGORIES.reduce((sum, cat) => sum + (Number(budgetForm[cat]) || 0), 0).toLocaleString()}원
              </span>
            </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsBudgetModalOpen(false)}
                  style={{ flex: 1, padding: '10px', background: '#F9FAFB', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                  취소
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2번: 소비 내역 추가 / 수정 모달 */}
      {isExpenseModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          onClick={handleCloseExpenseModal}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', width: '360px' }} onClick={e => e.stopPropagation()}>
            <h4 style={{ fontSize: '15px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '14px' }}>
              {editingExpense ? '소비 내역 수정' : '소비 내역 추가'}
            </h4>
            <form onSubmit={submitExpense} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>사용처</label>
                <input type="text" placeholder="예: OO 김밥, CGV 영화" value={expenseForm.place}
                  onChange={e => setExpenseForm(p => ({ ...p, place: e.target.value }))}
                  style={inputStyle} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>카테고리</label>
                  <select value={expenseForm.category} onChange={e => setExpenseForm(p => ({ ...p, category: e.target.value }))}
                    style={inputStyle}>
                    {ALL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>결제 카드</label>
                  <select value={expenseForm.card} onChange={e => setExpenseForm(p => ({ ...p, card: e.target.value }))}
                    style={{ ...inputStyle, background: 'white' }}>
                    <option value="">카드 선택</option>
                    {userCards.map(card => <option key={card.id} value={card.card_name}>{card.card_name}</option>)}
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>금액 (원)</label>
                  <input type="number" placeholder="금액 입력" value={expenseForm.amount}
                    onChange={e => setExpenseForm(p => ({ ...p, amount: e.target.value }))}
                    style={inputStyle} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>소비 일자</label>
                  <input type="date" value={expenseForm.date}
                    onChange={e => setExpenseForm(p => ({ ...p, date: e.target.value }))}
                    max={new Date().toISOString().split('T')[0]}
                    style={inputStyle} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button type="button" onClick={handleCloseExpenseModal}
                  style={{ flex: 1, padding: '9px', background: '#F9FAFB', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                  취소
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '9px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                  {editingExpense ? '수정하기' : '추가하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'default' })}
      />
    </div>
  )
}