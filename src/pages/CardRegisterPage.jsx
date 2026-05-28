
import { useState } from 'react'

function CardRegisterPage({
  registeredCards,
  setRegisteredCards,
}) {
  const [cardNumber, setCardNumber] =
    useState('')

  const [expire, setExpire] =
    useState('')

  const [cvc, setCvc] =
    useState('')

  const [password, setPassword] =
    useState('')

  const cardDB = {
    '3560': {
      company: 'KB국민카드',
      name: 'KB국민 노리2',
      benefit1: '카페 10% 할인',
      benefit2: '편의점 5% 적립',
      color: '#4361ee',
      target: 300000,
    },

    '4370': {
      company: '신한카드',
      name: '신한 Hey Young',
      benefit1: '배달앱 7% 할인',
      benefit2: '카페 5% 적립',
      color: '#10b981',
      target: 230000,
    },

    '5210': {
      company: '삼성카드',
      name: '삼성 iD ON',
      benefit1: '쇼핑 10% 할인',
      benefit2: '대중교통 할인',
      color: '#ef4444',
      target: 200000,
    },
  }

  const registerCard = () => {
    const prefix = cardNumber.slice(0, 4)

    const found = cardDB[prefix]

    if (!found) {
      alert('등록되지 않은 카드입니다')
      return
    }

    const exists = registeredCards.find(
      (item) => item.name === found.name
    )

    if (exists) {
      alert('이미 등록된 카드입니다')
      return
    }

    setRegisteredCards([
      ...registeredCards,
      {
        ...found,
        number: cardNumber,
        expire,
      },
    ])
  }

  return (
    <div className="layout">
      <h1 className="page-title">
        카드 등록
      </h1>

      <div className="summary-grid">
        <div className="summary-card">
          <p>등록 카드</p>
          <h2>
            {registeredCards.length}개
          </h2>
        </div>

        <div className="summary-card">
          <p>활성 혜택</p>
          <h2>
            {registeredCards.length * 2}개
          </h2>
        </div>

        <div className="summary-card">
          <p>예상 적립</p>
          <h2>20,500원</h2>
        </div>
      </div>

      <div className="card">
        <h2>카드 정보 입력</h2>

        <div className="add-box vertical">
          <input
            type="text"
            placeholder="카드 번호 입력"
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="만료일 (MM/YY)"
            value={expire}
            onChange={(e) =>
              setExpire(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="CVC"
            value={cvc}
            onChange={(e) =>
              setCvc(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="카드 비밀번호 앞 2자리"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button onClick={registerCard}>
            카드 등록
          </button>
        </div>
      </div>

      {registeredCards.map((savedCard, index) => (
        <div
          className="card saved-card"
          key={index}
        >
          <h2>등록된 카드</h2>

          <div
            className="card-preview"
            style={{
              background: savedCard.color,
            }}
          >
            <div>
              <p>{savedCard.company}</p>

              <h2>{savedCard.name}</h2>
            </div>

            <div className="card-number">
              {savedCard.number}
            </div>

            <div className="card-expire">
              {savedCard.expire}
            </div>
          </div>

          <div className="benefit-box">
            <h3>혜택 정보</h3>

            <p>
              • {savedCard.benefit1}
            </p>

            <p>
              • {savedCard.benefit2}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CardRegisterPage
