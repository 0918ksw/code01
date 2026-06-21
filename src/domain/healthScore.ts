import { getSweeteners } from './sweeteners';
import { toPer100 } from './labelRules';
import type { Product } from './types';

export interface HealthScore {
  /** 0(주의) ~ 100(우수) */
  value: number;
  grade: 'A' | 'B' | 'C' | 'D';
  /** 점수에 영향을 준 항목 설명 */
  factors: string[];
}

function gradeOf(value: number): HealthScore['grade'] {
  if (value >= 80) return 'A';
  if (value >= 60) return 'B';
  if (value >= 40) return 'C';
  return 'D';
}

/**
 * 영양성분과 감미료 부담을 합쳐 0~100 건강 점수를 계산해요.
 * 대안 추천의 정렬 기준으로도 쓰여요. (절대 기준 100g/100mL 환산값 사용)
 */
export function calcHealthScore(product: Product): HealthScore {
  const per100 = toPer100(product.nutrition);
  const factors: string[] = [];
  let score = 100;

  // 당류: 가장 큰 감점 요인
  if (per100.sugars > 0) {
    const penalty = Math.min(40, per100.sugars * 4);
    score -= penalty;
    if (per100.sugars >= 5) factors.push(`당류 100당 ${per100.sugars}g`);
  }

  // 포화지방
  if (per100.saturatedFat > 1.5) {
    score -= Math.min(15, per100.saturatedFat * 3);
    factors.push(`포화지방 100당 ${per100.saturatedFat}g`);
  }

  // 트랜스지방은 강하게 감점
  if (per100.transFat > 0) {
    score -= 15;
    factors.push('트랜스지방 포함');
  }

  // 나트륨
  if (per100.sodium > 120) {
    score -= Math.min(15, (per100.sodium - 120) / 40);
    factors.push(`나트륨 100당 ${Math.round(per100.sodium)}mg`);
  }

  // 감미료 부담: 혈당 영향 + 인공감미료 가짓수
  const sweeteners = getSweeteners(product.sweetenerIds);
  const bloodSugarLoad = sweeteners.reduce((sum, s) => sum + s.bloodSugarImpact, 0);
  if (bloodSugarLoad > 0) {
    score -= Math.min(10, bloodSugarLoad * 3);
    factors.push('혈당에 영향을 주는 감미료 포함');
  }
  const artificialCount = sweeteners.filter((s) => s.type === 'artificial').length;
  if (artificialCount >= 2) {
    score -= 5;
    factors.push(`인공감미료 ${artificialCount}종 혼합`);
  }

  // 단백질은 약간 가점
  if (per100.protein >= 5) {
    score += Math.min(8, per100.protein / 2);
    factors.push(`단백질 100당 ${per100.protein}g`);
  }

  const value = Math.max(0, Math.min(100, Math.round(score)));
  return { value, grade: gradeOf(value), factors };
}
