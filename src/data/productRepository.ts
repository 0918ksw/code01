import type { Product } from '../domain/types';
import { SEED_PRODUCTS } from './products';
import { fetchProductByBarcode, isMfdsEnabled } from './mfds';

// 바코드로 제품을 조회하는 단일 진입점이에요.
// 1) 로컬 시드 DB → 2) 식약처(식품안전나라) API 순서로 찾아요.
// 데이터 출처가 바뀌어도 화면/분석 코드는 손대지 않아요.

const BY_BARCODE = new Map(SEED_PRODUCTS.map((p) => [p.barcode, p]));

export interface LookupResult {
  product: Product | null;
  /** 데이터를 어디서 가져왔는지 */
  source: 'seed' | 'remote' | 'not_found';
  /** 원격 조회 중 발생한 오류 메시지 (있으면) */
  error?: string;
}

/** 바코드로 제품을 조회해요. */
export async function lookupByBarcode(barcode: string, signal?: AbortSignal): Promise<LookupResult> {
  const normalized = barcode.trim();

  // 1) 로컬 시드 DB (오프라인·시연용)
  const seeded = BY_BARCODE.get(normalized);
  if (seeded) return { product: seeded, source: 'seed' };

  // 2) 식약처 API (키가 설정된 경우에만)
  if (isMfdsEnabled()) {
    try {
      const remote = await fetchProductByBarcode(normalized, signal);
      if (remote) return { product: remote, source: 'remote' };
    } catch (e) {
      return {
        product: null,
        source: 'not_found',
        error: e instanceof Error ? e.message : '식약처 조회에 실패했어요.',
      };
    }
  }

  return { product: null, source: 'not_found' };
}

/** 같은 카테고리의 다른 제품들 (대안 추천용) */
export function getProductsInCategory(category: string, excludeBarcode?: string): Product[] {
  return SEED_PRODUCTS.filter(
    (p) => p.category === category && p.barcode !== excludeBarcode,
  );
}

/** 데모용: 등록된 모든 제품 */
export function getAllProducts(): Product[] {
  return SEED_PRODUCTS;
}
