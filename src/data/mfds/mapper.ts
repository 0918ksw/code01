import { detectSweetenersFromIngredients } from '../../domain/sweeteners';
import type { ClaimType, NutritionFacts, Product } from '../../domain/types';
import type { MfdsRow } from './client';

// ⚙️ 식약처 서비스마다, 그리고 개정 시기마다 필드명이 달라요.
// 사용하는 서비스의 실제 응답에 맞춰 여기만 고치면 돼요.

/** 바코드연계제품정보(C005) 필드명 */
export const BARCODE_FIELDS = {
  barcode: 'BAR_CD',
  name: 'PRDLST_NM',
  reportNo: 'PRDLST_REPORT_NO',
  maker: 'BSSH_NM',
  foodType: 'PRDLST_DCNM',
} as const;

/** 식품영양성분DB(I2790) 필드명 */
export const NUTRITION_FIELDS = {
  name: 'DESC_KOR',
  servingSize: 'SERVING_SIZE',
  calories: 'NUTR_CONT1', // 열량 kcal
  carbohydrate: 'NUTR_CONT2', // 탄수화물 g
  protein: 'NUTR_CONT3', // 단백질 g
  fat: 'NUTR_CONT4', // 지방 g
  sugars: 'NUTR_CONT5', // 당류 g
  sodium: 'NUTR_CONT6', // 나트륨 mg
  saturatedFat: 'NUTR_CONT8', // 포화지방 g
  transFat: 'NUTR_CONT9', // 트랜스지방 g
  maker: 'MAKER_NAME',
  group: 'GROUP_NAME',
} as const;

/** "30g", "1회 제공량(100ml)", "240" 같은 문자열에서 수치/단위를 뽑아내요. */
export function parseServing(raw: string | undefined): { size: number; unit: 'g' | 'mL' } {
  if (!raw) return { size: 100, unit: 'g' };
  const num = Number(raw.replace(/[^\d.]/g, ''));
  const isLiquid = /ml|밀리|리터|l\b/i.test(raw);
  return { size: Number.isFinite(num) && num > 0 ? num : 100, unit: isLiquid ? 'mL' : 'g' };
}

function num(row: MfdsRow, key: string): number {
  const v = Number((row[key] ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(v) ? v : 0;
}

/** 제품명 문자열에서 강조표시(제로/무설탕/라이트 등)를 추정해요. */
export function detectClaimsFromName(name: string): ClaimType[] {
  const claims: ClaimType[] = [];
  const n = name.replace(/\s/g, '');
  if (/제로|zero/i.test(n)) claims.push('zero');
  if (/무설탕|무가당|sugar\s*free/i.test(n)) claims.push('sugar_free');
  if (/저당/i.test(n)) claims.push('low_sugar');
  if (/라이트|light/i.test(n)) claims.push('light');
  if (/저칼로리|로우칼로리|low\s*cal/i.test(n)) claims.push('low_calorie');
  if (/저나트륨/i.test(n)) claims.push('low_sodium');
  if (/저지방/i.test(n)) claims.push('low_fat');
  return [...new Set(claims)];
}

const ACCENT_COLORS = ['#3182f6', '#15a06e', '#f59f00', '#6d4ad6', '#e07a9b', '#0b6bcb'];

function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ACCENT_COLORS[h % ACCENT_COLORS.length];
}

/**
 * 바코드 제품정보 row + (선택) 영양성분 row 를 우리 Product 모델로 변환해요.
 * 식약처 API에는 원재료명·당알코올·카페인이 빠질 수 있어, 가능한 값만 채우고
 * 감미료는 제품명에서 추정해요. (원재료가 있으면 그걸로 더 정확히 추정)
 */
export function mapToProduct(
  barcode: string,
  productRow: MfdsRow,
  nutritionRow: MfdsRow | null,
): Product {
  const name = productRow[BARCODE_FIELDS.name] ?? nutritionRow?.[NUTRITION_FIELDS.name] ?? '이름 미상 제품';
  const maker = productRow[BARCODE_FIELDS.maker] ?? nutritionRow?.[NUTRITION_FIELDS.maker] ?? '제조사 미상';
  const category = productRow[BARCODE_FIELDS.foodType] ?? nutritionRow?.[NUTRITION_FIELDS.group] ?? '기타';

  const serving = parseServing(nutritionRow?.[NUTRITION_FIELDS.servingSize]);

  const nutrition: NutritionFacts = {
    servingSize: serving.size,
    servingUnit: serving.unit,
    servingsPerContainer: 1, // API로는 알기 어려워 기본 1로 둬요.
    calories: nutritionRow ? num(nutritionRow, NUTRITION_FIELDS.calories) : 0,
    carbohydrate: nutritionRow ? num(nutritionRow, NUTRITION_FIELDS.carbohydrate) : 0,
    sugars: nutritionRow ? num(nutritionRow, NUTRITION_FIELDS.sugars) : 0,
    sugarAlcohol: 0, // 식약처 표준 항목에 없어 0으로 둬요.
    protein: nutritionRow ? num(nutritionRow, NUTRITION_FIELDS.protein) : 0,
    fat: nutritionRow ? num(nutritionRow, NUTRITION_FIELDS.fat) : 0,
    saturatedFat: nutritionRow ? num(nutritionRow, NUTRITION_FIELDS.saturatedFat) : 0,
    transFat: nutritionRow ? num(nutritionRow, NUTRITION_FIELDS.transFat) : 0,
    sodium: nutritionRow ? num(nutritionRow, NUTRITION_FIELDS.sodium) : 0,
    caffeine: 0,
  };

  // 원재료명 필드가 있으면 그걸로, 없으면 제품명으로 감미료를 추정해요.
  const ingredientsRaw = productRow['RAWMTRL_NM'] ?? productRow['IRDNT_NM'] ?? '';
  const ingredients = ingredientsRaw
    ? ingredientsRaw.split(/[,/]/).map((s) => s.trim()).filter(Boolean)
    : [];
  const sweetenerIds = detectSweetenersFromIngredients(
    ingredients.length > 0 ? ingredients : [name],
  );

  return {
    barcode,
    name,
    brand: maker,
    category,
    claims: detectClaimsFromName(name),
    ingredients,
    sweetenerIds,
    nutrition,
    accentColor: colorFor(name),
  };
}
