import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdGridView, MdRestaurant, MdLocalCafe,
  MdStorefront, MdTheaters, MdShoppingBag,
  MdTrendingUp, MdCreditCard, MdAttachMoney, MdAutoAwesome
} from 'react-icons/md'
import styles from './Recommend.module.css'
import { mockCards, mockConsumption, CATEGORIES } from '../data/cards'

const CATEGORY_META = {
  전체: { icon: MdGridView, color: '#6b7280' },
  식비: { icon: MdRestaurant, color: '#EF9F27' },
  카페: { icon: MdLocalCafe, color: '#7F77DD' },
  편의점: { icon: MdStorefront, color: '#D4537E' },
  문화: { icon: MdTheaters, color: '#1D9E75' },
  쇼핑: { icon: MdShoppingBag, color: '#378ADD' },
}


const CATEGORY_NO_BENEFIT_ICONS = {
  식비: <MdRestaurant size={24} color="#D1D5DB" />,
  카페: <MdLocalCafe size={24} color="#D1D5DB" />,
  편의점: <MdStorefront size={24} color="#D1D5DB" />,
  문화: <MdTheaters size={24} color="#D1D5DB" />,
  쇼핑: <MdShoppingBag size={24} color="#D1D5DB" />,
}

const CATEGORY_COLORS = {
  식비: '#EF9F27',
  카페: '#7F77DD',
  편의점: '#D4537E',
  문화: '#1D9E75',
  쇼핑: '#378ADD',
}

const mockUserCards = mockCards
const hasConsumption = Object.values(mockConsumption).some(v => v > 0)
const hasCards = mockUserCards.length > 0

function Recommend() {
  const [selectedCategory, setSelectedCategory] = useState('식비')
  const navigate = useNavigate()
  const isTotal = selectedCategory === '전체'
  const allCategories = ['전체', ...CATEGORIES]
  const totalConsumption = Object.values(mockConsumption).reduce((a, b) => a + b, 0)

  const getBestCardPerCategory = () => {
    return CATEGORIES.map(category => {
      const best = mockUserCards
        .map(card => ({
          cardName: card.card_name,
          rate: card.benefits[category]?.rate || 0,
        }))
        .sort((a, b) => b.rate - a.rate)[0]
      return { category, ...best }
    })
  }

  const getRecommendByCategory = (category) => {
    return mockUserCards
      .map(card => ({
        ...card,
        benefit: card.benefits[category],
        expectedAmount: Math.round(
          (mockConsumption[category] || 0) * (card.benefits[category]?.rate || 0) / 100
        ),
      }))
      .sort((a, b) => (b.benefit?.rate || 0) - (a.benefit?.rate || 0))
  }

  const getRecommendTotal = () => {
    return mockUserCards
      .map(card => {
        const totalExpected = CATEGORIES.reduce((sum, category) => {
          const benefit = card.benefits[category]
          const rate = benefit?.rate || 0
          const consumption = mockConsumption[category] || 0
          return sum + Math.round(consumption * rate / 100)
        }, 0)
        return { ...card, totalExpected }
      })
      .sort((a, b) => b.totalExpected - a.totalExpected)
  }

  const recommendList = isTotal ? [] : getRecommendByCategory(selectedCategory)
  const totalRecommendList = getRecommendTotal()
  const bestPerCategory = getBestCardPerCategory()

  const topCategory = CATEGORIES.reduce((a, b) =>
    (mockConsumption[a] || 0) > (mockConsumption[b] || 0) ? a : b
  )
  const topCategoryBest = bestPerCategory.find(b => b.category === topCategory)

  // E2: 카드 미등록
  if (!hasCards) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.pageTitle}>카드 추천</h1>
          <div className={styles.emptyWrap}>
            <MdCreditCard size={48} color="#D1D5DB" />
            <p className={styles.emptyTitle}>등록된 카드가 없어요</p>
            <p className={styles.emptySub}>카드를 등록하면 소비 패턴에 맞는 카드를 추천해드려요</p>
            <button className={styles.emptyBtn} onClick={() => navigate('/mypage')}>
              카드 등록하러 가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // E1: 소비 내역 없음
  if (!hasConsumption) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.pageTitle}>카드 추천</h1>
          <div className={styles.emptyWrap}>
            <MdTrendingUp size={48} color="#D1D5DB" />
            <p className={styles.emptyTitle}>소비 내역이 없어요</p>
            <p className={styles.emptySub}>소비 내역을 입력하면 더 정확한 카드 추천을 받을 수 있어요</p>
            <button className={styles.emptyBtn} onClick={() => navigate('/analysis')}>
              소비 내역 입력하러 가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <h1 className={styles.pageTitle}>카드 추천</h1>

        {/* 상단 요약 배너 */}
        <div className={styles.summaryBanner}>
          <div className={styles.summaryItem}>
            <MdTrendingUp size={20} color="var(--color-primary)" />
            <div className={styles.summaryText}>
              <span className={styles.summaryLabel}>이번달 최다 소비</span>
              <span className={styles.summaryValue}>{topCategory}</span>
            </div>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <MdCreditCard size={20} color="var(--color-primary)" />
            <div className={styles.summaryText}>
              <span className={styles.summaryLabel}>최적 카드</span>
              <span className={styles.summaryValue}>
                {topCategoryBest?.cardName.replace(' 체크카드', '') || '-'}
              </span>
            </div>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <MdAttachMoney size={20} color="var(--color-primary)" />
            <div className={styles.summaryText}>
              <span className={styles.summaryLabel}>이번달 총 소비</span>
              <span className={styles.summaryValue}>{totalConsumption.toLocaleString()}원</span>
            </div>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <MdAutoAwesome size={20} color="var(--color-primary)" />
            <div className={styles.summaryText}>
              <span className={styles.summaryLabel}>예상 최대 적립</span>
              <span className={`${styles.summaryValue} ${styles.summaryValuePrimary}`}>
                {totalRecommendList[0]?.totalExpected.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        <div className={styles.contentWrap}>

          {/* 좌측 */}
          <div className={styles.leftCard}>
            <p className={styles.cardTitle}>소비 카테고리 선택</p>
            <div className={styles.categoryList}>
              {allCategories.map(cat => {
                const best = cat !== '전체'
                  ? bestPerCategory.find(b => b.category === cat)
                  : null
                return (
                  <button
                    key={cat}
                    className={`${styles.catItem} ${selectedCategory === cat ? styles.activeCat : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <div className={styles.catMain}>
                      <div className={styles.catTop}>
                        <div className={styles.catLeft}>
                          <span className={`${styles.catIcon} ${selectedCategory === cat ? styles.activeCatIcon : ''}`}>
                            {(() => {
                              const Meta = CATEGORY_META[cat]
                              const Icon = Meta.icon
                              const isActive = selectedCategory === cat
                              return <Icon size={15} color={isActive ? 'var(--color-primary)' : Meta.color} />
                            })()}
                          </span>
                          <span className={`${styles.catName} ${selectedCategory === cat ? styles.activeCatName : ''}`}>
                            {cat}
                          </span>
                        </div>
                        <div className={styles.catRight}>
                          <span className={`${styles.catAmount} ${selectedCategory === cat ? styles.activeCatAmount : ''}`}>
                            {cat === '전체'
                              ? `${totalConsumption.toLocaleString()}원`
                              : `${(mockConsumption[cat] || 0).toLocaleString()}원`
                            }
                          </span>
                          <span className={styles.catArrow}>›</span>
                        </div>
                      </div>
                      {best && (
                        <div className={styles.catBestCard}>
                          <span
                            className={styles.catBestDot}
                            style={{ background: CATEGORY_COLORS[cat] }}
                          />
                          <span className={styles.catBestName}>
                            {best.cardName.replace(' 체크카드', '')}
                          </span>
                          <span className={`${styles.catBestRate} ${selectedCategory === cat ? styles.activeCatBestRate : ''}`}>
                            {best.rate > 0 ? `${best.rate}% 적립` : '혜택 없음'}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 우측 */}
          <div className={styles.rightCol}>

            <div className={styles.rightHeader}>
              <p className={styles.rightTitle}>
                {isTotal ? '전체 소비 패턴 기반 추천' : `${selectedCategory} 카테고리 추천 카드`}
              </p>
            
            </div>

            <div className={styles.recList}>

              {/* 전체 합산 */}
              {isTotal && totalRecommendList.map((card, idx) => (
                <div
                  key={card.card_id}
                  className={`${styles.recItem} ${idx === 0 ? styles.bestItem : styles.normalItem}`}
                >
                  <div className={styles.itemTop}>
                    <div className={styles.itemLeft}>
                      <span className={`${styles.badge} ${idx === 0 ? styles.bestBadge : styles.normalBadge}`}>
                        {idx + 1}순위
                      </span>
                      <span className={`${styles.cardName} ${idx === 0 ? styles.bestCardName : ''}`}>
                        {card.card_name}
                      </span>
                    </div>
                    <div className={styles.itemRight}>
                      <span className={`${styles.rateText} ${idx === 0 ? styles.bestRate : ''}`}>
                        총 {card.totalExpected.toLocaleString()}원
                      </span>
                      <span className={`${styles.expectedText} ${idx === 0 ? styles.bestExpected : ''}`}>
                        예상 적립 혜택
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.itemDetail} ${idx === 0 ? styles.bestDetail : styles.normalDetail}`}>
                    {CATEGORIES.filter(cat => card.benefits[cat]?.rate > 0).map(cat => (
                      <div key={cat} className={styles.detailRow}>
                        <span className={styles.detailLabel}>{cat}</span>
                        <span className={`${styles.detailValue} ${idx === 0 ? styles.bestDetailValue : ''}`}>
                          {card.benefits[cat].rate}% × {(mockConsumption[cat] || 0).toLocaleString()}원
                          = {Math.round((mockConsumption[cat] || 0) * card.benefits[cat].rate / 100).toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* 카테고리별 */}
              {!isTotal && recommendList.slice(0, 2).map((card, idx) => (
                <div
                  key={card.card_id}
                  className={`${styles.recItem} ${idx === 0 ? styles.bestItem : styles.normalItem}`}
                >
                  <div className={styles.itemTop}>
                    <div className={styles.itemLeft}>
                      <span className={`${styles.badge} ${idx === 0 ? styles.bestBadge : styles.normalBadge}`}>
                        {idx + 1}순위
                      </span>
                      <span className={`${styles.cardName} ${idx === 0 ? styles.bestCardName : ''}`}>
                        {card.card_name}
                      </span>
                    </div>
                    <div className={styles.itemRight}>
                      <span className={`${styles.rateText} ${idx === 0 ? styles.bestRate : ''}`}>
                        {card.benefit?.rate > 0 ? `${card.benefit.rate}% 적립` : '혜택 없음'}
                      </span>
                      {card.expectedAmount > 0 && (
                        <span className={`${styles.expectedText} ${idx === 0 ? styles.bestExpected : ''}`}>
                          예상 혜택 {card.expectedAmount.toLocaleString()}원
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 혜택 있는 경우 */}
                  {card.benefit?.rate > 0 && (
                    <div className={`${styles.itemDetail} ${idx === 0 ? styles.bestDetail : styles.normalDetail}`}>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>이번달 {selectedCategory} 소비</span>
                        <span className={styles.detailValue}>
                          {(mockConsumption[selectedCategory] || 0).toLocaleString()}원
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>적립률</span>
                        <span className={`${styles.detailValue} ${idx === 0 ? styles.bestDetailValue : ''}`}>
                          x {card.benefit.rate}% = {card.expectedAmount.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 혜택 없는 경우 안내 */}
                  {card.benefit?.rate === 0 && (
                    <div className={styles.nobenefitBox}>
                      <div className={styles.nobenefitContent}>
                        {idx === 0
                          ? CATEGORY_NO_BENEFIT_ICONS[selectedCategory]
                          : <MdCreditCard size={24} color="#D1D5DB" />
                        }
                        <div>
                          <p className={styles.nobenefitTitle}>
                            {idx === 0
                              ? `${selectedCategory} 카테고리 혜택이 없어요`
                              : `${selectedCategory} 혜택 카드를 등록해보세요`
                            }
                          </p>
                          <p className={styles.nobenefitSub}>
                            {idx === 0
                              ? `${selectedCategory} 소비를 늘리면 혜택 카드 추천이 더 정확해져요!`
                              : '다양한 카드를 등록하면 더 많은 혜택을 비교할 수 있어요'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 팁 박스 */}
            {!isTotal && recommendList[0]?.benefit?.rate > 0 && recommendList[1]?.benefit?.rate > 0 && (
              <div className={styles.tipBox}>
                <MdAutoAwesome size={16} color="#10B981" />
                <span className={styles.tipText}>
                  <strong>{recommendList[0].card_name}</strong>으로 결제하면{' '}
                  {recommendList[1].card_name} 대비{' '}
                  <strong>
                    {(recommendList[0].expectedAmount - recommendList[1].expectedAmount).toLocaleString()}원
                  </strong>{' '}
                  더 적립돼요!
                </span>
              </div>
            )}

            {isTotal && totalRecommendList[0] && (
              <div className={styles.tipBox}>
                <MdAutoAwesome size={16} color="#10B981" />
                <span className={styles.tipText}>
                  이번달 소비 패턴 기준으로{' '}
                  <strong>{totalRecommendList[0].card_name}</strong>이 가장 유리해요!
                  총 <strong>{totalRecommendList[0].totalExpected.toLocaleString()}원</strong> 적립 예상이에요.
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Recommend