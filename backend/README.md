# 대학생 소비 관리 시스템 - 백엔드 가이드

본 프로젝트는 '대학생을 위한 소비 관리 및 카드 추천 시스템'의 백엔드 서버입니다. **Java 17**과 **Spring Boot 3.2.5**를 기반으로 구축되었습니다.

## 🛠 주요 기술 스택
- **Framework**: Spring Boot 3.2.5
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security + JWT (JSON Web Token)
- **API**: RESTful API
- **Utilities**: Lombok, Jackson, JJWT

## 📁 패키지 구조
- `domain`: 엔티티(Entity) 및 리포지토리(Repository) 정의 (User, Consumption, Card 등)
- `service`: 핵심 비즈니스 로직 (카드 추천 점수 계산, 소비 집계 등)
- `controller`: REST API 엔드포인트 정의
- `dto`: 요청(Request) 및 응답(Response) 데이터 객체
- `config`: 보안 및 기타 설정 클래스
- `util`: JWT 처리 등 유틸리티 클래스
- `filter`: JWT 인증 필터

## 🚀 실행 방법
1. **MySQL 데이터베이스 생성**:
   ```sql
   CREATE DATABASE consumption_db;
   ```
2. **`application.properties` 설정**:
   - 데이터베이스 접속 정보(`username`, `password`)를 본인의 환경에 맞게 수정합니다.
   - `jwt.secret`을 안전한 키로 변경합니다.
3. **Maven 빌드 및 실행**:
   ```bash
   ./mvnw spring-boot:run
   ```

## 💡 핵심 기능 설명
1. **카드 추천 알고리즘 (`RecommendationService`)**:
   - 사용자의 최근 1개월 소비 패턴을 분석하여 선호 카테고리를 추출합니다.
   - 현재 위치(위도, 경도)를 기반으로 주변 가맹점 혜택을 분석합니다.
   - **가중치 로직**: `(선호 카테고리 매칭 점수 * 0.4) + (최대 혜택률 * 0.6)` 공식을 통해 최적의 카드를 추천합니다.
2. **소비 집계 API (`ConsumptionService`)**:
   - 기간별, 카테고리별 소비 금액을 SQL `GROUP BY`를 통해 효율적으로 집계하여 대시보드용 데이터를 제공합니다.
3. **보안 (`SecurityConfig`, `JwtUtil`)**:
   - JWT 기반의 무상태(Stateless) 인증을 구현하여 확장성을 확보했습니다.

## 🔗 주요 API 엔드포인트
- `POST /api/auth/signup`: 회원가입
- `POST /api/auth/login`: 로그인 (JWT 발급)
- `POST /api/consumptions/{userId}`: 소비 내역 등록
- `GET /api/consumptions/summary/category/{userId}`: 카테고리별 소비 통계 조회
- `GET /api/recommendations/cards/{userId}`: 맞춤형 카드 추천 리스트 조회

---
**개발자(팀원 D)**: 본 코드는 설계 문서의 내용을 충실히 반영하고 있으며, 실제 운영 환경에 맞춰 추가적인 예외 처리 및 성능 최적화가 가능하도록 유연하게 설계되었습니다.
