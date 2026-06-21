import { calcHealthScore, type HealthScore } from './healthScore';
import { toPer100, toPerContainer, verifyClaims, type ClaimVerification } from './labelRules';
import { getSweeteners } from './sweeteners';
import type { NutritionFacts, Product, Sweetener } from './types';

export type GapSeverity = 'info' | 'caution' | 'warning';

/** 표시와 실제 성분 사이의 '간극' 한 건 */
export interface LabelGap {
  severity: GapSeverity;
  title: string;
  detail: string;
}

export interface AnalysisResult {
  product: Product;
  score: HealthScore;
  perServing: NutritionFacts;
  per100: NutritionFacts;
  perContainer: NutritionFacts;
  claims: ClaimVerification[];
  sweeteners: Sweetener[];
  gaps: LabelGap[];
}

/**
 * 표시(제로/무설탕/라이트 등)와 실제 성분 사이의 간극을 찾아내요.
 * 이 함수가 FoodCheck의 핵심 가치예요.
 */
function findGaps(product: Product, claims: ClaimVerification[], sweeteners: Sweetener[]): LabelGap[] {
  const gaps: LabelGap[] = [];
  const per100 = toPer100(product.nutrition);
  const perContainer = toPerContainer(product.nutrition);
  const claimTypes = new Set(product.claims);

  // 1) 표시가 규정 기준을 못 맞춘 경우
  for (const c of claims) {
    if (c.meets === false) {
      gaps.push({
        severity: 'warning',
        title: `'${c.rule.label}' 표시가 기준과 맞지 않아요`,
        detail: `${c.rule.basis} 하지만 이 제품은 100${product.nutrition.servingUnit}당 기준을 넘겨요.`,
      });
    }
  }

  // 2) '무설탕/제로'인데 단맛은 감미료로 채운 경우
  const sugarFreeish = claimTypes.has('sugar_free') || claimTypes.has('zero');
  if (sugarFreeish && sweeteners.length > 0) {
    const names = sweeteners.map((s) => s.name).join(', ');
    gaps.push({
      severity: 'info',
      title: '설탕은 없지만 단맛은 감미료로 냈어요',
      detail: `${names}이(가) 들어 있어요. 설탕이 없다고 단맛까지 없는 건 아니에요.`,
    });
  }

  // 3) 당알코올로 당류를 우회 — 혈당/소화 영향
  const sugarAlcoholSweeteners = sweeteners.filter((s) => s.type === 'sugar_alcohol');
  if (sugarFreeish && product.nutrition.sugarAlcohol > 0 && sugarAlcoholSweeteners.length > 0) {
    gaps.push({
      severity: 'caution',
      title: '당류는 0에 가깝지만 당알코올이 들어 있어요',
      detail: `당알코올은 당류 표시에서 빠지지만 일부는 혈당을 올리고, 많이 먹으면 배가 더부룩하거나 설사를 할 수 있어요. (1회 ${product.nutrition.sugarAlcohol}g)`,
    });
  }

  // 4) '라이트'인데 다른 성분은 여전히 높은 경우
  if (claimTypes.has('light')) {
    if (per100.sodium >= 120) {
      gaps.push({
        severity: 'caution',
        title: "'라이트'지만 나트륨은 적지 않아요",
        detail: `열량은 줄였어도 나트륨이 100${product.nutrition.servingUnit}당 ${Math.round(per100.sodium)}mg이에요.`,
      });
    }
    if (per100.sugars >= 5) {
      gaps.push({
        severity: 'caution',
        title: "'라이트'지만 당류는 남아 있어요",
        detail: `당류가 100${product.nutrition.servingUnit}당 ${per100.sugars}g이에요.`,
      });
    }
  }

  // 5) 1회 제공량의 함정 — 한 통이 여러 회 제공량일 때
  if (product.nutrition.servingsPerContainer > 1.2) {
    gaps.push({
      severity: 'info',
      title: '표시는 1회 제공량 기준이에요',
      detail: `한 통은 약 ${product.nutrition.servingsPerContainer}회 분량이라, 다 먹으면 열량은 ${perContainer.calories}kcal, 당류는 ${perContainer.sugars}g이 돼요.`,
    });
  }

  // 6) 카페인이 들어 있는데 표시 강조가 없을 때
  if (product.nutrition.caffeine >= 50) {
    gaps.push({
      severity: 'info',
      title: '카페인이 들어 있어요',
      detail: `1회 ${product.nutrition.caffeine}mg의 카페인이 있어요. 민감하다면 섭취 시간을 고려하세요.`,
    });
  }

  return gaps;
}

export function analyzeProduct(product: Product): AnalysisResult {
  const claims = verifyClaims(product);
  const sweeteners = getSweeteners(product.sweetenerIds);
  return {
    product,
    score: calcHealthScore(product),
    perServing: product.nutrition,
    per100: toPer100(product.nutrition),
    perContainer: toPerContainer(product.nutrition),
    claims,
    sweeteners,
    gaps: findGaps(product, claims, sweeteners),
  };
}
