function HomePage() {
  return (
    <div className="layout">
      <h1 className="page-title">홈 대시보드</h1>

      <div className="summary-grid">
        <div className="summary-card">
          <p>이번 달 소비</p>
          <h2>420,000원</h2>
        </div>

        <div className="summary-card">
          <p>절약 금액</p>
          <h2>52,000원</h2>
        </div>

        <div className="summary-card">
          <p>혜택 적립</p>
          <h2>20,500원</h2>
        </div>
      </div>
    </div>
  )
}

export default HomePage