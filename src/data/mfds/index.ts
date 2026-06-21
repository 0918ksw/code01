import type { Product } from '../../domain/types';
import { callFoodSafetyApi } from './client';
import { mfdsConfig } from './config';
import { BARCODE_FIELDS, mapToProduct, pick } from './mapper';

export { isMfdsEnabled } from './config';

/**
 * 식약처(식품안전나라) API로 바코드에 해당하는 제품을 조회해요.
 *
 * 흐름:
 *  1) 바코드연계제품정보(C005)에서 바코드 → 제품명/제조사/식품유형
 *  2) 식품영양성분DB(I2790)에서 제품명 → 영양성분
 *  3) 두 결과를 합쳐 Product 로 변환
 *
 * 데이터를 못 찾으면 null, 호출 자체가 실패하면 예외를 던져요.
 */
export async function fetchProductByBarcode(
  barcode: string,
  signal?: AbortSignal,
): Promise<Product | null> {
  const productRows = await callFoodSafetyApi(
    mfdsConfig.barcodeService,
    { [mfdsConfig.barcodeParam]: barcode },
    { signal },
  );
  const productRow = productRows[0];
  if (!productRow) return null;

  const name = pick(productRow, BARCODE_FIELDS.name);
  let nutritionRow = null;
  if (name) {
    try {
      const nutritionRows = await callFoodSafetyApi(
        mfdsConfig.nutritionService,
        { [mfdsConfig.nutritionNameParam]: name },
        { signal, end: 1 },
      );
      nutritionRow = nutritionRows[0] ?? null;
    } catch {
      // 영양성분 조회 실패해도 제품 기본정보는 보여줘요.
      nutritionRow = null;
    }
  }

  return mapToProduct(barcode, productRow, nutritionRow);
}
