import type { Product } from '../domain/types';
import { SEED_PRODUCTS } from './products';

// 바코드로 제품을 조회하는 단일 진입점이에요.
// 지금은 시드 데이터에서 찾지만, 아래 fetchFromOpenFoodFacts 처럼
// 실제 API 연동 함수로 교체하면 화면/분석 코드는 손대지 않아도 돼요.

const BY_BARCODE = new Map(SEED_PRODUCTS.map((p) => [p.barcode, p]));

export interface LookupResult {
  product: Product | null;
  /** 데이터를 어디서 가져왔는지 */
  source: 'seed' | 'remote' | 'not_found';
}

/** 바코드로 제품을 조회해요. */
export async function lookupByBarcode(barcode: string): Promise<LookupResult> {
  const normalized = barcode.trim();
  const product = BY_BARCODE.get(normalized);
  if (product) {
    return { product, source: 'seed' };
  }
  // TODO: 시드에 없으면 실제 API로 조회 (네트워크 권한/키 필요)
  // const remote = await fetchFromOpenFoodFacts(normalized);
  // if (remote) return { product: remote, source: 'remote' };
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

/**
 * 실제 연동 예시 (참고용, 호출하지 않음).
 * Open Food Facts 는 무료이고 키가 필요 없지만 한국 제품 커버리지는 제한적이에요.
 * 식약처 식품영양성분 DB(C005)는 키가 필요하고 국내 가공식품 커버리지가 좋아요.
 */
// async function fetchFromOpenFoodFacts(barcode: string): Promise<Product | null> {
//   const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
//   if (!res.ok) return null;
//   const data = await res.json();
//   if (data.status !== 1) return null;
//   return mapOpenFoodFactsToProduct(data.product); // 매핑 함수는 별도 구현
// }
