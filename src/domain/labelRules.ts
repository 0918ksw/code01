import type { ClaimType, NutritionFacts, Product } from './types';

// 식품의약품안전처 '식품등의 표시기준'의 강조표시(영양강조표시) 요건을 단순화해 옮긴 거예요.
// 액체(음료)와 고체 식품의 기준이 다르므로 단위에 따라 분기해요.
// 실제 규정 갱신 시 이 표만 수정하면 검증 로직 전체가 따라와요.

export interface ClaimRule {
  type: ClaimType;
  label: string; // 화면 표기명
  /** 검증 설명 (왜 이 기준인지) */
  basis: string;
  /**
   * 100g(고체) / 100mL(액체)당 기준값을 만족하는지 검사해요.
   * 만족하면 true(=표시가 규정에 부합).
   */
  check: (per100: NutritionFacts, unit: 'g' | 'mL') => boolean;
  /** 비교 대상이 필요한 상대표시(예: 라이트)인지 */
  relative?: boolean;
}

export const CLAIM_RULES: Record<ClaimType, ClaimRule> = {
  sugar_free: {
    type: 'sugar_free',
    label: '무설탕·무가당',
    basis: '당류가 100g(100mL)당 0.5g 미만이어야 해요.',
    check: (p) => p.sugars < 0.5,
  },
  zero: {
    type: 'zero',
    label: '제로',
    basis: '음료 기준 100mL당 4kcal 미만이면 "무열량"으로 볼 수 있어요.',
    check: (p, unit) => (unit === 'mL' ? p.calories < 4 : p.calories < 5),
  },
  low_sugar: {
    type: 'low_sugar',
    label: '저당',
    basis: '당류가 고체 100g당 5g, 액체 100mL당 2.5g 미만이어야 해요.',
    check: (p, unit) => (unit === 'mL' ? p.sugars <= 2.5 : p.sugars <= 5),
  },
  low_calorie: {
    type: 'low_calorie',
    label: '저칼로리',
    basis: '열량이 고체 100g당 40kcal, 액체 100mL당 20kcal 미만이어야 해요.',
    check: (p, unit) => (unit === 'mL' ? p.calories < 20 : p.calories < 40),
  },
  low_sodium: {
    type: 'low_sodium',
    label: '저나트륨',
    basis: '나트륨이 100g(100mL)당 120mg 미만이어야 해요.',
    check: (p) => p.sodium < 120,
  },
  low_fat: {
    type: 'low_fat',
    label: '저지방',
    basis: '지방이 고체 100g당 3g, 액체 100mL당 1.5g 미만이어야 해요.',
    check: (p, unit) => (unit === 'mL' ? p.fat <= 1.5 : p.fat <= 3),
  },
  light: {
    type: 'light',
    label: '라이트',
    basis: '같은 종류의 일반 제품보다 열량(또는 특정 영양소)이 25% 이상 적어야 해요.',
    check: () => true, // 상대표시라 단독 수치로는 판정 불가
    relative: true,
  },
};

/** 1회 제공량 기준 영양성분을 100g/100mL 기준으로 환산해요. */
export function toPer100(n: NutritionFacts): NutritionFacts {
  const factor = n.servingSize > 0 ? 100 / n.servingSize : 1;
  const scale = (v: number) => Math.round(v * factor * 100) / 100;
  return {
    ...n,
    calories: scale(n.calories),
    carbohydrate: scale(n.carbohydrate),
    sugars: scale(n.sugars),
    sugarAlcohol: scale(n.sugarAlcohol),
    protein: scale(n.protein),
    fat: scale(n.fat),
    saturatedFat: scale(n.saturatedFat),
    transFat: scale(n.transFat),
    sodium: scale(n.sodium),
    caffeine: scale(n.caffeine),
  };
}

/** 포장 한 통 전체 기준으로 환산해요. */
export function toPerContainer(n: NutritionFacts): NutritionFacts {
  const c = Math.max(1, n.servingsPerContainer);
  const scale = (v: number) => Math.round(v * c * 100) / 100;
  return {
    ...n,
    calories: scale(n.calories),
    carbohydrate: scale(n.carbohydrate),
    sugars: scale(n.sugars),
    sugarAlcohol: scale(n.sugarAlcohol),
    protein: scale(n.protein),
    fat: scale(n.fat),
    saturatedFat: scale(n.saturatedFat),
    transFat: scale(n.transFat),
    sodium: scale(n.sodium),
    caffeine: scale(n.caffeine),
  };
}

export interface ClaimVerification {
  rule: ClaimRule;
  /** 규정 기준 충족 여부 (상대표시는 null) */
  meets: boolean | null;
}

/** 제품의 표시들이 규정 기준을 충족하는지 검증해요. */
export function verifyClaims(product: Product): ClaimVerification[] {
  const per100 = toPer100(product.nutrition);
  const unit = product.nutrition.servingUnit;
  return product.claims.map((claim) => {
    const rule = CLAIM_RULES[claim];
    return {
      rule,
      meets: rule.relative ? null : rule.check(per100, unit),
    };
  });
}
