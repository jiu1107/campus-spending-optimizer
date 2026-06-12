import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdCreditCard, MdCheckCircle, MdAccessTime, MdRestaurant, MdLocalCafe, MdStorefront, MdTheaters, MdShoppingBag, MdAutoAwesome, MdTrendingUp} from 'react-icons/md'

const categoryMeta = {
  식비: { icon: MdRestaurant, color: '#EF9F27', bg: '#FFF7E6' },
  카페: { icon: MdLocalCafe, color: '#7F77DD', bg: '#F3F2FF' },
  편의점: { icon: MdStorefront, color: '#D4537E', bg: '#FFF0F5' },
  문화: { icon: MdTheaters, color: '#1D9E75', bg: '#E8FBF4' },
  쇼핑: { icon: MdShoppingBag, color: '#378ADD', bg: '#EBF4FF' },
}

export default function Performance({
  currentDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
  userCards = [],
}) {
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { getConsumptions } = await import('../api/consumption')
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
  const PERFORMANCE_GOAL = 300000

  const getCardSpent = (card) =>
    monthlyExpenses
      .filter(exp => exp.card && (
        exp.card.includes(card.card_name) ||
        exp.card.includes(card.card_name.replace(' 체크카드', ''))
      ))
      .reduce((sum, exp) => sum + exp.amount, 0)

  const getCardBenefit = (card) =>
  Object.entries(card.benefits || {}).reduce((total, [cat, val]) => {
    const rate = typeof val === 'object' ? val?.rate : val
    if (!rate) return total
    const spent = monthlyExpenses
      .filter(exp => exp.category === cat && exp.card && exp.card.includes(card.card_name.replace(' 체크카드', '')))
      .reduce((sum, exp) => sum + exp.amount, 0)
    return total + Math.round(spent * rate / 100)
  }, 0)

  const getCardBenefitDetails = (card) =>
  Object.entries(card.benefits || {})
    .filter(([, val]) => {
      const rate = typeof val === 'object' ? val?.rate : val
      return rate > 0
    })
    .map(([cat, val]) => {
      const rate = typeof val === 'object' ? val?.rate : val
      const spent = monthlyExpenses
        .filter(exp => exp.category === cat && exp.card && exp.card.includes(card.card_name.replace(' 체크카드', '')))
        .reduce((sum, exp) => sum + exp.amount, 0)
      return { cat, rate, spent, earned: Math.round(spent * rate / 100) }
    })
      .filter(d => d.earned > 0)

  const getSuggestions = (card, cardSpent) => {
    const remaining = PERFORMANCE_GOAL - cardSpent
    if (remaining <= 0) return []
    const today = new Date()
    const lastDay = new Date(currentDate.year, currentDate.month, 0).getDate()
    const remainingDays = Math.max(lastDay - today.getDate(), 1)
    const dailyRemaining = Math.round(remaining / remainingDays)
    return Object.entries(card.benefits || {})
      .filter(([, rate]) => rate > 0)
      .slice(0, 2)
      .map(([cat, rate]) => ({ cat, rate, dailyRemaining }))
  }

  const achievedCards = userCards.filter(c => getCardSpent(c) >= PERFORMANCE_GOAL)
  const inProgressCards = userCards.filter(c => getCardSpent(c) < PERFORMANCE_GOAL)
  const totalBenefit = userCards.reduce((sum, c) => sum + getCardBenefit(c), 0)

  const today = new Date()
  const lastDay = new Date(currentDate.year, currentDate.month, 0).getDate()
  const remainingDays = Math.max(lastDay - today.getDate(), 0)
  const navigate = useNavigate()

  const getGridCols = (count) => {
    if (count === 1) return '1fr'
    if (count === 3) return 'repeat(3, 1fr)'
    return 'repeat(2, 1fr)'
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - 56px)', padding: '24px 40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-text-primary)', margin: 0 }}>
            {currentDate.year}년 {String(currentDate.month).padStart(2, '0')}월 실적 현황
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', background: 'white', padding: '4px 14px', borderRadius: '20px', border: '0.5px solid var(--color-border)' }}>
            <MdAccessTime size={15} />
            남은 기간 {remainingDays}일
          </div>
        </div>

        {/* 카드 없을 때 */}
        {userCards.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid var(--color-border)', padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <MdCreditCard size={40} color="#d1d5db" />
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)' }}>등록된 카드가 없어요</p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>카드를 등록하면 실적 현황을 확인할 수 있어요</p>
            <button
              onClick={() => navigate('/mypage')}
              style={{ marginTop: '8px', padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
            >
              카드 등록하러 가기
            </button>
          </div>
        ) : (
          <>
            {/* 카드 목록 */}
            <div style={{ display: 'grid', gridTemplateColumns: getGridCols(userCards.length), gap: '14px' }}>
              {userCards.map(card => {
                const cardSpent = getCardSpent(card)
                const achievementRate = Math.min(Math.round((cardSpent / PERFORMANCE_GOAL) * 100), 100)
                const isAchieved = cardSpent >= PERFORMANCE_GOAL
                const remainingAmount = Math.max(PERFORMANCE_GOAL - cardSpent, 0)
                const benefitDetails = getCardBenefitDetails(card)
                const suggestions = getSuggestions(card, cardSpent)

                return (
                  <div key={card.id} style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: isAchieved ? '1.5px solid var(--color-primary)' : '0.5px solid var(--color-border)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}>
                    {/* 카드 헤더 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
                          {card.card_name.replace(' 체크카드', '')}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                          혜택 발동 조건: 월 {(PERFORMANCE_GOAL / 10000).toFixed(0)}만원
                        </p>
                      </div>
                      {isAchieved ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: '500', fontSize: '12px', background: 'var(--color-primary-light)', padding: '4px 10px', borderRadius: '999px', flexShrink: 0 }}>
                          <MdCheckCircle size={14} />
                          달성 완료
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: '500', fontSize: '12px', background: '#fffbeb', padding: '4px 10px', borderRadius: '999px', flexShrink: 0 }}>
                          <MdAccessTime size={14} />
                          진행중
                        </div>
                      )}
                    </div>

                    {/* 달성 금액 + 게이지 */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>달성 금액</span>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
                          {cardSpent.toLocaleString()}원
                          <span style={{ color: 'var(--color-text-secondary)', fontWeight: '400' }}> / {PERFORMANCE_GOAL.toLocaleString()}원</span>
                        </span>
                      </div>
                      <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${achievementRate}%`, background: isAchieved ? 'var(--color-primary)' : (card.color || 'var(--color-primary)'), borderRadius: '999px', transition: 'width 0.5s ease-out' }} />
                      </div>
                    </div>

                    {/* 달성/미달성 내용 */}
                    {isAchieved ? (
                      <div style={{ background: 'var(--color-primary-light)', borderRadius: '10px', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '13px', fontWeight: '500', marginBottom: benefitDetails.length > 0 ? '10px' : '0' }}>
                          <MdAutoAwesome size={15} />
                          이번달 혜택이 활성화됐어요!
                        </div>
                        {benefitDetails.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>이번달 혜택 내역</p>
                            {benefitDetails.map(d => {
                              const Meta = categoryMeta[d.cat]
                              const Icon = Meta?.icon || MdRestaurant
                              return (
                                <div key={d.cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'white', borderRadius: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Icon size={13} color={Meta?.color || '#888'} />
                                    <span style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>{d.cat} {d.rate}% 적립</span>
                                  </div>
                                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-primary)' }}>+{d.earned.toLocaleString()}원</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ background: '#fffbeb', borderRadius: '10px', padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                            <MdTrendingUp size={15} />
                            혜택 발동까지 {remainingAmount.toLocaleString()}원 남았어요
                          </div>
                          <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>남은 기간 {remainingDays}일</p>
                        </div>
                        {suggestions.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>소비 방향 제안</p>
                            {suggestions.map((s, i) => {
                              const Meta = categoryMeta[s.cat]
                              const Icon = Meta?.icon || MdRestaurant
                              return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#F9FAFB', borderRadius: '8px', fontSize: '12px', color: 'var(--color-text-secondary)', border: '0.5px solid var(--color-border)' }}>
                                  <Icon size={13} color={Meta?.color || '#888'} />
                                  하루 {s.dailyRemaining.toLocaleString()}원 {s.cat} 소비 시 실적 달성 가능해요
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 이번달 혜택 요약 */}
            <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid var(--color-border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[
                { label: '총 적립 예정', value: `${totalBenefit.toLocaleString()}원`, color: 'var(--color-primary)' },
                { label: '달성 완료 카드', value: `${achievedCards.length}개`, color: '#059669' },
                { label: '진행중 카드', value: `${inProgressCards.length}개`, color: '#d97706' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px 24px', borderRight: i < 2 ? '0.5px solid var(--color-border)' : 'none', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>{item.label}</p>
                  <p style={{ fontSize: '22px', fontWeight: '500', color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}