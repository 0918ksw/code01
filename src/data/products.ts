import type { Product } from '../domain/types';

// ⚠️ 예시(시드) 데이터예요.
// 실제 서비스에서는 식품안전나라 식품영양성분 DB(식약처, 품목 C005)나
// Open Food Facts API에서 바코드로 조회한 값으로 대체하세요.
// 데이터 출처만 productRepository 에서 바꾸면 나머지 분석 로직은 그대로 동작해요.
// 영양 수치는 카테고리별로 그럴듯하게 구성한 참고용 값이에요.

export const SEED_PRODUCTS: Product[] = [
  // ── 탄산음료 ──────────────────────────────
  {
    barcode: '8801056011234',
    name: '제로 콜라 355mL',
    brand: '예시콜라',
    category: '탄산음료',
    claims: ['zero', 'sugar_free'],
    ingredients: ['정제수', '탄산가스', '카라멜색소', '인산', '향료', '아스파탐', '아세설팜칼륨', '카페인'],
    sweetenerIds: ['aspartame', 'acesulfame_k'],
    nutrition: {
      servingSize: 355, servingUnit: 'mL', servingsPerContainer: 1,
      calories: 0, carbohydrate: 0, sugars: 0, sugarAlcohol: 0,
      protein: 0, fat: 0, saturatedFat: 0, transFat: 0, sodium: 35, caffeine: 34,
    },
    accentColor: '#1d1d1f',
  },
  {
    barcode: '8801056012231',
    name: '오리지널 콜라 355mL',
    brand: '예시콜라',
    category: '탄산음료',
    claims: [],
    ingredients: ['정제수', '설탕', '탄산가스', '카라멜색소', '인산', '향료', '카페인'],
    sweetenerIds: [],
    nutrition: {
      servingSize: 355, servingUnit: 'mL', servingsPerContainer: 1,
      calories: 151, carbohydrate: 39, sugars: 39, sugarAlcohol: 0,
      protein: 0, fat: 0, saturatedFat: 0, transFat: 0, sodium: 30, caffeine: 34,
    },
    accentColor: '#b3261e',
  },
  {
    barcode: '8801056013238',
    name: '제로 사이다 500mL',
    brand: '맑은청',
    category: '탄산음료',
    claims: ['zero', 'sugar_free'],
    ingredients: ['정제수', '탄산가스', '구연산', '향료', '수크랄로스', '아세설팜칼륨'],
    sweetenerIds: ['sucralose', 'acesulfame_k'],
    nutrition: {
      servingSize: 250, servingUnit: 'mL', servingsPerContainer: 2,
      calories: 0, carbohydrate: 0, sugars: 0, sugarAlcohol: 0,
      protein: 0, fat: 0, saturatedFat: 0, transFat: 0, sodium: 15, caffeine: 0,
    },
    accentColor: '#2f7d3a',
  },
  {
    barcode: '8801056014235',
    name: '스테비아 사이다 250mL',
    brand: '맑은청',
    category: '탄산음료',
    claims: ['zero', 'sugar_free'],
    ingredients: ['정제수', '탄산가스', '구연산', '효소처리스테비아', '에리스리톨', '향료'],
    sweetenerIds: ['stevia', 'erythritol'],
    nutrition: {
      servingSize: 250, servingUnit: 'mL', servingsPerContainer: 1,
      calories: 4, carbohydrate: 1, sugars: 0, sugarAlcohol: 1,
      protein: 0, fat: 0, saturatedFat: 0, transFat: 0, sodium: 10, caffeine: 0,
    },
    accentColor: '#4f9d5d',
  },

  // ── 에너지음료 ────────────────────────────
  {
    barcode: '8801056020118',
    name: '제로 에너지드링크 250mL',
    brand: '부스트',
    category: '에너지음료',
    claims: ['zero', 'sugar_free'],
    ingredients: ['정제수', '탄산가스', '구연산', '타우린', '카페인', '수크랄로스', '아세설팜칼륨', '향료'],
    sweetenerIds: ['sucralose', 'acesulfame_k'],
    nutrition: {
      servingSize: 250, servingUnit: 'mL', servingsPerContainer: 1,
      calories: 5, carbohydrate: 1, sugars: 0, sugarAlcohol: 0,
      protein: 0, fat: 0, saturatedFat: 0, transFat: 0, sodium: 105, caffeine: 80,
    },
    accentColor: '#0b6bcb',
  },
  {
    barcode: '8801056021115',
    name: '오리지널 에너지드링크 250mL',
    brand: '부스트',
    category: '에너지음료',
    claims: [],
    ingredients: ['정제수', '설탕', '탄산가스', '구연산', '타우린', '카페인', '향료'],
    sweetenerIds: [],
    nutrition: {
      servingSize: 250, servingUnit: 'mL', servingsPerContainer: 1,
      calories: 112, carbohydrate: 28, sugars: 27, sugarAlcohol: 0,
      protein: 0, fat: 0, saturatedFat: 0, transFat: 0, sodium: 105, caffeine: 80,
    },
    accentColor: '#1565c0',
  },

  // ── 단백질음료 ────────────────────────────
  {
    barcode: '8801056030112',
    name: '제로슈가 프로틴 250mL',
    brand: '데일리핏',
    category: '단백질음료',
    claims: ['sugar_free', 'low_fat'],
    ingredients: ['정제수', '농축유청단백', '분리유단백', '에리스리톨', '수크랄로스', '향료'],
    sweetenerIds: ['erythritol', 'sucralose'],
    nutrition: {
      servingSize: 250, servingUnit: 'mL', servingsPerContainer: 1,
      calories: 120, carbohydrate: 5, sugars: 0, sugarAlcohol: 4,
      protein: 20, fat: 1.5, saturatedFat: 1, transFat: 0, sodium: 160, caffeine: 0,
    },
    accentColor: '#6d4ad6',
  },
  {
    barcode: '8801056031119',
    name: '단백질 초코드링크 250mL',
    brand: '데일리핏',
    category: '단백질음료',
    claims: [],
    ingredients: ['정제수', '설탕', '농축유청단백', '코코아분말', '향료'],
    sweetenerIds: [],
    nutrition: {
      servingSize: 250, servingUnit: 'mL', servingsPerContainer: 1,
      calories: 190, carbohydrate: 22, sugars: 18, sugarAlcohol: 0,
      protein: 18, fat: 3, saturatedFat: 2, transFat: 0, sodium: 150, caffeine: 0,
    },
    accentColor: '#8d6e63',
  },

  // ── 요거트 ────────────────────────────────
  {
    barcode: '8801056040116',
    name: '무가당 그릭요거트 100g',
    brand: '목장이야기',
    category: '요거트',
    claims: ['sugar_free'],
    ingredients: ['원유', '유산균'],
    sweetenerIds: [],
    nutrition: {
      servingSize: 100, servingUnit: 'g', servingsPerContainer: 1,
      calories: 65, carbohydrate: 4, sugars: 4, sugarAlcohol: 0,
      protein: 9, fat: 1.5, saturatedFat: 1, transFat: 0, sodium: 40, caffeine: 0,
    },
    accentColor: '#3b82a0',
  },
  {
    barcode: '8801056041113',
    name: '라이트 과일요거트 100g',
    brand: '목장이야기',
    category: '요거트',
    claims: ['light'],
    ingredients: ['원유', '설탕', '딸기과즙', '말티톨', '유산균', '향료'],
    sweetenerIds: ['maltitol'],
    nutrition: {
      servingSize: 100, servingUnit: 'g', servingsPerContainer: 1,
      calories: 78, carbohydrate: 13, sugars: 9, sugarAlcohol: 3,
      protein: 4, fat: 1, saturatedFat: 0.6, transFat: 0, sodium: 55, caffeine: 0,
    },
    accentColor: '#e07a9b',
  },

  // ── 아이스크림 ────────────────────────────
  {
    barcode: '8801056050110',
    name: '제로 바닐라 아이스크림 100mL',
    brand: '스쿱',
    category: '아이스크림',
    claims: ['zero', 'sugar_free'],
    ingredients: ['정제수', '유크림', '말티톨', '에리스리톨', '수크랄로스', '유화제', '향료'],
    sweetenerIds: ['maltitol', 'erythritol', 'sucralose'],
    nutrition: {
      servingSize: 100, servingUnit: 'mL', servingsPerContainer: 1,
      calories: 70, carbohydrate: 16, sugars: 0, sugarAlcohol: 14,
      protein: 2, fat: 3, saturatedFat: 2, transFat: 0, sodium: 45, caffeine: 0,
    },
    accentColor: '#caa46a',
  },
  {
    barcode: '8801056051117',
    name: '오리지널 바닐라 아이스크림 100mL',
    brand: '스쿱',
    category: '아이스크림',
    claims: [],
    ingredients: ['유크림', '설탕', '탈지분유', '난황', '바닐라향', '유화제'],
    sweetenerIds: [],
    nutrition: {
      servingSize: 100, servingUnit: 'mL', servingsPerContainer: 1,
      calories: 207, carbohydrate: 24, sugars: 21, sugarAlcohol: 0,
      protein: 3, fat: 11, saturatedFat: 7, transFat: 0.2, sodium: 60, caffeine: 0,
    },
    accentColor: '#d2b48c',
  },

  // ── 과자 ──────────────────────────────────
  {
    barcode: '8801056060114',
    name: '라이트 감자칩 60g',
    brand: '크런치',
    category: '과자',
    claims: ['light'],
    ingredients: ['감자', '식물성유지', '정제소금', '향미증진제'],
    sweetenerIds: [],
    nutrition: {
      servingSize: 30, servingUnit: 'g', servingsPerContainer: 2,
      calories: 150, carbohydrate: 16, sugars: 0.5, sugarAlcohol: 0,
      protein: 2, fat: 9, saturatedFat: 3.5, transFat: 0, sodium: 180, caffeine: 0,
    },
    accentColor: '#e0a800',
  },
];
