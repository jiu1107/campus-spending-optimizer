import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PerformanceManagementView({ expenses = [], currentDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }, userCards = [] }) {
  const currentYearMonthStr = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
  const monthlyExpenses = expenses.filter(exp => exp.date.startsWith(currentYearMonthStr));
  const PERFORMANCE_GOAL = 300000;

  const cardStyle = { background: 'white', borderRadius: '16px', border: '0.5px solid #f3f4f6' };

  return (
    <div style={{ background: '#f5f6f8', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 상단 안내문 */}
        <div style={{ ...cardStyle, padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>💳 카드별 전월 실적 달성 현황</h2>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            마이페이지에 등록된 카드들의 이번 달 누적 실적입니다. 실적 조건을 달성해야 다음 달 혜택을 받을 수 있어요.
          </p>
        </div>

        {/* 카드 없을 때 */}
        {(!userCards || userCards.length === 0) ? (
          <div style={{ ...cardStyle, padding: '48px 24px', textAlign: 'center' }}>
            <CreditCard style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>등록된 보유 카드가 없습니다.</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>우측 상단의 프로필(마이페이지) 메뉴에서 카드를 먼저 등록해 주세요!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {userCards.map(card => {
              const cardSpent = monthlyExpenses
                .filter(exp =>
                  exp.card && (
                    exp.card.includes(card.card_name) ||
                    exp.card.includes(card.card_name.replace(' 체크카드', '')) ||
                    (exp.card.includes(card.company) && card.card_name.includes(exp.card.split(' ')[1] || ''))
                  )
                )
                .reduce((sum, exp) => sum + exp.amount, 0);

              const achievementRate = Math.min(Math.round((cardSpent / PERFORMANCE_GOAL) * 100), 100);
              const isAchieved = cardSpent >= PERFORMANCE_GOAL;
              const remainingAmount = Math.max(PERFORMANCE_GOAL - cardSpent, 0);

              return (
                <div key={card.id} style={{ ...cardStyle, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* 카드 상단 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '6px', color: 'white', background: card.color }}>
                          {card.company}
                        </span>
                        <h3 style={{ fontWeight: 'bold', fontSize: '15px', color: '#111827', marginTop: '4px' }}>{card.card_name}</h3>
                      </div>
                      <div>
                        {isAchieved ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 'bold', fontSize: '12px', background: '#ecfdf5', padding: '4px 10px', borderRadius: '999px' }}>
                            <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                            <span>달성 완료</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 'bold', fontSize: '12px', background: '#fffbeb', padding: '4px 10px', borderRadius: '999px' }}>
                            <AlertCircle style={{ width: '14px', height: '14px' }} />
                            <span>{achievementRate}% 진행 중</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 게이지 바 */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ color: '#9ca3af', fontWeight: '500' }}>현재 실적 채움</span>
                        <span style={{ fontWeight: '800', color: '#111827' }}>
                          {cardSpent.toLocaleString()}원 <span style={{ color: '#d1d5db', fontWeight: '400' }}>/ {PERFORMANCE_GOAL.toLocaleString()}원</span>
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '10px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: '999px', background: card.color, width: `${achievementRate}%`, transition: 'width 0.5s ease-out' }} />
                      </div>
                    </div>
                  </div>

                  {/* 하단 */}
                  <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #f9fafb', fontSize: '11px', color: '#6b7280' }}>
                    {isAchieved ? (
                      <span style={{ color: '#059669', fontWeight: '500' }}>✨ 다음 달 카드 혜택 조건을 충족했습니다!</span>
                    ) : (
                      <span>혜택 조건까지 <strong style={{ color: '#1f2937' }}>{remainingAmount.toLocaleString()}원</strong>이 더 필요합니다.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}