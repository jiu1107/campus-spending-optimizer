import { useNavigate } from 'react-router-dom'
import {
  MdLocationOn, MdCreditCard, MdBarChart,
  MdEmojiEvents, MdArrowForward, MdTrendingUp,
  MdAttachMoney, MdAutoAwesome,
  MdRestaurant, MdLocalCafe, MdStorefront,
  MdTheaters, MdShoppingBag, MdNotifications
} from 'react-icons/md'
import styles from './Home.module.css'
import campusMap from '../assets/img/campus_map.png'

const CATEGORY_ICONS = {
  식비: MdRestaurant,
  카페: MdLocalCafe,
  편의점: MdStorefront,
  문화: MdTheaters,
  쇼핑: MdShoppingBag,
}

const CATEGORY_COLORS = {
  식비: '#EF9F27',
  카페: '#7F77DD',
  편의점: '#D4537E',
  문화: '#1D9E75',
  쇼핑: '#378ADD',
}

const PERFORMANCE_GOAL = 300000

function Home({ currentBudgets = {}, currentDate, userCards = [], expenses = [] }) {
  const navigate = useNavigate()
  const nickname = localStorage.getItem('nickname') || '사용자'

  // 이번달 소비 내역만 필터링
  const currentYearMonthStr = currentDate
    ? `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`
    : ''
  const monthlyExpenses = expenses.filter(exp => exp.date?.startsWith(currentYearMonthStr))

  // 카테고리별 소비 합산
  const categorySpend = monthlyExpenses.reduce((acc, exp) => {
    if (exp.category) acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {})

  // 총 지출
  const totalSpend = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalBudget = Object.values(currentBudgets).reduce((sum, v) => sum + v, 0)
  const savedAmount = Math.max(totalBudget - totalSpend, 0)

  // 달성 완료 카드 (실적 300,000원 이상)
  const getCardSpent = (card) =>
    monthlyExpenses
      .filter(exp => exp.card && (
        exp.card.includes(card.card_name) ||
        exp.card.includes(card.card_name?.replace(' 체크카드', '') || '')
      ))
      .reduce((sum, exp) => sum + exp.amount, 0)

  const achievedCards = userCards.filter(c => getCardSpent(c) >= PERFORMANCE_GOAL)

  // 실적에 가장 근접한 카드 (달성률 높은 순)
  const closestCard = userCards.length > 0
    ? [...userCards].sort((a, b) => getCardSpent(b) - getCardSpent(a))[0]
    : null
  const closestCardSpent = closestCard ? getCardSpent(closestCard) : 0

  const today = new Date()
  const lastDay = new Date(currentDate?.year, currentDate?.month, 0).getDate()
  const remainingDays = Math.max(lastDay - today.getDate(), 0)

  // 전체 5개 카테고리 고정 표시 (예산 미설정 시 0)
  const ALL_CATEGORIES = ['식비', '카페', '편의점', '문화', '쇼핑']
  const topCategories = ALL_CATEGORIES.map(cat => ({
    cat,
    amount: categorySpend[cat] || 0,
    budget: currentBudgets[cat] || 0,
  }))

  // 카드 추천 - 가장 예상 혜택 높은 카드
  const topCard = userCards.length > 0 ? userCards.reduce((best, card) => {
    const totalBenefit = Object.entries(card.benefits || {}).reduce((sum, [cat, rate]) => {
      return sum + Math.round((categorySpend[cat] || 0) * rate / 100)
    }, 0)
    return totalBenefit > (best.benefit || 0) ? { ...card, benefit: totalBenefit } : best
  }, { benefit: 0 }) : null

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* 헤더 */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.greeting}>
              안녕하세요 <span className={styles.userName}>{nickname}</span>님
            </h1>
            <p className={styles.greetingSub}>이번달 소비 현황을 확인해보세요</p>
          </div>
          <button className={styles.notifyBtn} onClick={() => navigate('/mypage')}>
            <MdNotifications size={20} />
          </button>
        </div>

        {/* 상단 요약 카드 3개 */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>총 지출</p>
            <p className={styles.summaryValue}>{totalSpend.toLocaleString()}원</p>
            <div className={`${styles.summaryBadge} ${styles.badgeUp}`}>
              <MdTrendingUp size={12} />
              {currentDate?.month}월 누적 소비
            </div>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>이번달 절약 금액</p>
            <p className={`${styles.summaryValue} ${styles.valuePrimary}`}>{savedAmount.toLocaleString()}원</p>
            <div className={`${styles.summaryBadge} ${styles.badgeDown}`}>
              <MdAttachMoney size={12} />
              예산 대비 절약
            </div>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>달성 완료 카드</p>
            <p className={`${styles.summaryValue} ${styles.valueSuccess}`}>{achievedCards.length}개</p>
            <div className={`${styles.summaryBadge} ${styles.badgeSuccess}`}>
              <MdEmojiEvents size={12} />
              {achievedCards.length > 0
                ? achievedCards[0].card_name?.replace(' 체크카드', '')
                : '달성 카드 없음'}
            </div>
          </div>
        </div>

        {/* 메인 2열 그리드 */}
        <div className={styles.mainGrid}>

          {/* 카드 혜택 지도 */}
          <div className={`${styles.featureCard} ${styles.mapCard}`} onClick={() => navigate('/map')}
            style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
            <div className={styles.featureCardHeader} style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1, padding: '14px 16px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 70%, rgba(255,255,255,0))' }}>
              <div className={styles.featureIconWrap}>
                <MdLocationOn size={18} color="var(--color-primary)" />
              </div>
              <div>
                <p className={styles.featureTitle}>카드 혜택 지도</p>
                <p className={styles.featureSub}>캠퍼스 주변 혜택 가게를 확인하세요</p>
              </div>
              <MdArrowForward size={16} color="var(--color-text-secondary)" className={styles.arrowIcon} />
            </div>
            <img src={campusMap} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>

          {/* 소비 패턴 분석 */}
          <div className={`${styles.featureCard}`} onClick={() => navigate('/analysis')}>
            <div className={styles.featureCardHeader}>
              <div className={styles.featureIconWrap}>
                <MdBarChart size={18} color="var(--color-primary)" />
              </div>
              <div>
                <p className={styles.featureTitle}>소비 패턴 분석</p>
                <p className={styles.featureSub}>카테고리별 소비 현황을 확인하세요</p>
              </div>
              <MdArrowForward size={16} color="var(--color-text-secondary)" className={styles.arrowIcon} />
            </div>
            <div className={styles.analysisContent}>
              {topCategories.every(({ amount, budget }) => amount === 0 && budget === 0) ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                    소비 내역을 입력해보세요
                  </p>
                </div>
              ) : topCategories.map(({ cat, amount, budget }) => {
                const Icon = CATEGORY_ICONS[cat]
                const percent = budget > 0 ? Math.round((amount / budget) * 100) : 0
                const isOver = percent >= 80
                return (
                  <div key={cat} className={styles.analysisRow}>
                    <div className={styles.analysisLeft}>
                      <Icon size={13} color={CATEGORY_COLORS[cat]} />
                      <span className={styles.analysisCat}>{cat}</span>
                    </div>
                    <div className={styles.analysisBarWrap}>
                      <div
                        className={styles.analysisBar}
                        style={{
                          width: `${Math.min(percent, 100)}%`,
                          background: isOver ? '#EF4444' : CATEGORY_COLORS[cat]
                        }}
                      />
                    </div>
                    <span className={styles.analysisAmount}>
                      {amount.toLocaleString()} / {budget > 0 ? budget.toLocaleString() : '-'}원
                    </span>

                  </div>
                )
              })}
            </div>
          </div>

          {/* 카드 추천 */}
          <div className={`${styles.featureCard}`} onClick={() => navigate('/recommend')}>
            <div className={styles.featureCardHeader}>
              <div className={styles.featureIconWrap}>
                <MdCreditCard size={18} color="var(--color-primary)" />
              </div>
              <div>
                <p className={styles.featureTitle}>카드 추천</p>
                <p className={styles.featureSub}>소비 패턴에 맞는 최적 카드를 추천해드려요</p>
              </div>
              <MdArrowForward size={16} color="var(--color-text-secondary)" className={styles.arrowIcon} />
            </div>
            <div className={styles.recommendContent}>
              {!topCard || topCard.benefit === 0 ? (
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '16px 0' }}>
                  카드를 등록하고 소비 내역을 입력해보세요
                </p>
              ) : (
                <>
                  <div className={styles.recommendBest}>
                    <div className={styles.recommendLeft}>
                      <span className={styles.rankBadge}>1순위</span>
                      <span className={styles.recommendCardName}>
                        {topCard.card_name?.replace(' 체크카드', '')}
                      </span>
                    </div>
                    <div className={styles.recommendRight}>
                      <span className={styles.recommendRate}>예상 혜택</span>
                      <span className={styles.recommendExpected}>{topCard.benefit?.toLocaleString()}원</span>
                    </div>
                  </div>
                  <div className={styles.recommendDetail}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>이번달 총 소비</span>
                      <span className={styles.detailValue}>{totalSpend.toLocaleString()}원</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 전월 실적 관리 */}
          <div className={`${styles.featureCard}`} onClick={() => navigate('/performance')}>
            <div className={styles.featureCardHeader}>
              <div className={styles.featureIconWrap}>
                <MdEmojiEvents size={18} color="var(--color-primary)" />
              </div>
              <div>
                <p className={styles.featureTitle}>전월 실적 관리</p>
                <p className={styles.featureSub}>카드 혜택 발동까지 남은 금액을 확인하세요</p>
              </div>
              <MdArrowForward size={16} color="var(--color-text-secondary)" className={styles.arrowIcon} />
            </div>
            <div className={styles.performanceContent}>
              {!closestCard ? (
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '16px 0' }}>
                  카드를 등록해보세요
                </p>
              ) : (
                <>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                    {closestCard.card_name?.replace(' 체크카드', '')}
                  </p>
                  <div className={styles.performanceAmounts}>
                    <span className={styles.performanceCurrent}>{closestCardSpent.toLocaleString()}원</span>
                    <span className={styles.performanceDivider}>/</span>
                    <span className={styles.performanceTarget}>{PERFORMANCE_GOAL.toLocaleString()}원</span>
                  </div>
                  <div className={styles.performanceBarWrap}>
                    <div
                      className={styles.performanceBar}
                      style={{ width: `${Math.min(Math.round((closestCardSpent / PERFORMANCE_GOAL) * 100), 100)}%` }}
                    />
                  </div>
                  <div className={styles.performanceInfo}>
                    <MdAttachMoney size={14} color="var(--color-primary)" />
                    <span className={styles.performanceInfoText}>
                      혜택 발동까지 <strong>{Math.max(PERFORMANCE_GOAL - closestCardSpent, 0).toLocaleString()}원</strong> 남았어요
                    </span>
                  </div>
                  <div className={styles.performanceDays}>
                    <MdAutoAwesome size={13} color="var(--color-text-secondary)" />
                    <span>남은 기간 {remainingDays}일</span>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home