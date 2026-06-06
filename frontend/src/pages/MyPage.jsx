import { useState, useEffect } from 'react'
import { getCards, getUserCards, registerUserCard, deleteUserCard } from '../api/card'
import { useNavigate } from 'react-router-dom'
import {
  MdCreditCard, MdPersonOutline, MdAccountCircle,
  MdLogout, MdAdd, MdDelete, MdCheck,
} from 'react-icons/md'
import styles from './MyPage.module.css'
import Toast from '../components/Toast'

const companies = ['신한', '하나', '농협', '카카오뱅크', '토스뱅크', '우리', 'KB국민', '기업']

const cardsByCompany = {
  신한: [
    { name: '신한카드 춘식이 체크카드', benefits: {
      식비: { rate: 0, brands: [] }, 카페: { rate: 0, brands: [] },
      편의점: { rate: 5, brands: ['CU', 'GS25', '세븐일레븐', '이마트24'] },
      문화: { rate: 0, brands: [] }, 쇼핑: { rate: 0, brands: [] },
    }, color: '#7F77DD' },
  ],
  하나: [
    { name: '하나1Q 체크카드', benefits: {
      식비: { rate: 0, brands: [] }, 카페: { rate: 5, brands: [] },
      편의점: { rate: 5, brands: [] }, 문화: { rate: 0, brands: [] }, 쇼핑: { rate: 0, brands: [] },
    }, color: '#1D9E75' },
  ],
  농협: [
    { name: '올바른POINT 체크카드', benefits: {
      식비: { rate: 0.2, brands: [] }, 카페: { rate: 0.3, brands: [] },
      편의점: { rate: 0.3, brands: [] },
      문화: { rate: 0.3, brands: ['CGV', '롯데시네마', '메가박스'] },
      쇼핑: { rate: 0.3, brands: ['하나로마트', '하나로클럽'] },
    }, color: '#4CAF50' },
  ],
  카카오뱅크: [
    { name: '프렌즈 체크카드', benefits: {
      식비: { rate: 0, brands: [] },
      카페: { rate: 3, brands: ['메가커피', '컴포즈커피', '빽다방'] },
      편의점: { rate: 2, brands: ['GS25'] },
      문화: { rate: 0, brands: [] },
      쇼핑: { rate: 0, brands: ['올리브영'] },
    }, color: '#F9E000' },
  ],
  토스뱅크: [
    { name: '토스뱅크 체크카드', benefits: {
      식비: { rate: 0.3, brands: ['맥도날드', '버거킹', '롯데리아', '맘스터치', '써브웨이'] },
      카페: { rate: 0.3, brands: ['스타벅스', '이디야', '투썸플레이스', '커피빈'] },
      편의점: { rate: 0.3, brands: ['CU', 'GS25', '세븐일레븐', '이마트24'] },
      문화: { rate: 0.3, brands: ['CGV', '롯데시네마', '메가박스'] },
      쇼핑: { rate: 0.3, brands: [] },
    }, color: '#0064FF' },
  ],
  우리: [
    { name: '카드의정석2 원더라이프 체크카드', benefits: {
      식비: { rate: 0.2, brands: [] }, 카페: { rate: 0.2, brands: [] },
      편의점: { rate: 0.5, brands: [] }, 문화: { rate: 0.2, brands: [] }, 쇼핑: { rate: 0.5, brands: [] },
    }, color: '#0076F1' },
  ],
  KB국민: [
    { name: '트래블러스 체크카드', benefits: {
      식비: { rate: 2, brands: ['파리바게뜨', '뚜레쥬르', '배스킨라빈스'] },
      카페: { rate: 3, brands: [] }, 편의점: { rate: 2, brands: [] },
      문화: { rate: 0, brands: [] }, 쇼핑: { rate: 3, brands: [] },
    }, color: '#185FA5' },
  ],
  기업: [
    { name: 'IBK 일상의 기쁨 체크카드', benefits: {
      식비: { rate: 0, brands: [] },
      카페: { rate: 5, brands: ['스타벅스', '투썸플레이스', '커피빈', '할리스'] },
      편의점: { rate: 10, brands: ['CU', 'GS25', '세븐일레븐'] },
      문화: { rate: 10, brands: ['CGV', '롯데시네마', '메가박스'] },
      쇼핑: { rate: 0, brands: ['올리브영', '이마트', '홈플러스'] },
    }, color: '#FF6B35' },
  ],
}

// benefits에서 rate 안전하게 추출
const getRate = (val) => (typeof val === 'object' ? val?.rate ?? 0 : val ?? 0)

function MyPage({ userCards: initialCards = [], onRegisterCard, onDeleteCard }) {
  const [activeMenu, setActiveMenu] = useState('cards')
  const [userCards, setUserCards] = useState(initialCards)
  const [showCardModal, setShowCardModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const navigate = useNavigate()
  const [toast, setToast] = useState({ show: false, message: '', type: 'default' })

  // 닉네임 수정 폼
  const [infoForm, setInfoForm] = useState({
    nickname: localStorage.getItem('nickname') || '',
  })
  const [infoError, setInfoError] = useState('')
  const [infoLoading, setInfoLoading] = useState(false)

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const data = await getUserCards()
        const mapped = data.map(card => {
          const company = card.company
          const cardInfo = cardsByCompany[company]?.find(c => c.name === card.cardName)
          return {
            id: card.cardId,
            card_name: card.cardName,
            company: card.company,
            benefits: cardInfo?.benefits || {},
            color: cardInfo?.color || '#0076F1',
          }
        })
        setUserCards(mapped)
      } catch (err) {
        console.error('카드 목록 조회 실패:', err)
      }
    }
    fetchUserCards()
  }, [])

  const showToast = (message, type = 'default') => {
    setToast({ show: true, message, type })
  }

  // 로그아웃 - 커스텀 이벤트로 Navbar 즉시 갱신
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('nickname')
    localStorage.removeItem('userId')
    window.dispatchEvent(new Event('authChange'))
    navigate('/login')
  }

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteUserCard(cardId)
      setUserCards(prev => prev.filter(card => card.id !== cardId))
      onDeleteCard?.(cardId)
      showToast('카드가 삭제됐어요!', 'default')
    } catch (err) {
      console.error('카드 삭제 실패:', err)
      showToast('카드 삭제에 실패했어요', 'error')
    }
  }

  const handleRegisterCard = async () => {
    if (!selectedCard) return
    const cardData = cardsByCompany[selectedCompany]?.find(c => c.name === selectedCard)
    if (!cardData) return
    if (userCards.some(c => c.card_name === selectedCard)) {
      showToast('이미 등록된 카드예요!', 'error')
      return
    }
    try {
      const allCards = await getCards()
      const found = allCards.find(c => c.cardName === selectedCard)
      if (!found) {
        showToast('카드 정보를 찾을 수 없어요', 'error')
        return
      }
      await registerUserCard(found.cardId)
      const newCard = {
        id: found.cardId,
        card_name: cardData.name,
        company: selectedCompany,
        benefits: cardData.benefits,
        color: cardData.color,
      }
      setUserCards(prev => [...prev, newCard])
      onRegisterCard?.(newCard)
      setShowCardModal(false)
      setSelectedCompany(null)
      setSelectedCard(null)
      showToast('카드가 등록됐어요!', 'success')
    } catch (err) {
      console.error('카드 등록 실패:', err)
      showToast('카드 등록에 실패했어요', 'error')
    }
  }

  // 닉네임 수정 저장
  const handleSaveInfo = async () => {
    if (!infoForm.nickname.trim()) {
      setInfoError('닉네임을 입력해주세요.')
      return
    }
    if (infoForm.nickname === localStorage.getItem('nickname')) {
      setInfoError('현재 닉네임과 동일해요.')
      return
    }
    setInfoLoading(true)
    setInfoError('')
    try {
      const { updateNickname } = await import('../api/auth')
      const userId = localStorage.getItem('userId')
      await updateNickname(userId, infoForm.nickname)
      localStorage.setItem('nickname', infoForm.nickname)
      showToast('닉네임이 수정됐어요!', 'success')
    } catch (err) {
      console.error('닉네임 수정 실패:', err)
      setInfoError(err.response?.data || '저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setInfoLoading(false)
    }
  }

  const menuItems = [
    { key: 'cards', label: '내 카드 관리', icon: <MdCreditCard size={18} /> },
    { key: 'info', label: '회원 정보 수정', icon: <MdPersonOutline size={18} /> },
  ]

  const nickname = localStorage.getItem('nickname') || '사용자'
  const email = localStorage.getItem('email') || ''

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* 좌측 사이드바 */}
        <aside className={styles.sidebar}>
          <div className={styles.profileBox}>
            <div className={styles.avatar}>
              <MdAccountCircle size={72} color="var(--color-primary)" />
            </div>
            <p className={styles.userName}>{nickname}님</p>
            <p className={styles.userEmail}>{email}</p>
            <div className={styles.profileBadge}>
              <MdCreditCard size={12} />
              카드 {userCards.length}개 등록
            </div>
          </div>

          <div className={styles.menuList}>
            {menuItems.map(item => (
              <button
                key={item.key}
                className={`${styles.menuItem} ${activeMenu === item.key ? styles.activeMenu : ''}`}
                onClick={() => setActiveMenu(item.key)}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                {item.label}
                {activeMenu === item.key && <span className={styles.menuArrow}>›</span>}
              </button>
            ))}
            <button className={`${styles.menuItem} ${styles.logoutBtn}`} onClick={handleLogout}>
              <span className={styles.menuIcon}><MdLogout size={18} /></span>
              로그아웃
            </button>
          </div>

          <div className={styles.infoBox}>
            <p className={styles.infoBoxText}>소비최적화 서비스</p>
          </div>
        </aside>

        {/* 우측 메인 */}
        <div className={styles.mainCol}>

          {/* 내 카드 관리 */}
          {activeMenu === 'cards' && (
            <>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>내 카드 관리</h2>
                    <p className={styles.sectionSub}>보유 카드를 등록하고 관리하세요</p>
                  </div>
                  <button className={styles.addBtn} onClick={() => setShowCardModal(true)}>
                    <MdAdd size={16} /> 카드 등록
                  </button>
                </div>

                {userCards.length === 0 ? (
                  <div className={styles.emptyState}>
                    <MdCreditCard size={40} color="#D1D5DB" />
                    <p className={styles.emptyTitle}>등록된 카드가 없어요</p>
                    <p className={styles.emptySub}>카드를 등록하면 혜택을 비교할 수 있어요</p>
                  </div>
                ) : (
                  <div className={styles.cardList}>
                    {userCards.map(card => (
                      <div key={card.id} className={styles.cardItem}>
                        <div className={styles.cardIconBox} style={{ background: card.color }}>
                          <MdCreditCard size={20} color="#fff" />
                        </div>
                        <div className={styles.cardInfo}>
                          <div className={styles.cardName}>{card.card_name}</div>
                          <div className={styles.cardCompany}>{card.company}</div>
                          <div className={styles.cardBenefits}>
                            {Object.entries(card.benefits)
                              .filter(([, val]) => getRate(val) > 0)
                              .map(([cat, val]) => (
                                <span key={cat} className={styles.benefitTag}>
                                  {cat} {getRate(val)}%
                                </span>
                              ))
                            }
                            {Object.entries(card.benefits).every(([, val]) => getRate(val) === 0) && (
                              <span className={styles.noBenefitTag}>혜택 정보 없음</span>
                            )}
                          </div>
                        </div>
                        <div className={styles.cardActions}>
                          <button className={styles.deleteBtn} onClick={() => handleDeleteCard(card.id)}>
                            <MdDelete size={15} /> 삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 카드 혜택 요약 테이블 */}
              {userCards.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>카드별 혜택 요약</h2>
                  <p className={styles.sectionSub}>등록된 카드의 카테고리별 혜택률이에요</p>
                  <div className={styles.benefitTable}>
                    <div className={styles.benefitTableHeader}>
                      <span className={styles.benefitTableCat}>카테고리</span>
                      {userCards.map(card => (
                        <span key={card.id} className={styles.benefitTableCard}>
                          {card.card_name.replace(' 체크카드', '')}
                        </span>
                      ))}
                    </div>
                    {['식비', '카페', '편의점', '문화', '쇼핑'].map(cat => (
                      <div key={cat} className={styles.benefitTableRow}>
                        <span className={styles.benefitTableCat}>{cat}</span>
                        {userCards.map(card => {
                          const rate = getRate(card.benefits[cat])
                          return (
                            <span
                              key={card.id}
                              className={`${styles.benefitTableValue} ${rate > 0 ? styles.hasValue : ''}`}
                            >
                              {rate > 0 ? `${rate}%` : '-'}
                            </span>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* 회원 정보 수정 */}
          {activeMenu === 'info' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>회원 정보 수정</h2>
                  <p className={styles.sectionSub}>닉네임을 수정할 수 있어요</p>
                </div>
              </div>
              <div className={styles.infoForm}>
                <div className={styles.infoRow}>
                  <label className={styles.infoLabel}>닉네임</label>
                  <input
                    className={styles.infoInput}
                    value={infoForm.nickname}
                    onChange={e => { setInfoForm({ nickname: e.target.value }); setInfoError('') }}
                  />
                </div>
                <div className={styles.infoRow}>
                  <label className={styles.infoLabel}>이메일</label>
                  <input className={styles.infoInput} defaultValue={email} disabled />
                </div>
                {infoError && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '0' }}>{infoError}</p>
                )}
                <button className={styles.saveBtn} onClick={handleSaveInfo} disabled={infoLoading}>
                  <MdCheck size={16} />
                  {infoLoading ? '저장 중...' : '저장하기'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 카드 등록 모달 */}
      {showCardModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCardModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>카드 등록</h3>
              <button className={styles.modalClose} onClick={() => setShowCardModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalLabel}>카드사 선택 <span className={styles.required}>*</span></p>
              <div className={styles.companyRow}>
                {companies.map(company => (
                  <button
                    key={company}
                    className={`${styles.companyBtn} ${selectedCompany === company ? styles.activeCompany : ''}`}
                    onClick={() => { setSelectedCompany(company); setSelectedCard(null) }}
                  >
                    {company}
                  </button>
                ))}
              </div>

              {selectedCompany && (
                <>
                  <p className={styles.modalLabel} style={{ marginTop: '16px' }}>
                    카드 선택 <span className={styles.required}>*</span>
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cardsByCompany[selectedCompany]?.map(card => (
                      <button
                        key={card.name}
                        onClick={() => setSelectedCard(card.name)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '12px 14px',
                          border: selectedCard === card.name ? `1.5px solid ${card.color}` : '0.5px solid #e5e7eb',
                          borderRadius: '10px',
                          background: selectedCard === card.name ? `${card.color}10` : 'white',
                          cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        }}
                      >
                        <div style={{ width: '36px', height: '24px', borderRadius: '4px', background: card.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MdCreditCard size={14} color="#fff" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: '500', color: '#111827', margin: 0 }}>{card.name}</p>
                          {/* 4번 수정: getRate로 안전하게 혜택 표시 */}
                          <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0' }}>
                            {Object.entries(card.benefits)
                              .filter(([, val]) => getRate(val) > 0)
                              .map(([cat, val]) => `${cat} ${getRate(val)}%`)
                              .join(' · ') || '혜택 없음'}
                          </p>
                        </div>
                        {selectedCard === card.name && <MdCheck size={18} color={card.color} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowCardModal(false)}>취소</button>
              <button className={styles.registerBtn} onClick={handleRegisterCard} disabled={!selectedCard}>
                등록하기
              </button>
            </div>
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

export default MyPage