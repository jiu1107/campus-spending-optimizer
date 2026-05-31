import { MdCreditCard, MdCheckCircle, MdAccessTime, MdRestaurant, MdLocalCafe, MdStorefront, MdTheaters, MdShoppingBag, MdAutoAwesome, MdTrendingUp } from 'react-icons/md'

const categoryMeta = {
  식비: { icon: MdRestaurant, color: '#EF9F27', bg: '#FFF7E6' },
  카페: { icon: MdLocalCafe, color: '#7F77DD', bg: '#F3F2FF' },
  편의점: { icon: MdStorefront, color: '#D4537E', bg: '#FFF0F5' },
  문화: { icon: MdTheaters, color: '#1D9E75', bg: '#E8FBF4' },
  쇼핑: { icon: MdShoppingBag, color: '#378ADD', bg: '#EBF4FF' },
}

export default function Performance({
  expenses = [],
  currentDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
  userCards = [],
}) {
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
    Object.entries(card.benefits || {}).reduce((total, [cat, rate]) => {
      const spent = monthlyExpenses
        .filter(exp => exp.category === cat && exp.card && exp.card.includes(card.card_name.replace(' 체크카드', '')))
        .reduce((sum, exp) => sum + exp.amount, 0)
      return total + Math.round(spent * rate / 100)
    }, 0)

  const getCardBenefitDetails = (card) =>
    Object.entries(card.benefits || {})
      .filter(([, rate]) => rate > 0)
      .map(([cat, rate]) => {
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

  // 카드 수에 따라 그리드 컬럼 결정
  const getGridCols = (count) => {
    if (count === 1) return '1fr'
    if (count === 3) return 'repeat(3, 1fr)'
    return 'repeat(2, 1fr)'
  }

  // 카드 수에 따라 내부 패딩/폰트 크기 조절
  const isCompact = userCards.length >= 3

  return (
    <div style={{ background: 'var(--color-bg)', height: 'calc(100vh - 56px)', padding: '20px 40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minHeight: 0 }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h1 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
            {currentDate.year}년 {String(currentDate.month).padStart(2, '0')}월 실적 현황
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', background: 'white', padding: '6px 12px', borderRadius: '20px', border: '0.5px solid var(--color-border)' }}>
            <MdAccessTime size={14} />
            남은 기간 {remainingDays}일
          </div>
        </div>

        {/* 카드 없을 때 */}
        {userCards.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid var(--color-border)', padding: '48px 24px', textAlign: 'center', flex: 1 }}>
            <MdCreditCard size={40} color="#d1d5db" style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '4px' }}>등록된 카드가 없습니다</p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>마이페이지에서 카드를 먼저 등록해 주세요</p>
          </div>
        ) : (
          <>
            {/* 카드 목록 - flex: 1로 남은 공간 채움 */}
            <div style={{ display: 'grid', gridTemplateColumns: getGridCols(userCards.length), gap: '12px', flex: 1, minHeight: 0 }}>
              {userCards.map(card => {
                const cardSpent = getCardSpent(card)
                const achievementRate = Math.min(Math.round((cardSpent / PERFORMANCE_GOAL) * 100), 100)
                const isAchieved = cardSpent >= PERFORMANCE_GOAL
                const remainingAmount = Math.max(PERFORMANCE_GOAL - cardSpent, 0)
                const benefitDetails = getCardBenefitDetails(card)
                const suggestions = getSuggestions(card, cardSpent)
                const pad = isCompact ? '14px' : '18px'

                return (
                  <div key={card.id} style={{
                    background: 'white', borderRadius: '12px',
                    border: isAchieved ? '1.5px solid var(--color-primary)' : '0.5px solid var(--color-border)',
                    padding: pad, display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden'
                  }}>
                    {/* 카드 헤더 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                      <div>
                        <p style={{ fontSize: isCompact ? '13px' : '15px', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                          {card.card_name.replace(' 체크카드', '')}
                        </p>
                        <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)', margin: 0 }}>
                          혜택 발동 조건: 월 {(PERFORMANCE_GOAL / 10000).toFixed(0)}만원
                        </p>
                      </div>
                      {isAchieved ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: '600', fontSize: '11px', background: 'var(--color-primary-light)', padding: '3px 8px', borderRadius: '999px', flexShrink: 0 }}>
                          <MdCheckCircle size={13} />
                          달성 완료
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: '600', fontSize: '11px', background: '#fffbeb', padding: '3px 8px', borderRadius: '999px', flexShrink: 0 }}>
                          <MdAccessTime size={13} />
                          진행중
                        </div>
                      )}
                    </div>

                    {/* 달성 금액 + 게이지 */}
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>달성 금액</span>
                        <span style={{ fontSize: isCompact ? '11px' : '12px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                          {cardSpent.toLocaleString()}원
                          <span style={{ color: 'var(--color-text-secondary)', fontWeight: '400' }}> / {PERFORMANCE_GOAL.toLocaleString()}원</span>
                        </span>
                      </div>
                      <div style={{ height: '5px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${achievementRate}%`, background: isAchieved ? 'var(--color-primary)' : (card.color || 'var(--color-primary)'), borderRadius: '999px', transition: 'width 0.5s ease-out' }} />
                      </div>
                    </div>

                    {/* 달성/미달성 내용 - flex: 1로 남은 공간 채움 */}
                    <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                      {isAchieved ? (
                        <div style={{ background: 'var(--color-primary-light)', borderRadius: '8px', padding: '10px 12px', height: '100%', boxSizing: 'border-box' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-primary)', fontSize: '11px', fontWeight: '600', marginBottom: benefitDetails.length > 0 ? '8px' : '0' }}>
                            <MdAutoAwesome size={13} />
                            이번달 혜택이 활성화됐어요!
                          </div>
                          {benefitDetails.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>이번달 혜택 내역</p>
                              {benefitDetails.map(d => {
                                const Meta = categoryMeta[d.cat]
                                const Icon = Meta?.icon || MdRestaurant
                                return (
                                  <div key={d.cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px', background: 'white', borderRadius: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                      <Icon size={11} color={Meta?.color || '#888'} />
                                      <span style={{ fontSize: '10px', color: 'var(--color-text-primary)' }}>{d.cat} {d.rate}% 적립</span>
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-primary)' }}>+{d.earned.toLocaleString()}원</span>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: '100%' }}>
                          <div style={{ background: '#fffbeb', borderRadius: '8px', padding: '9px 12px', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#d97706', fontSize: '11px', fontWeight: '600', marginBottom: '1px' }}>
                              <MdTrendingUp size={12} />
                              혜택 발동까지 {remainingAmount.toLocaleString()}원 남았어요
                            </div>
                            <p style={{ fontSize: '10px', color: '#92400e', margin: 0 }}>남은 기간 {remainingDays}일</p>
                          </div>
                          {suggestions.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                              <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>소비 방향 제안</p>
                              {suggestions.map((s, i) => {
                                const Meta = categoryMeta[s.cat]
                                const Icon = Meta?.icon || MdRestaurant
                                return (
                                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 8px', background: '#F9FAFB', borderRadius: '7px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                                    <Icon size={11} color={Meta?.color || '#888'} />
                                    {s.cat} 일 {s.dailyRemaining.toLocaleString()}원 추가 소비
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 이번달 혜택 요약 - 하단 고정 */}
            <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid var(--color-border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', flexShrink: 0 }}>
              {[
                { label: '총 적립 예정', value: `${totalBenefit.toLocaleString()}원`, color: 'var(--color-primary)' },
                { label: '달성 완료 카드', value: `${achievedCards.length}개`, color: '#059669' },
                { label: '진행중 카드', value: `${inProgressCards.length}개`, color: '#d97706' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '14px 24px', borderRight: i < 2 ? '0.5px solid var(--color-border)' : 'none', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{item.label}</p>
                  <p style={{ fontSize: '18px', fontWeight: '800', color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}