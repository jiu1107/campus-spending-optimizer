
function PerformancePage({
  registeredCards,
  expenses,
}) {
  const totalCurrent = registeredCards.reduce(
    (sum, card) => {
      const cardTotal = expenses
        .filter((item) =>
          item.card === card.name
        )
        .reduce(
          (s, item) => s + item.amount,
          0
        )

      return sum + cardTotal
    },
    0
  )

  const totalTarget = registeredCards.reduce(
    (sum, item) => sum + item.target,
    0
  )

  return (
    <div className="layout">
      <h1 className="page-title">
        전월 실적 관리
      </h1>

      <div className="summary-grid">
        <div className="summary-card">
          <p>총 사용 금액</p>
          <h2>
            {totalCurrent.toLocaleString()}원
          </h2>
        </div>

        <div className="summary-card">
          <p>총 목표 금액</p>
          <h2>
            {totalTarget.toLocaleString()}원
          </h2>
        </div>

        <div className="summary-card">
          <p>등록 카드</p>
          <h2>
            {registeredCards.length}개
          </h2>
        </div>
      </div>

      <div className="card-list">
        {registeredCards.map((item, index) => {
          const current = expenses
            .filter((expense) =>
              expense.card === item.name
            )
            .reduce(
              (sum, expense) =>
                sum + expense.amount,
              0
            )

          const percent =
            (current / item.target) * 100

          return (
            <div
              className="card"
              key={index}
            >
              <div className="card-header">
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.company}</p>
                </div>

                {percent >= 100 ? (
                  <div className="complete-badge">
                    달성 완료
                  </div>
                ) : (
                  <div className="progress-badge">
                    진행중
                  </div>
                )}
              </div>

              <div className="money-box">
                <h1>
                  {current.toLocaleString()}원
                </h1>

                <span>
                  /
                  {item.target.toLocaleString()}원
                </span>
              </div>

              <div className="bar-background">
                <div
                  className="bar-fill"
                  style={{
                    width: `${percent}%`,
                    background: item.color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PerformancePage
