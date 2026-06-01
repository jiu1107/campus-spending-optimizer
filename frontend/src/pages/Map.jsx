import { useEffect, useRef, useState } from 'react'
import { IoMdPin } from "react-icons/io"
import { MdRestaurant, MdLocalCafe, MdStorefront, MdTheaters, MdShoppingBag, MdSearch, MdLocationOff, MdMap, MdInfo, MdCreditCard } from 'react-icons/md'
import { renderToStaticMarkup } from 'react-dom/server'
import styles from './Map.module.css'
import { CATEGORIES } from '../data/cards'

const CAMPUS_LAT = 37.3755
const CAMPUS_LNG = 126.9322

const CATEGORY_ICONS = {
  식비: <MdRestaurant size={14} />,
  카페: <MdLocalCafe size={14} />,
  편의점: <MdStorefront size={14} />,
  문화: <MdTheaters size={14} />,
  쇼핑: <MdShoppingBag size={14} />,
}

const CATEGORY_META = {
  식비: { icon: MdRestaurant, color: '#EF9F27', bg: '#FFF7E6' },
  카페: { icon: MdLocalCafe, color: '#7F77DD', bg: '#F3F2FF' },
  편의점: { icon: MdStorefront, color: '#D4537E', bg: '#FFF0F5' },
  문화: { icon: MdTheaters, color: '#1D9E75', bg: '#E8FBF4' },
  쇼핑: { icon: MdShoppingBag, color: '#378ADD', bg: '#EBF4FF' },
}

const getCategoryIconHtml = (category) => {
  const iconMap = {
    식비: renderToStaticMarkup(<MdRestaurant size={16} color="#0076F1" />),
    카페: renderToStaticMarkup(<MdLocalCafe size={16} color="#0076F1" />),
    편의점: renderToStaticMarkup(<MdStorefront size={16} color="#0076F1" />),
    문화: renderToStaticMarkup(<MdTheaters size={16} color="#0076F1" />),
    쇼핑: renderToStaticMarkup(<MdShoppingBag size={16} color="#0076F1" />),
  }
  return iconMap[category] || ''
}

const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

const formatDistance = (meters) => {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)}km`
  return `${meters}m`
}

function Map({ userCards: propCards = [] }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const infoOverlayRef = useRef(null)
  const clustererRef = useRef(null)

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedStore, setSelectedStore] = useState(null)
  const [outOfRange, setOutOfRange] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [noResult, setNoResult] = useState(false)

  const userCards = propCards.map(card => ({
    id: card.id,
    name: card.card_name?.replace(' 체크카드', ''),
    benefits: {
      식비: { rate: card.benefits?.식비 || 0, brands: [] },
      카페: { rate: card.benefits?.카페 || 0, brands: [] },
      편의점: { rate: card.benefits?.편의점 || 0, brands: [] },
      문화: { rate: card.benefits?.문화 || 0, brands: [] },
      쇼핑: { rate: card.benefits?.쇼핑 || 0, brands: [] },
    }
  }))

  // 1번 수정: propCards가 비동기로 늦게 와도 checkedCards 동기화
  const [checkedCards, setCheckedCards] = useState([])
  const initializedRef = useRef(false)

  useEffect(() => {
    if (propCards.length > 0 && !initializedRef.current) {
      setCheckedCards(userCards.map(card => card.id))
      initializedRef.current = true
    }
  }, [propCards])

  // stale closure 방지용 ref
  const checkedCardsRef = useRef(checkedCards)
  const selectedCategoryRef = useRef(selectedCategory)

  useEffect(() => {
    checkedCardsRef.current = checkedCards
  }, [checkedCards])

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory
  }, [selectedCategory])

  useEffect(() => {
    const checkKakaoLoaded = setInterval(() => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.MarkerClusterer) {
        clearInterval(checkKakaoLoaded)
        const container = mapRef.current
        const options = {
          center: new window.kakao.maps.LatLng(CAMPUS_LAT, CAMPUS_LNG),
          level: 4,
        }
        const map = new window.kakao.maps.Map(container, options)
        mapInstanceRef.current = map
        map.setMinLevel(2)
        map.setMaxLevel(6)

        const clusterer = new window.kakao.maps.MarkerClusterer({
          map, averageCenter: true, minLevel: 4,
          styles: [{
            width: '40px', height: '40px',
            background: 'rgba(0,118,241,0.85)',
            borderRadius: '50%', color: '#fff',
            textAlign: 'center', fontWeight: '600',
            lineHeight: '40px', fontSize: '14px',
            border: '2px solid #fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }]
        })
        clustererRef.current = clusterer

        const LIMIT = 0.01
        window.kakao.maps.event.addListener(map, 'dragend', () => {
          const center = map.getCenter()
          const lat = center.getLat()
          const lng = center.getLng()
          if (lat < CAMPUS_LAT - LIMIT || lat > CAMPUS_LAT + LIMIT || lng < CAMPUS_LNG - LIMIT || lng > CAMPUS_LNG + LIMIT) {
            map.setCenter(new window.kakao.maps.LatLng(CAMPUS_LAT, CAMPUS_LNG))
            setOutOfRange(true)
            setTimeout(() => setOutOfRange(false), 2000)
          }
        })

        window.kakao.maps.event.addListener(map, 'click', () => {
          if (infoOverlayRef.current) { infoOverlayRef.current.setMap(null); infoOverlayRef.current = null }
          setSelectedStore(null)
        })
      }
    }, 100)
    return () => clearInterval(checkKakaoLoaded)
  }, [])

  const toggleCard = (cardId) => {
    setCheckedCards(prev =>
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    )
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setSelectedStore(null)
    setNoResult(false)
    if (infoOverlayRef.current) { infoOverlayRef.current.setMap(null); infoOverlayRef.current = null }
    searchNearbyStores(category)
  }

  const getBestCardBenefit = (category, storeName = '') => {
    if (!category) return []
    return userCards
      .filter(card => checkedCardsRef.current.includes(card.id))
      .map(card => {
        const benefit = card.benefits[category]
        if (!benefit || benefit.rate === undefined) return { cardName: card.name, rate: 0 }
        const isApplicable = !benefit.brands || benefit.brands.length === 0 ||
          benefit.brands.some(brand => typeof storeName === 'string' && storeName.includes(brand))
        return { cardName: card.name, rate: isApplicable ? benefit.rate : 0 }
      })
      .sort((a, b) => b.rate - a.rate)
  }

  const showInfoOverlay = (store, position, benefits, category) => {
    if (infoOverlayRef.current) infoOverlayRef.current.setMap(null)
    const bestCard = benefits[0]
    const iconHtml = getCategoryIconHtml(category)
    const content = `
      <div style="background:white;border:1.5px solid #0076F1;border-radius:12px;padding:12px 14px;min-width:180px;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-family:KoPubDotum,sans-serif;cursor:pointer;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
          <span style="display:flex;align-items:center;color:#0076F1;">${iconHtml}</span>
          <span style="font-size:13px;font-weight:500;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;">${store.place_name}</span>
        </div>
        <div style="background:#E6F1FB;border-radius:8px;padding:8px 10px;">
          <div style="font-size:11px;color:#0076F1;font-weight:500;margin-bottom:2px;">${bestCard?.rate > 0 ? '1순위 ' + bestCard.cardName : '혜택 없음'}</div>
          <div style="font-size:16px;font-weight:500;color:#0076F1;">${bestCard?.rate > 0 ? bestCard.rate + '% 적립' : '-'}</div>
        </div>
      </div>`
    const overlay = new window.kakao.maps.CustomOverlay({ position, content, yAnchor: 1.5 })
    overlay.setMap(mapInstanceRef.current)
    infoOverlayRef.current = overlay
  }

  const addMarker = (store, category) => {
    if (!store.y || !store.x) return
    const position = new window.kakao.maps.LatLng(store.y, store.x)
    const benefits = getBestCardBenefit(category, store.place_name)
    const maxRate = benefits.length > 0 ? Math.max(...benefits.map(b => b.rate)) : 0
    const markerColor = maxRate > 0 ? '#0076F1' : '#9CA3AF'

    const markerContent = document.createElement('div')
    markerContent.innerHTML = `
      <svg width="30" height="40" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26S32 26 32 16C32 7.163 24.837 0 16 0z" fill="${markerColor}"/>
        <circle cx="16" cy="16" r="7" fill="white"/>
      </svg>`

    const customOverlay = new window.kakao.maps.CustomOverlay({ position, content: markerContent, yAnchor: 1 })
    customOverlay.setMap(mapInstanceRef.current)
    markerContent.addEventListener('click', () => {
      showInfoOverlay(store, position, benefits, category)
      setSelectedStore({
        name: store.place_name, category,
        address: store.road_address_name || store.address_name,
        benefits,
        distance: getDistance(CAMPUS_LAT, CAMPUS_LNG, Number(store.y), Number(store.x)),
      })
    })
    markersRef.current.push(customOverlay)
  }

  const getCategoryKeyword = (category) => {
    const keywords = { 식비: '음식점', 카페: '카페', 편의점: '편의점' }
    return keywords[category] || category
  }

  const searchNearbyStores = (category) => {
    if (!category) return
    window.kakao.maps.load(() => {
      if (!mapInstanceRef.current) return
      const ps = new window.kakao.maps.services.Places()
      const center = mapInstanceRef.current.getCenter()
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []
      if (clustererRef.current) clustererRef.current.clear()
      if (infoOverlayRef.current) { infoOverlayRef.current.setMap(null); infoOverlayRef.current = null }
      setIsSearching(true)
      setNoResult(false)
      setSelectedStore(null)

      const handleResult = (result, status) => {
        setIsSearching(false)
        if (status === window.kakao.maps.services.Status.OK) {
          setNoResult(false)
          result.forEach(store => addMarker(store, category))
        } else {
          setNoResult(true)
        }
      }

      if (category === '문화') {
        ps.categorySearch('CT1', handleResult, { location: center, radius: 500 })
      } else if (category === '쇼핑') {
        const shoppingKeywords = ['올리브영', '다이소', '이니스프리']
        let completed = 0
        shoppingKeywords.forEach(keyword => {
          ps.keywordSearch(keyword, (result, status) => {
            completed++
            if (status === window.kakao.maps.services.Status.OK) {
              setNoResult(false)
              result.forEach(store => addMarker(store, category))
            }
            if (completed === shoppingKeywords.length) {
              setIsSearching(false)
              if (markersRef.current.length === 0) setNoResult(true)
            }
          }, { location: center, radius: 500 })
        })
      } else {
        ps.keywordSearch(getCategoryKeyword(category), handleResult, { location: center, radius: 500 })
      }
    })
  }

  // 카드 체크 변경 시 마커 자동 갱신
  useEffect(() => {
    if (selectedCategoryRef.current && mapInstanceRef.current) {
      searchNearbyStores(selectedCategoryRef.current)
    }
  }, [checkedCards])

  const handleReset = () => {
    setSelectedCategory(null)
    setSelectedStore(null)
    setNoResult(false)
    setIsSearching(false)
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
    if (clustererRef.current) clustererRef.current.clear()
    if (infoOverlayRef.current) { infoOverlayRef.current.setMap(null); infoOverlayRef.current = null }
  }

  const selectedCatMeta = selectedCategory ? CATEGORY_META[selectedCategory] : null

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>

        {/* 카테고리 선택 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>카테고리 선택</span>
            <button className={styles.resetBtn} onClick={handleReset}>초기화</button>
          </div>
          <div className={styles.categoryRow}>
            {CATEGORIES.map(cat => {
              const Meta = CATEGORY_META[cat]
              const Icon = Meta.icon
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  className={`${styles.catBtn} ${isActive ? styles.active : ''}`}
                  onClick={() => handleCategorySelect(cat)}
                  style={isActive ? { background: Meta.color, borderColor: Meta.color, color: 'white' } : {}}
                >
                  <Icon size={13} color={isActive ? 'white' : Meta.color} />
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* 보유 카드 선택 */}
        <div className={styles.section}>
          <span className={styles.sectionTitle}>보유 카드 선택</span>
          {userCards.length === 0 ? (
            <div className={styles.stateBox}>
              <MdCreditCard size={24} color="#9ca3af" />
              <p className={styles.stateText}>마이페이지에서 카드를 등록해주세요</p>
            </div>
          ) : (
            <div className={styles.cardList}>
              {userCards.map(card => (
                <label key={card.id} className={`${styles.cardCheck} ${checkedCards.includes(card.id) ? styles.cardChecked : ''}`}>
                  <input type="checkbox" checked={checkedCards.includes(card.id)} onChange={() => toggleCard(card.id)} />
                  <div className={styles.cardCheckInfo}>
                    <span className={styles.cardCheckName}>{card.name}</span>
                    {selectedCategory && (
                      <span className={styles.cardCheckRate} style={{ color: card.benefits[selectedCategory]?.rate > 0 ? '#0076F1' : '#9ca3af' }}>
                        {card.benefits[selectedCategory]?.rate > 0 ? `${card.benefits[selectedCategory].rate}% 적립` : '혜택 없음'}
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 선택한 가게 정보 */}
        <div className={styles.section} style={{ flex: 1 }}>
          <span className={styles.sectionTitle}>선택한 가게 정보</span>

          {isSearching && (
            <div className={styles.stateBox}>
              <MdSearch size={28} color="#9ca3af" />
              <p className={styles.stateText}>주변 가게를 검색 중이에요...</p>
            </div>
          )}

          {noResult && !isSearching && (
            <div className={styles.stateBox}>
              <MdLocationOff size={28} color="#9ca3af" />
              <p className={styles.stateText}>주변에 해당 카테고리<br />가게가 없어요</p>
            </div>
          )}

          {selectedStore && !isSearching ? (
            <div className={styles.storeInfo}>
              <div className={styles.storeNameRow}>
                <div className={styles.storeIconBox} style={{ background: selectedCatMeta?.bg || '#f3f4f6' }}>
                  {selectedCatMeta && <selectedCatMeta.icon size={16} color={selectedCatMeta.color} />}
                </div>
                <div>
                  <p className={styles.storeName}>{selectedStore.name}</p>
                  <p className={styles.storeAddress}>{selectedStore.address}</p>
                </div>
              </div>

              <div className={styles.storeMetaRow}>
                <span className={styles.storeTag}>
                  {CATEGORY_ICONS[selectedStore.category]}
                  {selectedStore.category}
                </span>
                <span className={styles.storeDistance}>
                  캠퍼스에서 {formatDistance(selectedStore.distance)}
                </span>
              </div>

              <div className={styles.benefitList}>
                {selectedStore.benefits.map((benefit, idx) => (
                  <div key={benefit.cardName} className={`${styles.benefitItem} ${idx === 0 && benefit.rate > 0 ? styles.best : ''}`}>
                    <div className={styles.benefitLeft}>
                      <span className={`${styles.benefitBadge} ${idx === 0 && benefit.rate > 0 ? styles.bestBadge : styles.normalBadge}`}>
                        {idx + 1}순위
                      </span>
                      <span className={styles.benefitCardName}>{benefit.cardName}</span>
                    </div>
                    <span className={styles.benefitRate} style={{ color: benefit.rate > 0 ? '#0076F1' : '#9ca3af' }}>
                      {benefit.rate > 0 ? `${benefit.rate}% 적립` : '혜택 없음'}
                    </span>
                  </div>
                ))}
              </div>

              {selectedStore.benefits[0]?.rate === 0 && (
                <div className={styles.nobenefitBox}>
                  <MdInfo size={14} color="#9ca3af" />
                  <span>이 가게에서 적용 가능한 카드 혜택이 없어요</span>
                </div>
              )}
            </div>
          ) : (
            !isSearching && !noResult && (
              <div className={styles.stateBox}>
                <MdMap size={28} color="#9ca3af" />
                <p className={styles.stateText}>카테고리를 선택하고<br />지도에서 가게를 클릭해보세요</p>
              </div>
            )
          )}
        </div>

        {/* 하단 팁 */}
        {!selectedStore && !isSearching && !noResult && (
          <div className={styles.tipSection}>
            <div className={styles.tipBox}>
              <MdInfo size={14} color="#0076F1" style={{ flexShrink: 0 }} />
              <span>카테고리 선택 후 지도에서 가게를 탭하면 카드 혜택을 확인할 수 있어요</span>
            </div>
          </div>
        )}
      </aside>

      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapRef} className={styles.map} />
        {outOfRange && (
          <div className={styles.outOfRange}>
            <IoMdPin size={14} /> 서비스 범위를 벗어났어요. 캠퍼스 주변으로 이동합니다.
          </div>
        )}
        <div className={styles.legend}>
          <p className={styles.legendTitle}>혜택 안내</p>
          {[
            { color: '#0076F1', label: '혜택 있는 가게' },
            { color: '#9CA3AF', label: '혜택 없는 가게' },
          ].map(item => (
            <div key={item.label} className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Map