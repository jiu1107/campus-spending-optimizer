
function HomePage({
  registeredCards = [],
  expenses = [],
}) {
  const totalSpent = expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  )

  return (
    <div className="layout">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            홈
          </h1>

          <p className="page-subtitle">
            이번 달 소비와 카드 혜택 현황
          </p>
        </div>
      </div>

      <div className="hero-home">
        <div className="hero-left">
          <div className="hero-top-text">
            <p>이번 달 소비</p>

            <h1>
              {totalSpent.toLocaleString()}원
            </h1>


          </div>

          <div className="hero-graph">
            <div className="graph-bar one"></div>
            <div className="graph-bar two"></div>
            <div className="graph-bar three"></div>
            <div className="graph-bar four"></div>
          </div>
        </div>

        <div className="hero-side">
          <div className="mini-summary">
            <p>예상 혜택</p>
            <h2>20,500원</h2>
          </div>

          <div className="mini-summary">
            <p>등록 카드</p>
            <h2>
              {registeredCards.length}개
            </h2>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="card">
          <div className="section-title-row">
            <h2>최근 소비 내역</h2>
          </div>

          {expenses.length === 0 && (
            <div className="expense-item">
              소비 내역이 없습니다.
            </div>
          )}

          {expenses.slice(-4).reverse().map(
            (item, index) => (
              <div
                className="expense-item"
                key={index}
              >
                <div>
                  <h3>{item.place}</h3>

                  <p>
                    {item.category}
                  </p>
                </div>

                <strong>
                  {item.amount.toLocaleString()}원
                </strong>
              </div>
            )
          )}
        </div>

        <div className="card">
          <div className="section-title-row">
            <h2>등록 카드</h2>
          </div>

          {registeredCards.map(
            (item, index) => (
              <div
                className="benefit-card"
                key={index}
              >
                <div>
                  <strong>
                    {item.name}
                  </strong>

                  <p>
                    {item.company}
                  </p>
                </div>

                <div className="card-target">
                  목표
                  <br />
                  {item.target.toLocaleString()}원
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
