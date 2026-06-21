// FoodCheck 도메인 타입 정의
// 바코드로 인식한 식품을 분석하기 위한 핵심 데이터 모델이에요.

/** 감미료 분류 */
export type SweetenerType =
  | 'sugar_alcohol' // 당알코올 (에리스리톨, 말티톨 등)
  | 'artificial' // 인공감미료 (아스파탐, 수크랄로스 등)
  | 'natural' // 천연 고감미료 (스테비아, 나한과 등)
  | 'rare_sugar'; // 희소당 (알룰로스 등)

/** 소비자 맞춤 해석에 쓰는 주의 태그 */
export type CautionTag =
  | 'blood_sugar' // 혈당에 영향
  | 'diarrhea' // 과다 섭취 시 복부 팽만/설사
  | 'pku' // 페닐케톤뇨증 주의 (아스파탐)
  | 'who_2b' // WHO 발암 가능 물질(2B) 분류 이력
  | 'aftertaste' // 특유의 뒷맛
  | 'dog_toxic' // 반려견에게 독성 (자일리톨 등)
  | 'kids'; // 어린이 다량 섭취 주의

export interface Sweetener {
  id: string;
  /** 한글 표기명 */
  name: string;
  /** 원재료명에 등장할 수 있는 표기 변형/영문 */
  aliases: string[];
  type: SweetenerType;
  /** 한 줄 요약 설명 */
  summary: string;
  /** 조금 더 자세한 설명 (카드 펼침용) */
  detail?: string;
  /** 혈당 영향: 0(거의 없음) ~ 3(설탕에 가까움) */
  bloodSugarImpact: 0 | 1 | 2 | 3;
  /** 설탕 대비 단맛 배수 (예: 600 = 설탕의 600배) */
  sweetness?: number;
  /** 1g당 열량(kcal) */
  kcalPerGram?: number;
  /** 일일섭취허용량(ADI) 안내 문구 */
  adi?: string;
  cautions: CautionTag[];
}

/** 표시(강조표시) 종류 */
export type ClaimType =
  | 'zero' // 제로
  | 'sugar_free' // 무설탕 / 무가당
  | 'light' // 라이트
  | 'low_sugar' // 저당
  | 'low_calorie' // 저칼로리
  | 'low_sodium' // 저나트륨
  | 'low_fat'; // 저지방

/** 1회 제공량 기준 영양성분 */
export interface NutritionFacts {
  /** 1회 제공량 수치 */
  servingSize: number;
  /** 제공량 단위 */
  servingUnit: 'g' | 'mL';
  /** 총 제공 횟수 (한 포장 기준) */
  servingsPerContainer: number;
  calories: number; // kcal
  carbohydrate: number; // g
  sugars: number; // g (당류)
  sugarAlcohol: number; // g (당알코올)
  protein: number; // g
  fat: number; // g
  saturatedFat: number; // g
  transFat: number; // g
  sodium: number; // mg
  caffeine: number; // mg
}

export interface Product {
  barcode: string;
  name: string;
  brand: string;
  /** 비교/대안 추천을 위한 카테고리 (예: '탄산음료') */
  category: string;
  /** 포장에 표시된 강조표시 */
  claims: ClaimType[];
  /** 원재료명 (표시 순서대로) */
  ingredients: string[];
  /** 포함된 감미료 id 목록 */
  sweetenerIds: string[];
  nutrition: NutritionFacts;
  /** 카드 배경에 쓰는 대표 색 (이미지 대용) */
  accentColor: string;
}

/** 사용자 맞춤 프로필 */
export type HealthGoal =
  | 'diet' // 체중/칼로리 관리
  | 'blood_sugar' // 혈당 관리
  | 'low_sodium' // 나트륨 제한
  | 'kids' // 아이를 위한 선택
  | 'pregnancy' // 임신/수유 중
  | 'caffeine_sensitive' // 카페인 민감
  | 'sensitive_gut'; // 장이 예민함

export interface UserProfile {
  goals: HealthGoal[];
}
