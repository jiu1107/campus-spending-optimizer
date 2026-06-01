import { useState, useEffect } from 'react';
import { MdRestaurant, MdLocalCafe, MdStorefront, MdTheaters, MdShoppingBag, MdDelete, MdWarning, MdTune, MdPlaylistAdd, MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { getConsumptions, createConsumption, deleteConsumption } from '../api/consumption'
import Toast from '../components/Toast'

const categoryMeta = {
  식비: { icon: MdRestaurant, color: '#EF9F27', bg: '#FFF7E6' },
  카페: { icon: MdLocalCafe, color: '#7F77DD', bg: '#F3F2FF' },
  편의점: { icon: MdStorefront, color: '#D4537E', bg: '#FFF0F5' },
  문화: { icon: MdTheaters, color: '#1D9E75', bg: '#E8FBF4' },
  쇼핑: { icon: MdShoppingBag, color: '#378ADD', bg: '#EBF4FF' },
}

export default function ConsumptionAnalysisView({
  currentBudgets = {},
  currentDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
  onAddBudget,
  userCards = [],
  onNavigateMonth,
}) {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('전체')
  const [budgetForm, setBudgetForm] = useState({ category: '식비', amount: '' })
  const [expenseForm, setExpenseForm] = useState({ place: '', category: '식비', amount: '', card: '', date: new Date().toISOString().split('T')[0] })
  const [expenses, setExpenses] = useState([])
  const [toast, setToast] = useState({ show: false, message: '', type: 'default' })

  const showToast = (message, type = 'default') => {
    setToast({ show: true, message, type })
  }

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

  const currentYearMonthStr = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`
  const monthlyExpenses = expenses.filter(exp => exp.date.startsWith(currentYearMonthStr))
  const filteredExpenses = monthlyExpenses.filter(exp => selectedFilter === '전체' || exp.category === selectedFilter)
  const getCategoryTotal = (cat) => monthlyExpenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
  const totalBudget = Object.values(currentBudgets).reduce((sum, val) => sum + val, 0)
  const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const remainingBudget = totalBudget - totalSpent

  const PERFORMANCE_GOAL = 300000
  const getCardBenefit = (card) => {
    const cardExpenses = monthlyExpenses.filter(exp =>
      exp.card && exp.card.includes(card.card_name?.replace(' 체크카드', '') || '')
    )
    return Object.entries(card.benefits || {}).reduce((total, [cat, rate]) => {
      const catTotal = cardExpenses
        .filter(exp => exp.category === cat)
        .reduce((sum, exp) => sum + exp.amount, 0)
      return total + Math.round(catTotal * rate / 100)
    }, 0)
  }

  const getCardPerformance = (card) => monthlyExpenses
    .filter(exp => exp.card && exp.card.includes(card.card_name?.replace(' 체크카드', '') || ''))
    .reduce((sum, exp) => sum + exp.amount, 0)

  const submitBudget = (e) => {
    e.preventDefault()
    if (!budgetForm.amount) return
    onAddBudget(budgetForm.category, Number(budgetForm.amount))
    setBudgetForm({ category: '식비', amount: '' })
    setIsBudgetModalOpen(false)
  }

  const submitExpense = async (e) => {
    e.preventDefault()
    if (!expenseForm.place || !expenseForm.amount || !expenseForm.date) return
    try {
      await createConsumption(expenseForm)
      const data = await getConsumptions(currentDate.year, currentDate.month)
      setExpenses(data)
      setExpenseForm({ place: '', category: '식비', amount: '', card: '', date: new Date().toISOString().split('T')[0] })
      setIsExpenseModalOpen(false)
    } catch (err) {
      console.error('소비 내역 추가 실패:', err)
      showToast('소비 내역 추가에 실패했습니다.', 'error')
    }
  }

  const isCloseToOverBudget = Object.keys(currentBudgets).some(cat => {
    const budget = currentBudgets[cat]
    if (budget === 0) return false
    return (getCategoryTotal(cat) / budget) >= 0.8
  })

  const groupedExpenses = filteredExpenses.reduce((acc, exp) => {
    if (!acc[exp.date]) acc[exp.date] = []
    acc[exp.date].push(exp)
    return acc
  }, {})

  // 공통 스타일
  const card = {
    background: '#fff',
    borderRadius: '12px',
    border: '0.5px solid var(--color-border)',
    padding: '18px',
    minHeight: '260px',
    display: 'flex',
    flexDirection: 'column',
  }

  const btnPrimary = {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '6px 16px', height: '30px',
    background: 'var(--color-primary)',
    color: 'white', border: 'none',
    borderRadius: '8px', fontSize: '12px',
    fontWeight: '500', cursor: 'pointer',
    letterSpacing: '-0.2px', whiteSpace: 'nowrap',
  }

  const btnOutline = {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '6px 12px', height: '30px',
    background: 'white',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-primary)',
    borderRadius: '8px', fontSize: '12px',
    fontWeight: '500', cursor: 'pointer',
    letterSpacing: '-0.2px', whiteSpace: 'nowrap',
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - 56px)', padding: '24px 40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-text-primary)' }}>소비 패턴 분석</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                const now = new Date()
                const isPast = currentDate.year < now.getFullYear() ||
                  (currentDate.year === now.getFullYear() && currentDate.month > 1)
                if (!isPast) {
                  showToast('최대 1년 전까지만 확인할 수 있어요', 'warning')
                  return
                }
                onNavigateMonth?.(-1)
              }}
              style={{
                width: '28px', height: '28px', borderRadius: '8px',
                border: '0.5px solid var(--color-border)',
                background: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-secondary)',
              }}
            ><MdChevronLeft size={18} /></button>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
              {currentDate.year}년 {String(currentDate.month).padStart(2, '0')}월
            </span>
            <button
              onClick={() => {
                const now = new Date()
                if (currentDate.year >= now.getFullYear() && currentDate.month >= now.getMonth() + 1) {
                  showToast('이번 달이 가장 최근이에요', 'warning')
                  return
                }
                onNavigateMonth?.(1)
              }}
              style={{
                width: '28px', height: '28px', borderRadius: '8px',
                border: '0.5px solid var(--color-border)',
                background: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-secondary)',
              }}
            ><MdChevronRight size={18} /></button>
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

        {/* 상단 섹션: 소비 내역 + 카드별 혜택 달성도 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

          {/* 소비 내역 */}
          <div style={{ ...card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)' }}>소비 내역</h3>
                <select value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)}
                  style={{ fontSize: '11px', border: '0.5px solid var(--color-border)', borderRadius: '6px', padding: '2px 6px', background: '#F9FAFB', color: 'var(--color-text-secondary)', outline: 'none' }}>
                  <option value="전체">카테고리 ▾</option>
                  {Object.keys(categoryMeta).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button onClick={() => setIsExpenseModalOpen(true)} style={btnPrimary}>
                <MdPlaylistAdd size={15} /> 내역 추가
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto', maxHeight: '180px' }}>
              {Object.keys(groupedExpenses).length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>소비 내역이 없습니다.</p>
                </div>
              ) : Object.entries(groupedExpenses).sort(([a], [b]) => b.localeCompare(a)).map(([date, exps]) => (
                <div key={date}>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '500', padding: '5px 2px 2px' }}>
                    {currentDate.month}월 {new Date(date).getDate()}일 {exps[0]?.day || ''}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{exp.amount.toLocaleString()}원</span>
                          <button
                            onClick={async () => {
                              try {
                                await deleteConsumption(exp.id)
                                setExpenses(prev => prev.filter(e => e.id !== exp.id))
                              } catch (err) {
                                console.error('삭제 실패:', err)
                                showToast('삭제에 실패했습니다.', 'error')
                              }
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px' }}
                          >
                            <MdDelete size={13} color='rgb(239, 68, 68)' />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
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

        {/* 하단 섹션: 카테고리별 예산 + 예산 소진 현황 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

          {/* 카테고리별 예산 */}
          <div style={{ ...card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 }}>
              <h3 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)' }}>카테고리별 예산</h3>
              <button onClick={() => setIsBudgetModalOpen(true)} style={btnOutline}>
                <MdTune size={14} /> 추가 / 수정
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
              {Object.keys(currentBudgets).length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>추가 버튼을 눌러 예산을 설정해보세요!</p>
                </div>
              ) : Object.entries(currentBudgets).map(([cat, amount]) => {
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
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{amount.toLocaleString()}원</span>
                  </div>
                )
              })}
            </div>
            {Object.keys(currentBudgets).length > 0 && (
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
              {Object.keys(currentBudgets).length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>예산을 먼저 설정해주세요</p>
                </div>
              ) : Object.entries(currentBudgets).map(([cat, budget]) => {
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
                      <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{spent.toLocaleString()} / {budget.toLocaleString()}원</span>
                    </div>
                    <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percent}%`, background: isOver ? '#ef4444' : (Meta?.color || '#888'), borderRadius: '999px', transition: 'width 0.4s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
            {isCloseToOverBudget && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', color: '#ef4444', fontSize: '11px', fontWeight: '500', flexShrink: 0 }}>
                <MdWarning size={13} />
                일부 카테고리 예산 초과 또는 임박 상태
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 예산 모달 */}
      {isBudgetModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', width: '340px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '14px' }}>카테고리 예산 추가 / 변경</h4>
            <form onSubmit={submitBudget} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>카테고리</label>
                <select value={budgetForm.category} onChange={e => setBudgetForm(p => ({ ...p, category: e.target.value }))}
                  style={{ width: '100%', padding: '8px 10px', border: '0.5px solid var(--color-border)', borderRadius: '8px', fontSize: '13px', outline: 'none' }}>
                  {Object.keys(categoryMeta).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>예산 금액 (원)</label>
                <input type="number" placeholder="예: 150000" value={budgetForm.amount} onChange={e => setBudgetForm(p => ({ ...p, amount: e.target.value }))}
                  style={{ width: '100%', padding: '8px 10px', border: '0.5px solid var(--color-border)', borderRadius: '8px', fontSize: '13px', outline: 'none' }} required />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button type="button" onClick={() => setIsBudgetModalOpen(false)}
                  style={{ flex: 1, padding: '9px', background: '#F9FAFB', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>취소</button>
                <button type="submit"
                  style={{ flex: 1, padding: '9px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>적용하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 소비 내역 추가 모달 */}
      {isExpenseModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', width: '360px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '14px' }}>소비 내역 추가</h4>
            <form onSubmit={submitExpense} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>사용처</label>
                <input type="text" placeholder="예: OO 김밥, CGV 영화" value={expenseForm.place} onChange={e => setExpenseForm(p => ({ ...p, place: e.target.value }))}
                  style={{ width: '100%', padding: '8px 10px', border: '0.5px solid var(--color-border)', borderRadius: '8px', fontSize: '13px', outline: 'none' }} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>카테고리</label>
                  <select value={expenseForm.category} onChange={e => setExpenseForm(p => ({ ...p, category: e.target.value }))}
                    style={{ width: '100%', padding: '8px 10px', border: '0.5px solid var(--color-border)', borderRadius: '8px', fontSize: '13px', outline: 'none' }}>
                    {Object.keys(categoryMeta).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>결제 카드</label>
                  <select value={expenseForm.card} onChange={e => setExpenseForm(p => ({ ...p, card: e.target.value }))}
                    style={{ width: '100%', padding: '8px 10px', border: '0.5px solid var(--color-border)', borderRadius: '8px', fontSize: '13px', outline: 'none', background: 'white' }}>
                    <option value="">카드 선택</option>
                    {userCards.map(card => (
                      <option key={card.id} value={card.card_name}>{card.card_name}</option>
                    ))}
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>금액 (원)</label>
                  <input type="number" placeholder="금액 입력" value={expenseForm.amount} onChange={e => setExpenseForm(p => ({ ...p, amount: e.target.value }))}
                    style={{ width: '100%', padding: '8px 10px', border: '0.5px solid var(--color-border)', borderRadius: '8px', fontSize: '13px', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>소비 일자</label>
                  <input type="date" value={expenseForm.date}
                    onChange={e => setExpenseForm(p => ({ ...p, date: e.target.value }))}
                    max={new Date().toISOString().split('T')[0]}
                    style={{ width: '100%', padding: '8px 10px', border: '0.5px solid var(--color-border)', borderRadius: '8px', fontSize: '13px', outline: 'none' }} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button type="button" onClick={() => setIsExpenseModalOpen(false)}
                  style={{ flex: 1, padding: '9px', background: '#F9FAFB', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>취소</button>
                <button type="submit"
                  style={{ flex: 1, padding: '9px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>추가하기</button>
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