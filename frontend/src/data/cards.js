// src/data/cards.js
export const mockCards = [
  {
    card_id: 1,
    card_company: 'KB국민',
    card_name: 'KB국민 노리2 체크카드',
    performance_condition: 300000,
    benefits: {
      식비: { rate: 5, brands: [] }, // 빈 배열이면 전체 적용
      카페: { rate: 3, brands: ['스타벅스', '투썸', '이디야'] },
      편의점: { rate: 2, brands: ['CU'] }, // CU만 혜택
      문화: { rate: 0, brands: [] },
      쇼핑: { rate: 0, brands: [] },
    }
  },
  {
    card_id: 2,
    card_company: '신한',
    card_name: '신한 Hey Young 체크카드',
    performance_condition: 200000,
    benefits: {
      식비: { rate: 3, brands: ['맥도날드', '버거킹', '롯데리아'] },
      카페: { rate: 10, brands: ['스타벅스', '메가커피'] },
      편의점: { rate: 5, brands: ['GS25', 'GS수퍼'] }, // GS25만 혜택
      문화: { rate: 15, brands: ['CGV', '메가박스', '롯데시네마'] },
      쇼핑: { rate: 5, brands: ['올리브영'] },
    }
  },
]

export const CATEGORIES = ['식비', '카페', '편의점', '문화', '쇼핑']

export const mockConsumption = {
  식비: 87000,
  카페: 32000,
  편의점: 18500,
  문화: 10000,
  쇼핑: 0,
}