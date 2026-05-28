import { useState } from 'react'

function DashboardPage({
  registeredCards,
  expenses,
  setExpenses,
}) {
  const [budgets, setBudgets] = useState([])


  const [budgetCategory, setBudgetCategory] =
    useState('식비')

  const [budgetAmount, setBudgetAmount] =
    useState('')

  const [editBudgetIndex, setEditBudgetIndex] =
    useState(null)

  const [place, setPlace] = useState('')
  const [card, setCard] = useState('')
  const [category, setCategory] = useState('식비')
  const [amount, setAmount] = useState('')

  const [editIndex, setEditIndex] =
    useState(null)

  const totalSpent = budgets.reduce(
    (sum, item) => sum + item.spent,
    0
  )

  const totalBudget = budgets.reduce(
    (sum, item) => sum + item.budget,
    0
  )

  const remain = totalBudget - totalSpent

  const colors = {
    식비: '#f59e0b',
    카페: '#8b5cf6',
    편의점: '#ef4444',
    문화: '#10b981',
    쇼핑: '#3b82f6',
  }

  const addBudget = () => {
    if (!budgetAmount) return

    const newBudget = {
      category: budgetCategory,
      budget: Number(budgetAmount),
      spent: 0,
      color: colors[budgetCategory],
    }

    if (editBudgetIndex !== null) {
      const updated = [...budgets]

      updated[editBudgetIndex] = {
        ...updated[editBudgetIndex],
        category: budgetCategory,
        budget: Number(budgetAmount),
      }

      setBudgets(updated)

      setEditBudgetIndex(null)
    } else {
      const exists = budgets.find(
        (item) => item.category === budgetCategory
      )

      if (exists) {
        alert('이미 존재하는 카테고리입니다')
        return
      }

      setBudgets([...budgets, newBudget])
    }

    setBudgetAmount('')
  }

  const editBudget = (index) => {
    const target = budgets[index]

    setBudgetCategory(target.category)
    setBudgetAmount(target.budget)

    setEditBudgetIndex(index)
  }

  const deleteBudget = (index) => {
    const target = budgets[index]

    const hasExpense = expenses.find(
      (item) => item.category === target.category
    )

    if (hasExpense) {
      alert(
        '소비 내역이 있는 카테고리는 삭제할 수 없습니다'
      )

      return
    }

    const updated = budgets.filter(
      (_, i) => i !== index
    )

    setBudgets(updated)
  }

  const addExpense = () => {
    if (!place || !card || !amount) return

    const newExpense = {
      place,
      card,
      category,
      amount: Number(amount),
    }

    if (editIndex !== null) {
      const oldExpense = expenses[editIndex]

      const updatedBudgets = budgets.map((item) => {
        if (item.category === oldExpense.category) {
          return {
            ...item,
            spent: item.spent - oldExpense.amount,
          }
        }

        return item
      }).map((item) => {
        if (item.category === category) {
          return {
            ...item,
            spent: item.spent + Number(amount),
          }
        }

        return item
      })

      setBudgets(updatedBudgets)

      const updatedExpenses = [...expenses]
      updatedExpenses[editIndex] = newExpense

      setExpenses(updatedExpenses)

      setEditIndex(null)
    } else {
      setExpenses([newExpense, ...expenses])

      const updated = budgets.map((item) => {
        if (item.category === category) {
          return {
            ...item,
            spent: item.spent + Number(amount),
          }
        }

        return item
      })

      setBudgets(updated)
    }

    setPlace('')
    setCard('')
    setAmount('')
  }

  const deleteExpense = (index) => {
    const target = expenses[index]

    const updatedBudgets = budgets.map((item) => {
      if (item.category === target.category) {
        return {
          ...item,
          spent: item.spent - target.amount,
        }
      }

      return item
    })

    setBudgets(updatedBudgets)

    const updatedExpenses = expenses.filter(
      (_, i) => i !== index
    )

    setExpenses(updatedExpenses)
  }

  const editExpense = (index) => {
    const target = expenses[index]

    setPlace(target.place)
    setCard(target.card)
    setCategory(target.category)
    setAmount(target.amount)

    setEditIndex(index)
  }

  return (
    <div className="layout">
      <h1 className="page-title">
        소비 내역
      </h1>

      <div className="summary-grid">
        <div className="summary-card">
          <p>총 지출</p>
          <h2>{totalSpent.toLocaleString()}원</h2>
        </div>

        <div className="summary-card">
          <p>총 예산</p>
          <h2>{totalBudget.toLocaleString()}원</h2>
        </div>

        <div className="summary-card">
          <p>잔여 금액</p>
          <h2>{remain.toLocaleString()}원</h2>
        </div>
      </div>

      <div className="card">
        <h2>나의 예산</h2>

        <div className="add-box">
          <select
            value={budgetCategory}
            onChange={(e) =>
              setBudgetCategory(e.target.value)
            }
          >
            <option>식비</option>
            <option>카페</option>
            <option>편의점</option>
            <option>문화</option>
            <option>쇼핑</option>
          </select>

          <input
            type="number"
            placeholder="예산 입력"
            value={budgetAmount}
            onChange={(e) =>
              setBudgetAmount(e.target.value)
            }
          />

          <button onClick={addBudget}>
            {editBudgetIndex !== null
              ? '수정 완료'
              : '+ 추가'}
          </button>
        </div>

        <div className="budget-grid">
          <div>
            {budgets.map((item, index) => (
              <div
                className="budget-item"
                key={item.category}
              >
                <div>
                  <h3>{item.category}</h3>

                  <p>
                    {item.budget.toLocaleString()}원
                  </p>
                </div>

                <div className="expense-buttons">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      editBudget(index)
                    }
                  >
                    수정
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteBudget(index)
                    }
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            {budgets.map((item) => {
              const percent =
                (item.spent / item.budget) * 100

              return (
                <div
                  className="progress-section"
                  key={item.category}
                >
                  <div className="row">
                    <span>{item.category}</span>

                    <span>
                      {item.spent.toLocaleString()} /
                      {item.budget.toLocaleString()}원
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

                  {percent >= 100 ? (
                    <p className="danger">
                      예산 초과
                    </p>
                  ) : percent >= 80 ? (
                    <p className="warning">
                      예산 초과 임박
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="card">
          <h2>소비 내역</h2>

          <div className="add-box vertical">
            <input
              type="text"
              placeholder="사용처"
              value={place}
              onChange={(e) =>
                setPlace(e.target.value)
              }
            />

            <select
              value={card}
              onChange={(e) =>
                setCard(e.target.value)
              }
            >
              <option value="">
                카드 선택
              </option>

              {registeredCards.map((item, index) => (
                <option
                  key={index}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option>식비</option>
              <option>카페</option>
              <option>편의점</option>
              <option>문화</option>
              <option>쇼핑</option>
            </select>

            <input
              type="number"
              placeholder="금액"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

            <button onClick={addExpense}>
              {editIndex !== null
                ? '수정 완료'
                : '+ 추가'}
            </button>
          </div>

          <div className="expense-list">
            {expenses.map((item, index) => (
              <div
                className="expense-item"
                key={index}
              >
                <div>
                  <h3>{item.place}</h3>

                  <p>
                    {item.category} · {item.card}
                  </p>
                </div>

                <div className="expense-right">
                  <h3>
                    {item.amount.toLocaleString()}원
                  </h3>

                  <div className="expense-buttons">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        editExpense(index)
                      }
                    >
                      수정
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteExpense(index)
                      }
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>카드별 혜택 달성도</h2>

          <div className="benefit-card">
            <div>
              <h3>KB국민 노리2</h3>
              <p>전월 실적 달성 완료</p>
            </div>

            <h2>12,500원 적립</h2>
          </div>

          <div className="benefit-card gray">
            <div>
              <h3>신한 Hey Young</h3>
              <p>실적 18,000 / 30,000</p>
            </div>

            <h2>8,000원 적립</h2>
          </div>

          <div className="total-benefit">
            이번달 총 혜택 20,500원
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage