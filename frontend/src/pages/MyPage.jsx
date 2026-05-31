import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdCreditCard, MdPersonOutline, MdAccountCircle,
  MdLogout, MdAdd, MdDelete, MdCheck, 
} from 'react-icons/md'
import styles from './MyPage.module.css'

const mockUser = {
  nickname: localStorage.getItem('nickname') || '사용자',
  email: localStorage.getItem('email') || '',
  created_at: '2025년 5월 1일',
}


const companies = ['신한', '하나', '농협', '카카오뱅크', '토스뱅크', '우리', 'KB국민', '기업']

const cardsByCompany = {
  신한: [
    { name: '신한 Hey Young 체크카드', benefits: { 식비: 0, 카페: 10, 편의점: 0, 문화: 15, 쇼핑: 5 }, color: '#7F77DD' },
  ],
  하나: [
    { name: '하나 1Q 체크카드', benefits: { 식비: 0, 카페: 5, 편의점: 5, 문화: 0, 쇼핑: 0 }, color: '#1D9E75' },
  ],
  농협: [
    { name: '농협 올바른POINT 체크카드', benefits: { 식비: 0.2, 카페: 0.3, 편의점: 0.3, 문화: 0.3, 쇼핑: 0.3 }, color: '#4CAF50' },
  ],
  카카오뱅크: [
    { name: '카카오뱅크 프렌즈 체크카드', benefits: { 식비: 0, 카페: 3, 편의점: 2, 문화: 0, 쇼핑: 0 }, color: '#F9E000' },
  ],
  토스뱅크: [
    { name: '토스뱅크 체크카드', benefits: { 식비: 0.3, 카페: 0.3, 편의점: 0.3, 문화: 0.3, 쇼핑: 0.3 }, color: '#0064FF' },
  ],
  우리: [
    { name: '우리 카드의정석2 원더라이프 체크카드', benefits: { 식비: 0.2, 카페: 0.2, 편의점: 0.5, 문화: 0.2, 쇼핑: 0.5 }, color: '#0076F1' },
  ],
  KB국민: [
    { name: 'KB국민 트래블러스 체크카드', benefits: { 식비: 2, 카페: 3, 편의점: 2, 문화: 0, 쇼핑: 3 }, color: '#185FA5' },
  ],
  기업: [
    { name: 'IBK 일상의기쁨 체크카드', benefits: { 식비: 0, 카페: 5, 편의점: 10, 문화: 10, 쇼핑: 0 }, color: '#FF6B35' },
  ],
}


function MyPage({ userCards: initialCards = [], onRegisterCard, onDeleteCard }) {
  const [activeMenu, setActiveMenu] = useState('cards')
 const [userCards, setUserCards] = useState(initialCards)
  const [showCardModal, setShowCardModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const navigate = useNavigate()

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('nickname')
  window.dispatchEvent(new Event('storage'))
  navigate('/login')
}

  const handleDeleteCard = (cardId) => {
  setUserCards(prev => prev.filter(card => card.id !== cardId))
  onDeleteCard?.(cardId)
}

  const handleRegisterCard = () => {
  if (!selectedCard) return
  const cardData = cardsByCompany[selectedCompany]?.find(c => c.name === selectedCard)
  if (!cardData) return
  const newCard = {
    id: Date.now(),
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
}

  const menuItems = [
    { key: 'cards', label: '내 카드 관리', icon: <MdCreditCard size={18} /> },
    { key: 'info', label: '회원 정보 수정', icon: <MdPersonOutline size={18} /> },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* 좌측 사이드바 */}
        <aside className={styles.sidebar}>

          {/* 프로필 */}
          <div className={styles.profileBox}>
            <div className={styles.avatar}>
              <MdAccountCircle size={72} color="var(--color-primary)" />
            </div>
            <p className={styles.userName}>{mockUser.nickname}님</p>
            <p className={styles.userEmail}>{mockUser.email}</p>
            <div className={styles.profileBadge}>
              <MdCreditCard size={12} />
              카드 {userCards.length}개 등록
            </div>
          </div>

          {/* 메뉴 */}
          <div className={styles.menuList}>
            {menuItems.map(item => (
              <button
                key={item.key}
                className={`${styles.menuItem} ${activeMenu === item.key ? styles.activeMenu : ''}`}
                onClick={() => setActiveMenu(item.key)}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                {item.label}
                {activeMenu === item.key && (
                  <span className={styles.menuArrow}>›</span>
                )}
              </button>
            ))}
            <button className={`${styles.menuItem} ${styles.logoutBtn}`} onClick={handleLogout}>
              <span className={styles.menuIcon}><MdLogout size={18} /></span>
              로그아웃
            </button>
          </div>

          {/* 서비스 정보 */}
          <div className={styles.infoBox}>
            <p className={styles.infoBoxText}>가입일: {mockUser.created_at}</p>
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
                    <MdAdd size={16} />
                    카드 등록
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
                              .filter(([, rate]) => rate > 0)
                              .map(([cat, rate]) => (
                                <span key={cat} className={styles.benefitTag}>
                                  {cat} {rate}%
                                </span>
                              ))
                            }
                            {Object.entries(card.benefits).every(([, rate]) => rate === 0) && (
                              <span className={styles.noBenefitTag}>혜택 정보 없음</span>
                            )}
                          </div>
                        </div>
                        <div className={styles.cardActions}>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteCard(card.id)}
                          >
                            <MdDelete size={15} />
                            삭제
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
                        {userCards.map(card => (
                          <span
                            key={card.id}
                            className={`${styles.benefitTableValue} ${card.benefits[cat] > 0 ? styles.hasValue : ''}`}
                          >
                            {card.benefits[cat] > 0 ? `${card.benefits[cat]}%` : '-'}
                          </span>
                        ))}
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
                  <p className={styles.sectionSub}>회원 정보를 확인하고 수정하세요</p>
                </div>
              </div>
              <div className={styles.infoForm}>
                <div className={styles.infoRow}>
                  <label className={styles.infoLabel}>닉네임</label>
                  <input className={styles.infoInput} defaultValue={mockUser.nickname} />
                </div>
                <div className={styles.infoRow}>
                  <label className={styles.infoLabel}>이메일</label>
                  <input className={styles.infoInput} defaultValue={mockUser.email} disabled />
                </div>
                <div className={styles.infoRow}>
                  <label className={styles.infoLabel}>새 비밀번호</label>
                  <input
                    className={styles.infoInput}
                    type="password"
                    placeholder="새 비밀번호를 입력하세요"
                  />
                </div>
                <div className={styles.infoRow}>
                  <label className={styles.infoLabel}>비밀번호 확인</label>
                  <input
                    className={styles.infoInput}
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                </div>
                <div className={styles.infoRow}>
                  <label className={styles.infoLabel}>가입일</label>
                  <input
                    className={styles.infoInput}
                    defaultValue={mockUser.created_at}
                    disabled
                  />
                </div>
                <button className={styles.saveBtn}>
                  <MdCheck size={16} />
                  저장하기
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 카드 등록 모달 */}
      {/* 카드 등록 모달 */}
{showCardModal && (
  <div className={styles.modalOverlay} onClick={() => setShowCardModal(false)}>
    <div className={styles.modal} onClick={e => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>카드 등록</h3>
        <button className={styles.modalClose} onClick={() => setShowCardModal(false)}>✕</button>
      </div>
      <div className={styles.modalBody}>
        {/* 카드사 선택 */}
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

        {/* 카드 선택 */}
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    border: selectedCard === card.name ? `1.5px solid ${card.color}` : '0.5px solid #e5e7eb',
                    borderRadius: '10px',
                    background: selectedCard === card.name ? `${card.color}10` : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* 카드 색상 표시 */}
                  <div style={{
                    width: '36px', height: '24px', borderRadius: '4px',
                    background: card.color, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <MdCreditCard size={14} color="#fff" />
                  </div>
                  {/* 카드 정보 */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: 0 }}>{card.name}</p>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0' }}>
                      {Object.entries(card.benefits)
                        .filter(([, rate]) => rate > 0)
                        .map(([cat, rate]) => `${cat} ${rate}%`)
                        .join(' · ')}
                    </p>
                  </div>
                  {/* 선택 표시 */}
                  {selectedCard === card.name && (
                    <MdCheck size={18} color={card.color} />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.cancelBtn} onClick={() => setShowCardModal(false)}>취소</button>
        <button
          className={styles.registerBtn}
          onClick={handleRegisterCard}
          disabled={!selectedCard}
        >
          등록하기
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default MyPage