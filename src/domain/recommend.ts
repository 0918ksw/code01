import { calcHealthScore, type HealthScore } from './healthScore';
import { getProductsInCategory } from '../data/productRepository';
import type { Product } from './types';

export interface Alternative {
  product: Product;
  score: HealthScore;
  /** 기준 제품 대비 점수 차이 (양수면 더 나음) */
  scoreDelta: number;
  /** 추천 이유 한 줄 */
  reason: string;
}

function reasonFor(base: Product, candidate: Product): string {
  const baseN = base.nutrition;
  const candN = candidate.nutrition;
  if (candN.sugars < baseN.sugars - 1) return `당류가 ${baseN.sugars - candN.sugars}g 더 적어요`;
  if (candN.calories < baseN.calories - 10) return `열량이 ${Math.round(baseN.calories - candN.calories)}kcal 더 낮아요`;
  if (candN.sodium < baseN.sodium - 20) return `나트륨이 ${Math.round(baseN.sodium - candN.sodium)}mg 더 적어요`;
  if (candidate.sweetenerIds.length < base.sweetenerIds.length) return '감미료가 더 단순해요';
  return '전반적으로 균형이 더 좋아요';
}

/**
 * 같은 카테고리에서 기준 제품보다 건강 점수가 높은 대안을 추천해요.
 * 점수가 높은 순으로 최대 3개를 돌려줘요.
 */
export function recommendAlternatives(base: Product, limit = 3): Alternative[] {
  const baseScore = calcHealthScore(base).value;
  return getProductsInCategory(base.category, base.barcode)
    .map((product) => {
      const score = calcHealthScore(product);
      return { product, score, scoreDelta: score.value - baseScore, reason: reasonFor(base, product) };
    })
    .filter((a) => a.scoreDelta > 0)
    .sort((a, b) => b.score.value - a.score.value)
    .slice(0, limit);
}
