# 캠퍼스 주변 소비 최적화 웹서비스

> 대학생의 카드 혜택을 가장 쉽게 활용할 수 있도록 돕는 소비 최적화 웹서비스

---

## 프로젝트 소개

본 서비스는 단순한 소비 기록을 넘어 사용자가 보유한 카드의 혜택을 캠퍼스 주변 가게와 연결하여 실질적인 소비 최적화를 돕습니다. 복잡한 금융 지식 없이도 직관적으로 혜택을 파악하고 합리적인 소비 결정을 내릴 수 있도록 설계되었습니다.

---

## 핵심 기능

- **카드 혜택 지도 시각화** : 캠퍼스 주변 가게에서 보유 카드 중 가장 유리한 카드를 지도 위에 자동 비교·표시
- **소비 패턴 분석** : 카테고리별 예산과 실제 소비를 비교하여 그래프로 시각화
- **보유 카드 최적 활용 추천** : 소비 패턴에 가장 유리한 카드를 자동 분석하여 추천
- **전월 실적 관리** : 카드 혜택 발동 조건인 전월 실적 달성 현황과 부족 금액 안내

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프론트엔드 | React + Vite |
| 백엔드 | Spring Boot (Java) |
| 데이터베이스 | MySQL |
| 지도 | 카카오맵 API |
| 그래프 | Chart.js |
| 인증 | JWT |

---

## 팀원 및 역할

| 팀원 | 역할 | 담당 |
|---|---|---|
| 프론트엔드 A + 디자인 | UI 설계, UC-01, UC-03, 공통 컴포넌트 |
| 프론트엔드 B | UC-02, UC-04, 카드 등록 화면 |
| 백엔드 A | 서버 세팅, 인증, 소비 내역 API |
| 백엔드 B + 문서 | 카드 데이터, 추천·실적 API, DB 설계, 아키텍처 |

---

## 프로젝트 구조
```
campus-spending-optimizer/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/  # 공통 컴포넌트
│   │   ├── pages/       # 각 화면
│   │   ├── hooks/       # 커스텀 훅
│   │   ├── api/         # API 호출 함수
│   │   └── assets/      # 이미지, 폰트
└── backend/           # Spring Boot
├── src/
│   └── main/java/
│       ├── auth/        # 인증 서비스
│       ├── map/         # 지도 서비스
│       ├── consumption/ # 소비 서비스
│       ├── card/        # 카드 서비스
│       ├── recommend/   # 추천 서비스
│       └── performance/ # 실적 서비스

## 브랜치 전략
```
main        # 최종 시연용
└── develop # 통합 브랜치
├── feature/teamA
├── feature/teamB
├── feature/teamC
└── feature/teamD

## 커밋 메시지 규칙
feat:     새로운 기능 추가
fix:      버그 수정
docs:     문서 수정
refactor: 코드 리팩토링
style:    UI 스타일 수정
test:     테스트 코드

## 실행 방법

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
```

### 백엔드
```bash
cd backend
./gradlew bootRun
```

---

## 개발 기간
- 전체 개발 기간: 2~3주
- MVP 우선순위: UC-01 → UC-02 → UC-03 → UC-04
